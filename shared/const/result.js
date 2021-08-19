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

module.exports = {
  ResultTypes,
};
