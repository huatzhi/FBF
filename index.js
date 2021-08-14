const prompt = require("prompt");
const DB = require("./shared/database/loader");
const Scripts = require("./scripts/index");

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
 * `finally` somehow activated before promise ended
 *
 * @return {Promise<void>}
 */
async function main() {
  await new Promise(async (res) => {
    const scriptNo = await getScriptNo();

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
