const KST = require("technicalindicators").KST;
const { Bar, DataSet } = require("../../../../shared/database/models/index");

/**
 * Functions that fill up Know Sure Thing values
 */
class KstFactory {
  /**
   * Setup a factory that fill up Know Sure Thing values of certain dataSet
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

    this.ROCPer1 = att.ROCPer1 ?? 10;
    this.ROCPer2 = att.ROCPer2 ?? 15;
    this.ROCPer3 = att.ROCPer3 ?? 20;
    this.ROCPer4 = att.ROCPer4 ?? 30;
    this.SMAROCPer1 = att.SMAROCPer1 ?? 10;
    this.SMAROCPer2 = att.SMAROCPer2 ?? 10;
    this.SMAROCPer3 = att.SMAROCPer3 ?? 10;
    this.SMAROCPer4 = att.SMAROCPer4 ?? 15;
    this.signalPeriod = att.signalPeriod ?? 9;

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
      this.kst = new KST({
        values: [],
        ROCPer1: this.ROCPer1,
        ROCPer2: this.ROCPer2,
        ROCPer3: this.ROCPer3,
        ROCPer4: this.ROCPer4,
        SMAROCPer1: this.SMAROCPer1,
        SMAROCPer2: this.SMAROCPer2,
        SMAROCPer3: this.SMAROCPer3,
        SMAROCPer4: this.SMAROCPer4,
        signalPeriod: this.signalPeriod,
      });
      return;
    }

    if (this.lastBar <= this.lastProcessedCandle) {
      this.completed = true;
      return;
    }

    const requiredBars = this.ROCPer4 + this.SMAROCPer4 + this.signalPeriod;

    const pastProcessedCandleInPeriod = await Bar.find(
      {
        instrument: this.instrument,
        timeFrame: this.timeFrame,
        datetime: { $lte: this.lastProcessedCandle },
      },
      { high: 1, low: 1, close: 1 }
    )
      .sort({ datetime: -1 })
      .limit(requiredBars)
      .lean();

    const values = pastProcessedCandleInPeriod.map((b) => b.close).reverse();

    this.kst = new KST({
      values,
      ROCPer1: this.ROCPer1,
      ROCPer2: this.ROCPer2,
      ROCPer3: this.ROCPer3,
      ROCPer4: this.ROCPer4,
      SMAROCPer1: this.SMAROCPer1,
      SMAROCPer2: this.SMAROCPer2,
      SMAROCPer3: this.SMAROCPer3,
      SMAROCPer4: this.SMAROCPer4,
      signalPeriod: this.signalPeriod,
    });
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
      const result = this.kst.nextValue(bar.close);

      const output = {
        updateOne: {
          filter: { _id: bar._id },
          update: { [updateKey]: result },
        },
      };

      if (!result) {
        output.updateOne.update[updateKey] = null;
      }

      if (!result?.signal) {
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

module.exports = KstFactory;
