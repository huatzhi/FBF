/**
 * @file connect to mongoDB with mongoose
 *
 */

const mongoose = require("mongoose");
// const {isTest} = require('./setting');

const dbName = "bfb";

/**
 * handle database startup and closing
 */
class Loader {
  /**
   * Initiate connection to db
   * @return {Promise<void>}
   */
  static async connectDb() {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }

  /**
   * Close db connection.
   * Allow script to actually stop after everything finished.
   * @return {Promise<void>}
   */
  static async closeDb() {
    await mongoose.connection.close();
  }
}

module.exports = Loader;
