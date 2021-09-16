const { CandleStickFactory } = require("./Candle");
const { bullishharami } = require("technicalindicators");

/**
 * A candlestick pattern.
 */
class BullishharamiFactory extends CandleStickFactory {
  /**
   * Setup factory
   * @param {object} dataSet
   * @param {string} key
   * @param {object} att - generally empty
   */
  constructor(dataSet, key, att) {
    super(dataSet, key, att);
  }

  /**
   * Use past five candle to determine candle stick pattern, return null if not enough to determine
   * @private
   * @abstract
   * @return {number | null}
   */
  hasPattern() {
    if (this.pastFiveOpen.length < 5) {
      return null;
    }
    return Number(
      bullishharami({
        open: this.pastFiveOpen,
        high: this.pastFiveHigh,
        low: this.pastFiveLow,
        close: this.pastFiveClose,
      })
    );
  }
}

module.exports = BullishharamiFactory;
