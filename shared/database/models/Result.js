const mongoose = require("mongoose");
const { ResultTypes } = require("../../const/result");

/**
 * Defining result feature
 * @constructor Result
 */
const ResultSchema = new mongoose.Schema(
  {
    // Result key, e.g. 'ATR(10)'.
    key: { type: String, index: true, unique: true, required: true },

    // Result type
    type: { type: String, enum: Object.values(ResultTypes), index: true },

    // attributes and values, e.g. {atrPeriod: 14, sl: 1.2, tp: 3.5, tradeLength: 10}
    att: { type: JSON, default: {} },
  },
  {
    timestamps: true,
  }
);

/** @type {Model<Result>} */
const Result = mongoose.model("Result", ResultSchema, "Result");

module.exports = Result;
