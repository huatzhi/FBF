const options = {
  instrumentsLimit: [
    "AUDCAD",
    "AUDCHF",
    "AUDJPY",
    "AUDNZD",
    "EURAUD",
    "EURCAD",
    "EURGBP",
    "EURJPY",
    "EURNZD",
    "EURUSD",
    "GBPAUD",
    "GBPCAD",
    "GBPJPY",
    "GBPNZD",
    "NZDCAD",
    "NZDJPY",
    "NZDUSD",
    "USDCAD",
    "USDCHF",
    "USDJPY",
  ],
  timeFrameLimit: ["H1"],
  indicatorKeyLimit: ["CHI(10,5,1)", "MACD(12,26,9,t,t)", "EMA(200)"],
  indicatorTypeLimit: [],
  resultKey: "Basic(14,3,4_5,20)",
  includeDateTime: true,
  includesTPSL: true,
  includeDisqualified: false, // TODO :: fix this option
  completeFileName: false,
};

module.exports = options;
