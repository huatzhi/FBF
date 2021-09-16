const Scripts = {
  1: require("./1/loadDataFromCsvToDb"),
  2: require("./2/updateIndicatorValues"),
  2.1: require("./2.1/addNewIndicator"),
  3: require("./3/fillResult"),
  3.1: require("./3.1/addNewResult"),
  4: require("./4/exportToCsv"),
  4.1: require("./4.1/exportToCsv"),
};

module.exports = Scripts;
