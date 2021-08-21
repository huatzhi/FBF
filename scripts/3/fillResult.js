const { DataSet, Result } = require("../../shared/database/models/index");
const options = require("./options/options");
const { eachLimit } = require("async");
const ResultFactories = require("./lib/resultFactory/index");
const {
  getAllCombinationsBetween,
} = require("../../shared/services/combination.service");

/**
 * Update result values based on option
 * @return {Promise<void>}
 */
async function updateResultValues() {
  const dataSetQueries = {};

  if (options?.instrumentsLimit?.length) {
    dataSetQueries.instrument = { $in: options.instrumentsLimit };
  }

  if (options?.timeFrameLimit?.length) {
    dataSetQueries.timeFrame = { $in: options.timeFrameLimit };
  }

  const resultQueries = {};

  if (options?.resultTypeLimit?.length) {
    resultQueries.type = { $in: options.resultTypeLimit };
  }

  if (options?.resultKeyLimit?.length) {
    resultQueries.key = { $in: options.resultKeyLimit };
  }

  const [dataSets, results] = await Promise.all([
    DataSet.find(dataSetQueries).lean(),
    Result.find(resultQueries).lean(),
  ]);

  const tasks = getAllCombinationsBetween(dataSets, results);

  const total = tasks.length;
  let taskDone = 0;
  console.log(`Task done - ${taskDone}/${total}`);
  await eachLimit(tasks, 2, async ({ dataSet, task: result }) => {
    console.log(
      `${new Date()} - fill ${dataSet.instrument}(${dataSet.timeFrame})'s ${
        result.key
      } START`
    );
    const factory = new ResultFactories[result.type](
      dataSet,
      result.key,
      result.att
    );

    await factory.fill();

    console.log(
      `${new Date()} - fill ${dataSet.instrument}(${dataSet.timeFrame})'s ${
        result.key
      } END`
    );
    taskDone++;
    console.log(`Task done - ${taskDone}/${total}`);
  });
}

module.exports = updateResultValues;
