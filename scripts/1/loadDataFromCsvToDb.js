const {
  walkThroughDirectory,
  getDataFromCsv,
} = require("../../shared/services/csv.service");
const {
  getInstrumentNameFromPath,
  getTimeFrameFromPath,
} = require("./lib/util");
const { getOrCreateDataSet } = require("../../shared/services/dataSet.service");
const { Bar, DataSet } = require("../../shared/database/models/index");
const { isTest } = require("../../settings/index");
const p = require("path");
const async = require("async");

/**
 * Get data from 'newData' folder, then load it into Bar model.
 * If new data are new DataSet, create new DataSet record as well.
 * @return {Promise<void>}
 */
async function loadDataFromCsvToDb() {
  const walkPath = p.resolve(__dirname, "./newData");
  const pathArr = await walkThroughDirectory(walkPath);

  await async.eachLimit(pathArr, 2, async (path) => {
    const instrument = getInstrumentNameFromPath(path);
    const timeFrame = getTimeFrameFromPath(path);

    const data = await getDataFromCsv(path);

    const dataSet = await getOrCreateDataSet(instrument, timeFrame);

    let toInsert = [];
    const length = isTest ? 5000 : data.length;
    for (let i = 0; i < length; i++) {
      if (dataSet.lastBar || data[i].datetime <= dataSet.lastBar) {
        continue;
      }

      const newBar = {
        ...data[i],
        instrument,
        timeFrame,
      };

      toInsert.push(newBar);
      const isLastItem = i === length - 1;

      if (i % 100 === 0 || isLastItem) {
        await Bar.insertMany(toInsert, { ordered: false, lean: true }).catch(
          () => {
            // check if its only duplicate issue
          }
        );
        await DataSet.updateOne(
          { _id: dataSet._id },
          { lastBar: data[i].datetime }
        );
        toInsert = [];
      }
    }
  });
}

module.exports = loadDataFromCsvToDb;
