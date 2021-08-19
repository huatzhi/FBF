const { Indicator } = require("../../shared/database/models/index");
const newIndicators = require("./options/newIndicators");

/**
 * add new indicators based on option
 * @return {Promise<void>}
 */
async function addNewIndicators() {
  for (let i = 0; i < newIndicators.length; i++) {
    await addNewIndicator(newIndicators[i]);
  }
}

/**
 * check if indicator is already exist, if no, create a new one
 * @param {object} newIndicator
 * @return {Promise<void>}
 */
async function addNewIndicator(newIndicator) {
  const existed = await Indicator.findOne({ key: newIndicator.key }).lean();

  if (existed) {
    return;
  }

  await new Indicator({
    ...newIndicator,
  }).save();
}

module.exports = addNewIndicators;
