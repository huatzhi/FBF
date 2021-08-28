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
  // macd
  {
    key: "MACD(5,8,3,f,f)",
    type: IndicatorTypes.CUSTOM,
    name: "macd",
    att: {
      fastPeriod: 5,
      slowPeriod: 8,
      signalPeriod: 3,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    },
  },
  {
    key: "MACD(5,8,3,t,t)",
    type: IndicatorTypes.CUSTOM,
    name: "macd",
    att: {
      fastPeriod: 5,
      slowPeriod: 8,
      signalPeriod: 3,
      SimpleMAOscillator: true,
      SimpleMASignal: true,
    },
  },
  {
    key: "MACD(12,26,9,f,f)",
    type: IndicatorTypes.CUSTOM,
    name: "macd",
    att: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    },
  },
  {
    key: "MACD(12,26,9,t,t)",
    type: IndicatorTypes.CUSTOM,
    name: "macd",
    att: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: true,
      SimpleMASignal: true,
    },
  },
  {
    key: "MACD(19,39,9,f,f)",
    type: IndicatorTypes.CUSTOM,
    name: "macd",
    att: {
      fastPeriod: 19,
      slowPeriod: 39,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    },
  },
  {
    key: "MACD(19,39,9,t,t)",
    type: IndicatorTypes.CUSTOM,
    name: "macd",
    att: {
      fastPeriod: 19,
      slowPeriod: 39,
      signalPeriod: 9,
      SimpleMAOscillator: true,
      SimpleMASignal: true,
    },
  },
  // rate of change
  {
    key: "ROC(5)",
    type: IndicatorTypes.CUSTOM,
    name: "roc",
    att: {
      period: 5,
    },
  },
  {
    key: "ROC(9)",
    type: IndicatorTypes.CUSTOM,
    name: "roc",
    att: {
      period: 9,
    },
  },
  {
    key: "ROC(12)",
    type: IndicatorTypes.CUSTOM,
    name: "roc",
    att: {
      period: 12,
    },
  },
  {
    key: "ROC(20)",
    type: IndicatorTypes.CUSTOM,
    name: "roc",
    att: {
      period: 20,
    },
  },
  {
    key: "ROC(50)",
    type: IndicatorTypes.CUSTOM,
    name: "roc",
    att: {
      period: 50,
    },
  },
  {
    key: "ROC(100)",
    type: IndicatorTypes.CUSTOM,
    name: "roc",
    att: {
      period: 100,
    },
  },
  {
    key: "ROC(200)",
    type: IndicatorTypes.CUSTOM,
    name: "roc",
    att: {
      period: 200,
    },
  },
  // Relative Strength Index (RSI)
  {
    key: "RSI(5)",
    type: IndicatorTypes.CUSTOM,
    name: "rsi",
    att: {
      period: 5,
    },
  },
  {
    key: "RSI(9)",
    type: IndicatorTypes.CUSTOM,
    name: "rsi",
    att: {
      period: 9,
    },
  },
  {
    key: "RSI(14)",
    type: IndicatorTypes.CUSTOM,
    name: "rsi",
    att: {
      period: 14,
    },
  },
  {
    key: "RSI(20)",
    type: IndicatorTypes.CUSTOM,
    name: "rsi",
    att: {
      period: 20,
    },
  },
  {
    key: "RSI(50)",
    type: IndicatorTypes.CUSTOM,
    name: "rsi",
    att: {
      period: 50,
    },
  },
  {
    key: "RSI(100)",
    type: IndicatorTypes.CUSTOM,
    name: "rsi",
    att: {
      period: 100,
    },
  },
  {
    key: "RSI(200)",
    type: IndicatorTypes.CUSTOM,
    name: "rsi",
    att: {
      period: 200,
    },
  },
  // SMA
  {
    key: "SMA(5)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 5,
    },
  },
  {
    key: "SMA(9)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 9,
    },
  },
  {
    key: "SMA(14)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 14,
    },
  },
  {
    key: "SMA(20)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 20,
    },
  },
  {
    key: "SMA(50)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 50,
    },
  },
  {
    key: "SMA(72)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 72,
    },
  },
  {
    key: "SMA(100)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 100,
    },
  },
  {
    key: "SMA(200)",
    type: IndicatorTypes.PRICE,
    name: "sma",
    att: {
      period: 200,
    },
  },
  // Stochastic Oscillator
  {
    key: "KD(5,3)",
    type: IndicatorTypes.CUSTOM,
    name: "kd",
    att: {
      period: 5,
      signalPeriod: 3,
    },
  },
  {
    key: "KD(14,3)",
    type: IndicatorTypes.CUSTOM,
    name: "kd",
    att: {
      period: 14,
      signalPeriod: 3,
    },
  },
  {
    key: "KD(21,14)",
    type: IndicatorTypes.CUSTOM,
    name: "kd",
    att: {
      period: 21,
      signalPeriod: 14,
    },
  },
  {
    key: "KD(72,20)",
    type: IndicatorTypes.CUSTOM,
    name: "kd",
    att: {
      period: 72,
      signalPeriod: 20,
    },
  },
  // TRIX
  {
    key: "TRIX(5)",
    type: IndicatorTypes.CUSTOM,
    name: "trix",
    att: {
      period: 5,
    },
  },
  {
    key: "TRIX(9)",
    type: IndicatorTypes.CUSTOM,
    name: "trix",
    att: {
      period: 9,
    },
  },
  {
    key: "TRIX(14)",
    type: IndicatorTypes.CUSTOM,
    name: "trix",
    att: {
      period: 14,
    },
  },
  {
    key: "TRIX(20)",
    type: IndicatorTypes.CUSTOM,
    name: "trix",
    att: {
      period: 20,
    },
  },
  {
    key: "TRIX(50)",
    type: IndicatorTypes.CUSTOM,
    name: "trix",
    att: {
      period: 50,
    },
  },
  {
    key: "TRIX(72)",
    type: IndicatorTypes.CUSTOM,
    name: "trix",
    att: {
      period: 72,
    },
  },
  // EMA
  {
    key: "EMA(5)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 5,
    },
  },
  {
    key: "EMA(9)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 9,
    },
  },
  {
    key: "EMA(14)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 14,
    },
  },
  {
    key: "EMA(20)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 20,
    },
  },
  {
    key: "EMA(50)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 50,
    },
  },
  {
    key: "EMA(72)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 72,
    },
  },
  {
    key: "EMA(100)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 100,
    },
  },
  {
    key: "EMA(200)",
    type: IndicatorTypes.PRICE,
    name: "ema",
    att: {
      period: 200,
    },
  },
  // WMA
  {
    key: "WMA(5)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 5,
    },
  },
  {
    key: "WMA(9)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 9,
    },
  },
  {
    key: "WMA(14)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 14,
    },
  },
  {
    key: "WMA(20)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 20,
    },
  },
  {
    key: "WMA(50)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 50,
    },
  },
  {
    key: "WMA(72)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 72,
    },
  },
  {
    key: "WMA(100)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 100,
    },
  },
  {
    key: "WMA(200)",
    type: IndicatorTypes.PRICE,
    name: "wma",
    att: {
      period: 200,
    },
  },
  // WEMA
  {
    key: "WEMA(5)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 5,
    },
  },
  {
    key: "WEMA(9)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 9,
    },
  },
  {
    key: "WEMA(14)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 14,
    },
  },
  {
    key: "WEMA(20)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 20,
    },
  },
  {
    key: "WEMA(50)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 50,
    },
  },
  {
    key: "WEMA(72)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 72,
    },
  },
  {
    key: "WEMA(100)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 100,
    },
  },
  {
    key: "WEMA(200)",
    type: IndicatorTypes.PRICE,
    name: "wema",
    att: {
      period: 200,
    },
  },
  // WilliamsR
  {
    key: "WR(5)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 5,
    },
  },
  {
    key: "WR(9)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 9,
    },
  },
  {
    key: "WR(14)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 14,
    },
  },
  {
    key: "WR(20)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 20,
    },
  },
  {
    key: "WR(50)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 50,
    },
  },
  {
    key: "WR(72)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 72,
    },
  },
  {
    key: "WR(100)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 100,
    },
  },
  {
    key: "WR(200)",
    type: IndicatorTypes.CUSTOM,
    name: "wr",
    att: {
      period: 200,
    },
  },
  // Ichimoku Cloud
  {
    key: "IC(9,26,52)",
    type: IndicatorTypes.PRICE,
    name: "ichimoku",
    att: {
      conversionPeriod: 9,
      basePeriod: 26,
      spanPeriod: 52,
      // displacement: 26,
    },
  },
  {
    key: "IC(8,22,44)",
    type: IndicatorTypes.PRICE,
    name: "ichimoku",
    att: {
      conversionPeriod: 8,
      basePeriod: 22,
      spanPeriod: 44,
    },
  },
  {
    key: "IC(9,30,60)",
    type: IndicatorTypes.PRICE,
    name: "ichimoku",
    att: {
      conversionPeriod: 9,
      basePeriod: 30,
      spanPeriod: 60,
    },
  },
  {
    key: "IC(12,24,120)",
    type: IndicatorTypes.PRICE,
    name: "ichimoku",
    att: {
      conversionPeriod: 12,
      basePeriod: 24,
      spanPeriod: 120,
    },
  },
  // Candlestick
  {
    key: "C(AB)",
    type: IndicatorTypes.BINARY,
    name: "abandonedbaby",
    att: {},
  },
  {
    key: "C(BEEB)",
    type: IndicatorTypes.BINARY,
    name: "bearishengulfingpattern",
    att: {},
  },
  {
    key: "C(BUEB)",
    type: IndicatorTypes.BINARY,
    name: "bullishengulfingpattern",
    att: {},
  },
  {
    key: "C(DCC)",
    type: IndicatorTypes.BINARY,
    name: "darkcloudcover",
    att: {},
  },
  {
    key: "C(DTG)",
    type: IndicatorTypes.BINARY,
    name: "downsidetasukigap",
    att: {},
  },
  {
    key: "C(doji)",
    type: IndicatorTypes.BINARY,
    name: "doji",
    att: {},
  },
  {
    key: "C(DFD)",
    type: IndicatorTypes.BINARY,
    name: "dragonflydoji",
    att: {},
  },
  {
    key: "C(GSD)",
    type: IndicatorTypes.BINARY,
    name: "gravestonedoji",
    att: {},
  },
  {
    key: "C(BUH)",
    type: IndicatorTypes.BINARY,
    name: "bullishharami",
    att: {},
  },
  {
    key: "C(BEHC)",
    type: IndicatorTypes.BINARY,
    name: "bearishharamicross",
    att: {},
  },
  {
    key: "C(BUHC)",
    type: IndicatorTypes.BINARY,
    name: "bullishharamicross",
    att: {},
  },
  {
    key: "C(BUMBZ)",
    type: IndicatorTypes.BINARY,
    name: "bullishmarubozu",
    att: {},
  },
  {
    key: "C(BEMBZ)",
    type: IndicatorTypes.BINARY,
    name: "bearishmarubozu",
    att: {},
  },
  {
    key: "C(EDS)",
    type: IndicatorTypes.BINARY,
    name: "eveningdojistar",
    att: {},
  },
  {
    key: "C(ES)",
    type: IndicatorTypes.BINARY,
    name: "eveningstar",
    att: {},
  },
  {
    key: "C(BEH)",
    type: IndicatorTypes.BINARY,
    name: "bearishharami",
    att: {},
  },
  {
    key: "C(PL)",
    type: IndicatorTypes.BINARY,
    name: "piercingline",
    att: {},
  },
  {
    key: "C(BUST)",
    type: IndicatorTypes.BINARY,
    name: "bullishspinningtop",
    att: {},
  },
  {
    key: "C(BEST)",
    type: IndicatorTypes.BINARY,
    name: "bearishspinningtop",
    att: {},
  },
  {
    key: "C(MDS)",
    type: IndicatorTypes.BINARY,
    name: "morningdojistar",
    att: {},
  },
  {
    key: "C(MS)",
    type: IndicatorTypes.BINARY,
    name: "morningstar",
    att: {},
  },
  {
    key: "C(TBC)",
    type: IndicatorTypes.BINARY,
    name: "threeblackcrows",
    att: {},
  },
  {
    key: "C(TWC)",
    type: IndicatorTypes.BINARY,
    name: "threewhitesoldiers",
    att: {},
  },
  {
    key: "C(BuHammer)",
    type: IndicatorTypes.BINARY,
    name: "bullishhammer",
    att: {},
  },
  {
    key: "C(BeHammer)",
    type: IndicatorTypes.BINARY,
    name: "bearishhammer",
    att: {},
  },
  {
    key: "C(BuIHammer)",
    type: IndicatorTypes.BINARY,
    name: "bullishinvertedhammer",
    att: {},
  },
  {
    key: "C(BeIHammer)",
    type: IndicatorTypes.BINARY,
    name: "bearishinvertedhammer",
    att: {},
  },
  {
    key: "C(hammer)",
    type: IndicatorTypes.BINARY,
    name: "hammer",
    att: {},
  },
  {
    key: "C(hammer_u)",
    type: IndicatorTypes.BINARY,
    name: "hammerunconfirmed",
    att: {},
  },
  {
    key: "C(HM)",
    type: IndicatorTypes.BINARY,
    name: "hangingman",
    att: {},
  },
  {
    key: "C(HM_u)",
    type: IndicatorTypes.BINARY,
    name: "hangingmanunconfirmed",
    att: {},
  },
  {
    key: "C(SS)",
    type: IndicatorTypes.BINARY,
    name: "shootingstar",
    att: {},
  },
  {
    key: "C(SS_u)",
    type: IndicatorTypes.BINARY,
    name: "shootingstarunconfirmed",
    att: {},
  },
  {
    key: "C(TT)",
    type: IndicatorTypes.BINARY,
    name: "tweezertop",
    att: {},
  },
  {
    key: "C(TB)",
    type: IndicatorTypes.BINARY,
    name: "tweezerbottom",
    att: {},
  },
];

module.exports = newIndicators;
