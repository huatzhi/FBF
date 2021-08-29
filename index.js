const prompt = require("prompt");
const DB = require("./shared/database/loader");
const Scripts = require("./scripts/index");
const inspector = require("inspector");

/**
 * is debug mode
 * @return {boolean}
 */
function isInDebugMode() {
  return inspector.url() !== undefined;
}

const schema = {
  properties: {
    scriptNo: {
      required: true,
      type: "string",
      description: "Script number:",
    },
  },
};

/**
 * Main class that select what script to run
 *
 * Note that it is adjusted to using Promise rather than try catch because
 * `finally` somehow activated before promise ended when using try-catch-finally
 *
 * @return {Promise<void>}
 */
async function main() {
  await new Promise(async (res) => {
    let scriptNo;

    console.log("a");
    if (isInDebugMode()) {
      console.log("is debug mode");
      scriptNo = 4;
    } else {
      scriptNo = await getScriptNo();
    }
    console.log("b");

    // end if scriptNo does not exist
    if (!Scripts[scriptNo]) {
      console.error("Script not found.");
      return;
    }

    // init connection to db
    await DB.connectDb();

    // start script
    console.log(`Script started at ${new Date()}`);
    await Scripts[scriptNo]();

    /**
     * Script list:
     *
     * 1 - Load data from csv to db
     * Place data into `./scripts/1/newData/` folder as csv with qdm file naming format
     * csv have to follow DF structure.
     * Then, run the script, it will save the raw data into db.
     *
     * 2 - Fill indicator values to Bar
     * Detect available indicators, update them into bars. Options allow to choose to
     * either run all or specific DataSet/Indicators.
     *
     * 2.1 - Add new indicator
     * Just add a new indicator config in `./scripts/2.1/options/newIndicators.js` and
     * run the script.
     *
     * 3 - Fill result values to Bar
     * Result format can refer to `./shared/const/result.js`
     *
     * 3.1 - Add new result format
     *
     * 4 - Output dataSet to CSV
     * Config can adjust what should be in csv, by default, everything would be added.
     * It will be separated by dataset per file.
     */

    res();
  }).finally(async () => {
    console.log(`Script ended at ${new Date()}`);
    await DB.closeDb();
  });
}

/**
 * get script number from console input
 * @return {Promise<string>} scriptNo - script number
 */
async function getScriptNo() {
  return new Promise((resolve, reject) => {
    prompt.start();

    prompt.get(schema, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res.scriptNo);
    });
  });
}

// noinspection JSIgnoredPromiseFromCall
main();
