/**
 * Type of result.
 * Different type of result will be calculated differently
 */
const ResultTypes = {
  // standard result calculated TP and SL relative to ATR
  STANDARD: "standard",

  // binary result calculated based on whether n amount of bar later is bullish or bearish
  // BINARY: 'binary',  // not implemented

  // fixed result calculated TP and SL based on fixed pip value
  // FIXED: 'fixed',  // not implemented
};

const Result = {
  NONE: [0, 0, 1],
  LONG: [1, 0, 0],
  SHORT: [0, 1, 0],
  BOTH: [1, 1, 0],
};

module.exports = {
  Result,
  ResultTypes,
};
