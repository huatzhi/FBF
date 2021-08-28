const { Bar, DataSet } = require("../../../../../shared/database/models/index");

/**
 * Handle most of the candle determination
 */
class CandleStickFactory {
  /**
   * Setup factory
   * @param {object} dataSet
   * @param {string} key
   * @param {object} att - generally empty
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

    this.pastFiveOpen = [];
    this.pastFiveHigh = [];
    this.pastFiveLow = [];
    this.pastFiveClose = [];

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
      { open: 1, high: 1, low: 1, close: 1 }
    )
      .sort({ datetime: -1 })
      .limit(5)
      .lean();

    this.pastFiveOpen = pastProcessedCandleInPeriod
      .map((b) => b.open)
      .reverse();
    this.pastFiveHigh = pastProcessedCandleInPeriod
      .map((b) => b.high)
      .reverse();
    this.pastFiveLow = pastProcessedCandleInPeriod.map((b) => b.low).reverse();
    this.pastFiveClose = pastProcessedCandleInPeriod
      .map((b) => b.close)
      .reverse();
  }

  /**
   * Use past five candle to determine candle stick pattern, return null if not enough to determine
   * @private
   * @abstract
   * @return {number | null}
   */
  hasPattern() {
    throw new Error("this function require implementation");
  }

  /**
   * Use past five candle to determine candle stick pattern, return null if not enough to determine
   * @private
   * @static
   * @param {array} arr
   * @param {any} value
   * @return {void}
   */
  static appendMaxFive(arr, value) {
    arr.push(value);
    if (arr.length > 5) {
      arr.shift();
    }
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
      CandleStickFactory.appendMaxFive(this.pastFiveOpen, bar.open);
      CandleStickFactory.appendMaxFive(this.pastFiveHigh, bar.high);
      CandleStickFactory.appendMaxFive(this.pastFiveLow, bar.low);
      CandleStickFactory.appendMaxFive(this.pastFiveClose, bar.close);

      const result = this.hasPattern();

      const output = {
        updateOne: {
          filter: { _id: bar._id },
          update: { [updateKey]: result },
        },
      };

      if (result !== 0 && result !== 1) {
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
}

module.exports = { CandleStickFactory };
