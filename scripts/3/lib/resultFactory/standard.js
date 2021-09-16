const { evaluate } = require("mathjs");
const { Result } = require("../../../../shared/const/result");
const { Bar, DataSet } = require("../../database/models/index");

/**
 * Function that fill up standard result
 */
class StandardResultFactory {
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
    this.lastProcessedCandle = dataSet.processed?.result?.[key];
    this.lastConfirmedProcessedCandle = dataSet.processed?.result?.[key];
    this.lastBar = dataSet.lastBar;
    this.key = key;
    this.atrPeriod = att.atrPeriod ?? 14;
    this.tpRatio = att.tp ?? 3;
    this.slRatio = att.sl ?? 1.5;
    this.tradeLength = att.tradeLength ?? 10;

    this.resultAwaitingQueue = [];
  }

  /**
   * fill result values by batches
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
      [`atr.${this.atrPeriod}`]: 1,
    })
      .sort({ datetime: 1 })
      .limit(100)
      .lean();

    if (!bars.length) {
      this.completed = true;
      return;
    }

    const bulkWriteQueries = [];

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];

      // query that generated from resolved queue
      const writeQueries = this.handlePreviousQueries(bar.high, bar.low);
      bulkWriteQueries.push(...writeQueries);

      // add new obj to queue
      this.appendResultQueue(bar);
    }

    await Bar.bulkWrite(bulkWriteQueries);

    this.lastProcessedCandle = bars[bars.length - 1].datetime;
    const barIndexForConfirmed = bars.length - this.tradeLength;

    // dont update dataset if none of the bar is confirmed updated
    // confirmed updated means that the result is have enough trade length to be inevitably calculated
    if (barIndexForConfirmed < 0) {
      return;
    }

    this.lastConfirmedProcessedCandle =
      bars[bars.length - this.tradeLength].datetime;
    await DataSet.updateOne(
      { _id: this.dataSetId },
      { [`processed.result.${this.key}`]: this.lastConfirmedProcessedCandle }
    );
  }

  /**
   * Get lower and higher end of the range, use for getting sl and tp values
   * @param {number} price - current price value
   * @param {number} atr - current atr value
   * @param {number} atrRatio - sl / tp ratio use
   * @return {{lower:number, higher: number}} - [lower, higher]
   */
  getPriceRange(price, atr, atrRatio) {
    const range = evaluate(`${atr} * ${atrRatio}`);
    const higher = evaluate(`${price} + ${range}`);
    const lower = evaluate(`${price} - ${range}`);
    return { lower, higher };
  }

  /**
   * add object to result queue
   * @param {object} bar - must consist `close` and `atr value`
   */
  appendResultQueue(bar) {
    // if there is no atr value, dont calculate
    if (!bar.atr[this.atrPeriod]) {
      return;
    }

    const { lower: SL_LONG, higher: SL_SHORT } = this.getPriceRange(
      bar.close,
      bar.atr[this.atrPeriod],
      this.slRatio
    );
    const { lower: TP_SHORT, higher: TP_LONG } = this.getPriceRange(
      bar.close,
      bar.atr[this.atrPeriod],
      this.tpRatio
    );

    const queueObj = {
      bar,
      SL_LONG,
      SL_SHORT,
      TP_SHORT,
      TP_LONG,
      long: true,
      short: true,
      longDecided: false,
      shortDecided: false,
      decided: false,
      barLeft: this.tradeLength,
    };

    this.resultAwaitingQueue.push(queueObj);
  }

  /**
   * Try to resolve queue obj's result. If resolved, remove from queue.
   * @param {number} high
   * @param {number} low
   * @return {object[]}
   */
  handlePreviousQueries(high, low) {
    const updateKey = `result.${this.key}`;
    const queries = [];

    this.resultAwaitingQueue.map((q) => {
      q.barLeft--;

      if (q.long && !q.longDecided && low <= q.SL_LONG) {
        q.long = false;
        q.longDecided = true;
      }

      if (q.short && !q.shortDecided && high >= q.SL_SHORT) {
        q.short = false;
        q.shortDecided = true;
      }

      if (!q.short && !q.long) {
        q.decided = true;
      }

      if (q.long && !q.longDecided && high >= q.TP_LONG) {
        q.longDecided = true;
      }

      if (q.short && !q.shortDecided && low <= q.TP_SHORT) {
        q.shortDecided = true;
      }

      if (q.longDecided && q.shortDecided) {
        q.decided = true;
      }

      if (q.barLeft <= 0 && !q.decided) {
        q.decided = true;
        if (!q.longDecided) {
          q.long = false;
        }
        if (!q.shortDecided) {
          q.short = false;
        }
      }

      if (q.decided) {
        let result = Result.NONE;
        if (q.long) {
          result = Result.LONG;
        }
        if (q.short) {
          result = Result.SHORT;
        }
        if (q.long && q.short) {
          result = Result.BOTH;
        }

        const toWrite = {
          updateOne: {
            filter: { _id: q.bar._id },
            update: {
              [updateKey]: {
                result,
                TP_LONG: q.TP_LONG,
                SL_LONG: q.SL_LONG,
                TP_SHORT: q.TP_SHORT,
                SL_SHORT: q.SL_SHORT,
              },
            },
          },
        };

        queries.push(toWrite);
      }
    });

    // remove any queue object that is resolved
    this.resultAwaitingQueue = this.resultAwaitingQueue.filter(
      (q) => !q.decided
    );

    return queries;
  }

  /**
   * fill result values
   * @return {Promise<void>}
   */
  async fill() {
    this.completed = false;
    const batchSize = Math.max(100, this.tradeLength);
    while (!this.completed) {
      await this.fillNext(batchSize);
    }
  }
}

module.exports = StandardResultFactory;
