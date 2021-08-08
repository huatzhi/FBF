const mongoose = require("mongoose");
const settings = require("../../../settings");

/**
 * DataSet - an instrument timeframe paired set of data
 */
const DataSetSchema = new mongoose.Schema(
  {
    // instrument name, e.g. 'USDCAD'
    instrument: String,

    // time frame used for the bar, e.g. 'D1', 'H4', 'M5'
    timeFrame: String,

    // last bar's datetime
    lastBar: Date,

    // version of current document
    version: { type: String, default: settings.version },

    // datetime of last processed bar (so next time will start checking from here)
    processed: {
      // e.g. {'RSI(14)': ISODate(...)}
      indicator: { type: JSON, default: {} },
      // e.g. {'basic': ISODate(...)}
      result: { type: JSON, default: {} },
    },
  },
  {
    timestamps: true,
  }
);

// instrument, tf combination must be unique
// a set of data is combination of instrument and timeframe
DataSetSchema.index(
  { instrument: 1, timeFrame: 1 },
  { unique: true, require: true }
);

const DataSet = mongoose.model("DataSet", DataSetSchema, "DataSet");

module.exports = DataSet;
