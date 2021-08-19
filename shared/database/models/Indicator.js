const mongoose = require("mongoose");
const { IndicatorTypes } = require("../../const/indicators");

/**
 * Defining indicator feature
 * @constructor Indicator
 */
const IndicatorSchema = new mongoose.Schema(
  {
    // Indicator key, e.g. 'ATR(10)'.
    key: { type: String, index: true, unique: true },

    // Indicator type
    type: { type: String, enum: Object.values(IndicatorTypes), index: true },

    // Indicator name - which will also be used as function name when generating indicator value
    name: String,

    // attributes and values, e.g. {period: 14}
    att: { type: JSON, default: {} },
  },
  {
    timestamps: true,
  }
);

/** @type {Model<Indicator>} */
const Indicator = mongoose.model("Indicator", IndicatorSchema, "Indicator");

module.exports = Indicator;
