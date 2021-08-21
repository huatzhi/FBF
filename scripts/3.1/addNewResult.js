const { Result } = require("../../shared/database/models/index");
const newResults = require("./options/newResults");

/**
 * add new indicators based on option
 * @return {Promise<void>}
 */
async function addNewResults() {
  for (let i = 0; i < newResults.length; i++) {
    await addNewResult(newResults[i]);
  }
}

/**
 * check if indicator is already exist, if no, create a new one
 * @param {object} newResult
 * @return {Promise<void>}
 */
async function addNewResult(newResult) {
  newResult.key = newResult.key.replace(".", "_");
  const existed = await Result.findOne({ key: newResult.key }).lean();

  if (existed) {
    return;
  }

  await new Result({
    ...newResult,
  }).save();
}

module.exports = addNewResults;
