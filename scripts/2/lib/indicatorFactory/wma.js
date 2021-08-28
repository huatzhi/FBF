const WMA = require("technicalindicators").WMA;
const { Bar, DataSet } = require("../../../../shared/database/models/index");

/**
 * Functions that fill up WMA values
 */
class WmaFactory {
  /**
   * Setup a factory that fill up WMA values of certain dataSet
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
      this.wma = new WMA({ period: this.period, values: [] });
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

    this.wma = new WMA({ period: this.period, values });
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
      const result = this.wma.nextValue(bar.close);

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
}

module.exports = WmaFactory;
