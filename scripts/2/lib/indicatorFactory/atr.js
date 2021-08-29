const ATR = require("technicalindicators").ATR;
const { Bar, DataSet } = require("../../../../shared/database/models/index");

/**
 * Functions that fill up ATR values
 */
class AtrFactory {
  /**
   * Setup a factory that fill up ATR values of certain dataSet
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
    this.period = att.period ?? 14;
    this.initialized = false;
  }

  /**
   * If there are previous processed, init with previously processed data
   * @private
   * @return {Promise<void>}
   */
  async init() {
    this.initialized = true;
    if (!this.lastProcessedCandle) {
      this.atr = new ATR({ period: this.period, high: [], low: [], close: [] });
      return;
    }

    if (this.lastBar <= this.lastProcessedCandle) {
      this.completed = true;
      return;
    }

    const pastProcessedCandleInPeriod = await Bar.find(
      {
        instrument: this.instrument,
        timeFrame: this.timeFrame,
        datetime: { $lte: this.lastProcessedCandle },
      },
      { high: 1, low: 1, close: 1 }
    )
      .sort({ datetime: -1 })
      .limit(this.period)
      .lean();

    const high = pastProcessedCandleInPeriod.map((b) => b.high).reverse();
    const low = pastProcessedCandleInPeriod.map((b) => b.low).reverse();
    const close = pastProcessedCandleInPeriod.map((b) => b.close).reverse();

    this.atr = new ATR({ period: this.period, high, low, close });
  }

  /**
   * fill up the indicator values based on batch
   * @private
   * @param {number} batch
   * @return {Promise<void>}
   */
  async fillNext(batch = 100) {
    const barQuery = {
      instrument: this.instrument,
      timeFrame: this.timeFrame,
    };
    if (this.lastProcessedCandle) {
      barQuery.datetime = { $gt: this.lastProcessedCandle };
    }
    const bars = await Bar.find(barQuery, {
      high: 1,
      low: 1,
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
      const updateKey = `atr.${this.period}`;

      const result = this.atr.nextValue({
        high: bar.high,
        low: bar.low,
        close: bar.close,
      });

      const output = {
        updateOne: {
          filter: { _id: bar._id },
          update: { [updateKey]: result }, // for other indicators it suppose to be `indicator.${this.key}`
        },
      };

      if (!result) {
        output.updateOne.update[updateKey] = null;
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
    return `"${ind.key}"`;
  }

  /**
   * Get value of indicator from bar
   * @param {object} ind
   * @param {object} bar
   * @return {(*|number)[]}
   */
  static getCsvContent(ind, bar) {
    const p = ind.att.period ?? 14;
    return [bar.atr[p]];
  }
}

module.exports = AtrFactory;

// todo :: use sma ATR instead
