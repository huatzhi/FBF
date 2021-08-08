const prompt = require("prompt");
const db = require("./shared/database/loader");

const schema = {
  properties: {
    scriptNo: {
      required: true,
      type: "string",
      description: "No of Script:",
    },
  },
};

/**
 * Main class that select what script to run
 * @return {Promise<void>}
 */
async function main() {
  try {
    const scriptNo = await getScriptNo();

    console.log(`script no is ${scriptNo}`);
  } catch (e) {
    throw e;
  } finally {
    db.closeDb();
  }
}

/**
 * get script number from console input
 * @return {Promise<String>} scriptNo - script number
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
