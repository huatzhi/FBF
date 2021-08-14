const { DataSet } = require("../database/models/index");

/**
 * Handling DataSet related functions
 */
class DataSetService {
  /**
   * Get data set info, if not exist, create a new data set and return the new data set
   * @param {string} instrument
   * @param {string} timeFrame
   * @return {Promise<any>}
   */
  static async getOrCreateDataSet(instrument, timeFrame) {
    const dataSet = await DataSet.findOne({ instrument, timeFrame }).lean();
    if (dataSet) {
      return dataSet;
    }

    const newDataSet = new DataSet({ instrument, timeFrame });
    await newDataSet.save();
    return await DataSet.findOne({ instrument, timeFrame }).lean();
  }

  /**
   *
   * Get data set info, if not exist, throw error
   * @param {string} instrument
   * @param {string} timeFrame
   * @return {Promise<any>}
   */
  static async getDataSetOrFail(instrument, timeFrame) {
    const dataSet = await DataSet.findOne({ instrument, timeFrame }).lean();
    if (instrument) {
      return dataSet;
    }

    throw new Error(`DataSet not found - ${{ instrument, timeFrame }}`);
  }
}

module.exports = DataSetService;
