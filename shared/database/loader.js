/**
 * @file connect to mongoDB with mongoose
 *
 */

const mongoose = require("mongoose");
// const {isTest} = require('./setting');

const dbName = "bfb";

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

/**
 * Close db connection.
 * Allow script to actually stop after everything finished.
 */
function closeDb() {
  mongoose.connection.close();
}

module.exports.closeDb = closeDb;
