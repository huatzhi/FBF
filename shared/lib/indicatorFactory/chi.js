/** CHOP INDEX (custom) */
const { Bar, DataSet } = require("../../database/models/index");
require('../preload/index');

/**
 * Functions that fill up Chop Index values.
 * 
 * Chop index is a custom indicator that try to determine how choppy 
 * is the market at the moment. It use candle direction of the past 
 * data to determine that.
 * 
 * Value output is 0-100, the lower tha value, the more choppy the 
 * market. Generally is adviced to not trade in choppy market. 
 */
class ChiFactory {
    /**
   * Setup a factory that fill up CHI values of certain dataSet
   * @param {object} dataSet
   * @param {string} key
   * @param {object} att
   */
  constructor(dataSet, key, att) {
    this.dataSetId = dataSet._id;
    /** @type {string} */
    this.instrument = dataSet.instrument;
    /** @type {string} */
    this.timeFrame = dataSet.timeFrame;
    /** @type {Date} */
    this.lastProcessedCandle = dataSet.processed?.indicator?.[key];
    this.lastBar = dataSet.lastBar;
    this.key = key;

    /** @type {Number}
     * 
     * How far the choppyness is detemined */
    this.period = att.period ?? 10;

    /** @type {Number}
     * 
     * Each candle of chopyness how far is used */
    this.subPeriod = att.subPeriod ?? 5;

    /** @type {Number}
     * 
     * Acceptable choppy value, how less choppy it should within
     * subPeriod to determine it is not chop.
     * 
     * Acceptable range from 0-(subPeriod/2) */
    this.tolerant = att.tolerant ?? 1;

    this.initialized = false;

    // custom indicator private values
    /** @type boolean[] */
    this.isSubPeriodChoppyStack = [];
    /** @type Array<'g'|'r'|'w'> */
    this.pastBarColorStack = [];
    this.smoothThresholdCount = this.subPeriod - this.tolerant;
  }

  /**
   * If there are previous processed, init with previously processed data
   * @private
   * @return {Promise<void>}
   */
  async init() {
    this.initialized = true;
    if (!this.lastProcessedCandle) {
      return;
    }

    if (this.lastBar <= this.lastProcessedCandle) {
      this.completed = true;
      return;
    }

    const requiredBars = this.period + this.subPeriod - 1;

    const pastProcessedCandleInPeriod = await Bar.find(
      {
        instrument: this.instrument,
        timeFrame: this.timeFrame,
        datetime: { $lte: this.lastProcessedCandle },
      },
      { open: 1, close: 1 }
    )
      .sort({ datetime: -1 })
      .limit(requiredBars)
      .lean();

    const values = pastProcessedCandleInPeriod.map((b) => b.close).reverse();

    values.forEach(({open, close}) => {
      calc(open, close);
    });
  }

  /**
   * Calculate choppy index (0-100)
   * 
   * @private
   * @param open {Number}
   * @param close {Number}
   * @return {Number|null}
   */
  calc(open, close) {
    const isNewSubPeriodSmooth = this.isNewSubPeriodSmooth(open, close);
    if (isNewSubPeriodSmooth === null){
      return null;
    }

    this.isSubPeriodChoppyStack.push(isNewSubPeriodSmooth);

    if (this.isSubPeriodChoppyStack < this.period) {
      return null;
    }

    if (this.isSubPeriodChoppyStack > this.period) {
      this.isSubPeriodChoppyStack.shift();
    }

    const smoothCount = this.isSubPeriodChoppyStack.count(true);
    const smoothIndex = Math.floor(smoothCount/this.period*100);

    return smoothIndex;
  }

  /**
   * Given the new value, check if new subperiod consider smooth
   * 
   * @private
   * @param {Number} open 
   * @param {Number} close 
   * @return {Boolean|null}
   */
  isNewSubPeriodSmooth(open, close) {
    if (open === close) {
      this.pastBarColorStack.push('w')
    } else {
      const color = open > close ? 'r' : 'g';
      this.pastBarColorStack.push(color);
    }

    if (this.pastBarColorStack.length < this.subPeriod) {
      return null;
    }

    if (this.pastBarColorStack.length > this.subPeriod) {
      this.pastBarColorStack.shift();
    }

    const rCount = this.pastBarColorStack.count('r');
    const gCount = this.pastBarColorStack.count('g');

    return Boolean(rCount >= this.smoothThresholdCount || gCount >= this.smoothThresholdCount);
  }

  /**
   * fill up the indicator values based on batch
   * @private
   * @param {number} batch
   * @return {Promise<void>}
   */
  async fillNext(batch = 100) {
    const updateKey = `indicators.${this.key}`;

    const barQuery = {
      instrument: this.instrument,
      timeFrame: this.timeFrame,
    };
    if (this.lastProcessedCandle) {
      barQuery.datetime = { $gt: this.lastProcessedCandle };
    }
    const bars = await Bar.find(barQuery, {
      open: 1,
      close: 1,
      datetime: 1,
    })
      .sort({ datetime: 1 })
      .limit(100)
      .lean();

    if (!bars.length) {
      this.completed = true;
      return;
    }

    const bulkWriteQueries = bars.map((bar) => {
      const result = this.calc(bar.open, bar.close);

      const output = {
        updateOne: {
          filter: { _id: bar._id },
          update: { [updateKey]: result },
        },
      };

      if (result === null) {
        output.updateOne.update.disqualified = true;
      }

      return output;
    });

    await Bar.bulkWrite(bulkWriteQueries);

    const lastBar = bars.pop();
    await DataSet.updateOne(
      { _id: this.dataSetId },
      { [`processed.indicator.${this.key}`]: lastBar.datetime }
    );
    this.lastProcessedCandle = lastBar.datetime;
  }

  /**
   * fill up indicator value for the dataset
   * @return {Promise<void>}
   */
  async fill() {
    this.completed = false;
    if (!this.initialized) {
      await this.init();
    }

    while (!this.completed) {
      await this.fillNext();
    }
  }

  /**
   * Get csv header substring from indicator
   * @param {object} ind
   * @return {string}
   */
  static getCsvHeaderString(ind) {
    const k = ind.key;
    return `"${k}"`;
  }

  /**
   * Get value of indicator from bar
   * @param {object} ind
   * @param {object} bar
   * @return {(*|number)[]}
   */
  static getCsvContent(ind, bar) {
    const k = ind.key;
    const val = bar.indicators[k];

    return [val];
  }
}