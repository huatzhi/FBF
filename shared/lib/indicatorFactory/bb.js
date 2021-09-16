const BB = require("technicalindicators").BollingerBands;
const { Bar, DataSet } = require("../../database/models/index");

/**
 * Functions that fill up Bollinger Bands values
 */
class BBFactory {
  /**
   * Setup a factory that fill up Bollinger Bands values of certain dataSet
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
    this.stdDev = att.stdDev ?? 2;
    this.ignoreMiddle = att.ignoreMiddle ?? false;

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
      this.bb = new BB({
        period: this.period,
        stdDev: this.stdDev,
        values: [],
      });
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

    const values = pastProcessedCandleInPeriod.map((b) => b.close).reverse();

    this.bb = new BB({ period: this.period, stdDev: this.stdDev, values });
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
      const result = this.bb.nextValue(bar.close);

      if (this.ignoreMiddle) {
        if (result?.middle) {
          delete result?.middle;
        }
      }

      const output = {
        updateOne: {
          filter: { _id: bar._id },
          update: { [updateKey]: result },
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
    const k = ind.key;
    if (ind?.att?.ignoreMiddle) {
      return `"${k}-upper","${k}-lower","${k}-pb"`;
    }

    return `"${k}-middle","${k}-upper","${k}-lower","${k}-pb"`;
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
    if (ind?.att?.ignoreMiddle) {
      return [val.upper, val.lower, val.pb];
    }

    return [val.middle, val.upper, val.lower, val.pb];
  }
}

module.exports = BBFactory;
