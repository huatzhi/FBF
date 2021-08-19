/**
 * Type of indicator.
 * Different type of indicator will have different way to be handled, probably transformed for learning later
 */
const IndicatorTypes = {
  // Refer to atr indicator, which will be store separately from other indicators.
  ATR: "atr",

  // Refer to price values other than indicator.
  // What matter include comparison (higher or lower) and range between each other relative to ATR value.
  PRICE: "price",

  // Refer mainly to boolean value (0 or 1).
  BINARY: "binary",

  // Refer to value that require its own handling method
  CUSTOM: "custom",
};

module.exports = {
  IndicatorTypes,
};
