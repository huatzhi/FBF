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
  // ADX
  {
    key: "ADX(14)",
    type: IndicatorTypes.CUSTOM,
    name: "adx",
    att: {
      period: 14,
    },
  },
  {
    key: "ADX(7)",
    type: IndicatorTypes.CUSTOM,
    name: "adx",
    att: {
      period: 7,
    },
  },
  {
    key: "ADX(30)",
    type: IndicatorTypes.CUSTOM,
    name: "adx",
    att: {
      period: 30,
    },
  },
  // Awesome Oscillator
  {
    key: "AO(5,34)",
    type: IndicatorTypes.CUSTOM,
    name: "ao",
    att: {
      fastPeriod: 5,
      slowPeriod: 34,
    },
  },
  {
    key: "AO(7,24)",
    type: IndicatorTypes.CUSTOM,
    name: "ao",
    att: {
      fastPeriod: 7,
      slowPeriod: 24,
    },
  },
  {
    key: "AO(10,36)",
    type: IndicatorTypes.CUSTOM,
    name: "ao",
    att: {
      fastPeriod: 10,
      slowPeriod: 36,
    },
  },
  // Bollinger Bands
  {
    key: "BB(10,1_5)",
    type: IndicatorTypes.PRICE,
    name: "bb",
    att: {
      period: 10,
      stdDev: 1.5,
    },
  },
  {
    key: "BB(12,1)",
    type: IndicatorTypes.PRICE,
    name: "bb",
    att: {
      period: 12,
      stdDev: 1,
    },
  },
  {
    key: "BB(12,2)",
    type: IndicatorTypes.PRICE,
    name: "bb",
    att: {
      period: 12,
      stdDev: 2,
      ignoreMiddle: true,
    },
  },
  {
    key: "BB(14,1)",
    type: IndicatorTypes.PRICE,
    name: "bb",
    att: {
      period: 14,
      stdDev: 1,
    },
  },
  {
    key: "BB(14,2)",
    type: IndicatorTypes.PRICE,
    name: "bb",
    att: {
      period: 14,
      stdDev: 2,
      ignoreMiddle: true,
    },
  },
  {
    key: "BB(20,2)",
    type: IndicatorTypes.PRICE,
    name: "bb",
    att: {
      period: 20,
      stdDev: 2,
    },
  },
  {
    key: "BB(50,2_5)",
    type: IndicatorTypes.PRICE,
    name: "bb",
    att: {
      period: 50,
      stdDev: 2_5,
    },
  },
  // cci
  {
    key: "CCI(5)",
    type: IndicatorTypes.CUSTOM,
    name: "cci",
    att: {
      period: 5,
    },
  },
  {
    key: "CCI(10)",
    type: IndicatorTypes.CUSTOM,
    name: "cci",
    att: {
      period: 10,
    },
  },
  {
    key: "CCI(20)",
    type: IndicatorTypes.CUSTOM,
    name: "cci",
    att: {
      period: 20,
    },
  },
  {
    key: "CCI(40)",
    type: IndicatorTypes.CUSTOM,
    name: "cci",
    att: {
      period: 40,
    },
  },
  {
    key: "CCI(72)",
    type: IndicatorTypes.CUSTOM,
    name: "cci",
    att: {
      period: 72,
    },
  },
  {
    key: "CCI(100)",
    type: IndicatorTypes.CUSTOM,
    name: "cci",
    att: {
      period: 100,
    },
  },
  {
    key: "CCI(200)",
    type: IndicatorTypes.CUSTOM,
    name: "cci",
    att: {
      period: 200,
    },
  },
  // kst
  {
    key: "KST(default)",
    type: IndicatorTypes.CUSTOM,
    name: "kst",
    att: {
      ROCPer1: 10,
      ROCPer2: 15,
      ROCPer3: 20,
      ROCPer4: 30,
      SMAROCPer1: 10,
      SMAROCPer2: 10,
      SMAROCPer3: 10,
      SMAROCPer4: 15,
      signalPeriod: 9,
    },
  },
];

module.exports = newIndicators;
