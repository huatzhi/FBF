const { IndicatorTypes } = require("../../../shared/const/indicators");

const newIndicators = [
  {
    key: "ATR(14)",
    type: IndicatorTypes.ATR,
    name: "atr",
    att: {
      period: 14,
    },
  },
  {
    key: "ADX(14)",
    type: IndicatorTypes.ATR,
    name: "adx",
    att: {
      period: 14,
    },
  },
  {
    key: "ADX(7)",
    type: IndicatorTypes.ATR,
    name: "adx",
    att: {
      period: 7,
    },
  },
  {
    key: "ADX(30)",
    type: IndicatorTypes.ATR,
    name: "adx",
    att: {
      period: 30,
    },
  },
];

module.exports = newIndicators;
