const mongoose = require("mongoose");
const settings = require("../../../settings");

/**
 * Bar
 */
const BarSchema = new mongoose.Schema(
  {
    // instrument name, e.g. 'USDCAD'
    instrument: String,

    // time frame used for the bar, e.g. 'D1', 'H4', 'M5'
    timeFrame: String,

    // the time of the bar data
    datetime: Date,

    // bar open price
    open: Number,

    // bar highest price
    high: Number,

    // bar lowest price
    low: Number,

    // bar closed price
    close: Number,

    // version of current document
    version: { type: String, default: settings.version },

    // atr of the bar. format: {period: value}, e.g. {10: 0.00345, 14: 0.00459}
    atr: { type: JSON, default: {} },

    // indicator values. format: {indicator-key(params)[subkey]:values}
    // e.g. {'RSI(14)': 26.08, 'MACD(26,9,14)signal': 1.35229}
    indicators: { type: JSON, default: {} },

    // result values, format varies
    result: { type: JSON, default: {} },

    // when there is not enough past data to determine any of the indicator, bar is disqualified
    disqualified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

BarSchema.index(
  { instrument: 1, timeFrame: 1, datetime: 1 },
  { unique: true, require: true }
);
BarSchema.index({ disqualified: 1, instrument: 1, timeFrame: 1, datetime: 1 });

const Bar = mongoose.model("Bar", BarSchema, "Bar");

module.exports = Bar;
