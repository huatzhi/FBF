const Scripts = {
  1: require("./1/loadDataFromCsvToDb"),
  2: require("./2/updateIndicatorValues"),
  2.1: require("./2.1/addNewIndicator"),
  3: require("./3/fillResult"),
  3.1: require("./3.1/addNewResult"),
};

module.exports = Scripts;
