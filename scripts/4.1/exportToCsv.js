const options = require("./options/options");
const fs = require("fs");
const {
  Bar,
  DataSet,
  Indicator,
  Result,
} = require("../../shared/database/models/index");
const p = require("path");
const IndicatorFactory = require("../../shared/lib/indicatorFactory/index");

/**
 * Export data into csv based on
 * @return {Promise<void>}
 */
async function exportToCsv() {
  const dataSetQueries = {};

  if (options?.instrumentsLimit?.length) {
    dataSetQueries.instrument = { $in: options.instrumentsLimit };
  }

  if (options?.timeFrameLimit?.length) {
    dataSetQueries.timeFrame = { $in: options.timeFrameLimit };
  }

  const indicatorQueries = {};

  if (options?.indicatorTypeLimit?.length) {
    indicatorQueries.type = { $in: options.indicatorTypeLimit };
  }

  if (options?.indicatorKeyLimit?.length) {
    indicatorQueries.key = { $in: options.indicatorKeyLimit };
  }

  const [dataSets, indicators, resultObj] = await Promise.all([
    DataSet.find(dataSetQueries).lean(),
    Indicator.find(indicatorQueries).sort({ type: 1, key: 1 }).lean(),
    Result.findOne({ key: options.resultKey }).lean(),
  ]);

  const indicatorHeaders = indicators
    .map((i) => IndicatorFactory[i.name].getCsvHeaderString(i))
    .join();

  const dsHeader = `instrument,timeframe,`;
  const dtHeader = options.includeDateTime ? "datetime," : "";
  const candleHeaders = dsHeader + dtHeader + "O,H,L,C"; // backlog :: add date time category too later
  const resultHeaders = "RESULT(LONG),RESULT(SHORT),RESULT(NONE)";
  const csvHeader = `${candleHeaders},${indicatorHeaders},${resultHeaders}`;

  const totalTasks = dataSets.length;
  let taskFinished = 0;

  for (let i = 0; i < dataSets.length; i++) {
    await writeCsvFile(dataSets[i], indicators, csvHeader, resultObj, i);
    taskFinished++;
    console.log(`Task done - ${taskFinished}/${totalTasks}`);
  }
}

/**
 * write a csv output of dataset result
 * @param {object} dataSet
 * @param {object[]} indicators
 * @param {string} csvHeader
 * @param {object} resultObj
 * @param {number} forIndex
 * @return {Promise<void>}
 */
async function writeCsvFile(
  dataSet,
  indicators,
  csvHeader,
  resultObj,
  forIndex
) {
  const outputPath = p.resolve(__dirname, "./csv-output");

  const now = new Date();
  const outputFileName = `${now.getFullYear()}.${(
    "0" +
    (now.getMonth() + 1)
  ).slice(-2)}.${("0" + (now.getDate() + 1)).slice(-2)}-${resultObj.key}.csv`;

  const writer = fs.createWriteStream(`${outputPath}/${outputFileName}`, {
    flags: "a",
  });

  // add csv header
  if (!forIndex) {
    writer.write(csvHeader + "\n");
  }

  let lastOutputCandleDT = null;

  for (;;) {
    const barFindQuery = {
      disqualified: false,
      instrument: dataSet.instrument,
      timeFrame: dataSet.timeFrame,
    };
    if (lastOutputCandleDT) {
      barFindQuery.datetime = { $gt: lastOutputCandleDT };
    }

    const bars = await Bar.find(barFindQuery).limit(100).lean();
    if (!bars.length) {
      break;
    }

    const writeStrArr = bars.map((b) => {
      if (!b?.result?.[resultObj.key]) {
        return "";
      }
      const dataSetInfo = `${b.instrument},${b.timeFrame},`;
      // const dataSetInfo = "";
      const dtValue = options.includeDateTime
        ? `${new Date(b.datetime).toISOString()},`
        : "";
      const cValues = `${dataSetInfo}${dtValue}${b.open},${b.high},${b.low},${b.close}`;
      const values = indicators
        .map((ind) => {
          const vals = IndicatorFactory[ind.name].getCsvContent(ind, b);
          return vals.join();
        })
        .join();
      const result = b.result[resultObj.key].result.join();
      return `${cValues},${values},${result}\n`;
    });
    writer.write(writeStrArr.join(""));

    const lastBar = bars[bars.length - 1];
    lastOutputCandleDT = lastBar.datetime;
  }

  writer.end();
}

module.exports = exportToCsv;
