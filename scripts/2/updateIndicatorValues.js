const { DataSet, Indicator } = require("../../shared/database/models/index");
const options = require("./options/options");
const { eachLimit } = require("async");
const IndicatorFactories = require("../../shared/lib/indicatorFactory/index");
const {
  getAllCombinationsBetween,
} = require("../../shared/services/combination.service");

/**
 * Update indicator values based on option
 * @return {Promise<void>}
 */
async function updateIndicatorValues() {
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

  const [dataSets, indicators] = await Promise.all([
    DataSet.find(dataSetQueries).lean(),
    Indicator.find(indicatorQueries).lean(),
  ]);

  const tasks = getAllCombinationsBetween(dataSets, indicators);

  const total = tasks.length;
  let taskDone = 0;
  console.log(`Task done - ${taskDone}/${total}`);
  await eachLimit(tasks, 2, async ({ dataSet, task: indicator }) => {
    console.log(
      `${new Date()} - fill ${dataSet.instrument}(${dataSet.timeFrame})'s ${
        indicator.key
      } START`
    );
    const factory = new IndicatorFactories[indicator.name](
      dataSet,
      indicator.key,
      indicator.att
    );

    await factory.fill();

    console.log(
      `${new Date()} - fill ${dataSet.instrument}(${dataSet.timeFrame})'s ${
        indicator.key
      } END`
    );
    taskDone++;
    console.log(`Task done - ${taskDone}/${total}`);
  });
}

module.exports = updateIndicatorValues;
