/**
 * get instrument name from generated file name
 * @param {string} path
 * @return {string} instrument
 */
function getInstrumentNameFromPath(path) {
  const fileName = path.split("newData")[1];
  const substr1 = fileName.split("-")[0];
  const substrArr = substr1.split(".");
  const substr2 = substrArr[substrArr.length - 1];
  const substr3 = substr2.split("_")[0];
  return substr3.replace(/[^a-zA-Z]+/g, "");
}

/**
 * get time frame from generated file name
 * @param {string} path
 * @return {string}
 */
function getTimeFrameFromPath(path) {
  const fileName = path.split("newData")[1];
  return fileName.split("-")[1];
}

module.exports = {
  getInstrumentNameFromPath,
  getTimeFrameFromPath,
};
