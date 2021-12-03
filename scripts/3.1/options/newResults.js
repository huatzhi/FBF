const { ResultTypes } = require("../../../shared/const/result");

const newResults = [
  {
    key: "Basic(14,1_2,3_3,10)",
    type: ResultTypes.STANDARD,
    att: {
      atrPeriod: 14,
      sl: 1.2,
      tp: 3.3,
      tradeLength: 10,
    },
  },
  {
    key: "Basic(14,1_5,3,10)",
    type: ResultTypes.STANDARD,
    att: {
      atrPeriod: 14,
      sl: 1.5,
      tp: 3.0,
      tradeLength: 10,
    },
  },
  {
    key: "Basic(14,3,1_5,10)",
    type: ResultTypes.STANDARD,
    att: {
      atrPeriod: 14,
      sl: 3,
      tp: 1.5,
      tradeLength: 10,
    },
  },
  {
    key: "Basic(14,2,4,15)",
    type: ResultTypes.STANDARD,
    att: {
      atrPeriod: 14,
      sl: 2,
      tp: 4,
      tradeLength: 15,
    },
  },

  {
    key: "Basic(14,1_5,6,15)",
    type: ResultTypes.STANDARD,
    att: {
      atrPeriod: 14,
      sl: 1.5,
      tp: 6,
      tradeLength: 15,
    },
  },

  {
    key: "Basic(14,1_5,2_25,20)",
    type: ResultTypes.STANDARD,
    att: {
      atrPeriod: 14,
      sl: 1.5,
      tp: 2.25,
      tradeLength: 20,
    },
  },

  {
    key: "Basic(14,3,4_5,50)",
    type: ResultTypes.STANDARD,
    att: {
      atrPeriod: 14,
      sl: 3,
      tp: 4.5,
      tradeLength: 50,
    },
  },
];

module.exports = newResults;
