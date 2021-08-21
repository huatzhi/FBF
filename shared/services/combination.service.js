/**
 * Get all combinations of dataSets and results that will be fill up later
 * @param {obj[]} dataSets
 * @param {obj[]} tasks
 * @return {{dataSet: object, task: object}[]}
 */
function getAllCombinationsBetween(dataSets, tasks) {
  const combination = [];
  dataSets.forEach((dataSet) => {
    tasks.forEach((task) => {
      combination.push({ dataSet, task });
    });
  });
  return combination;
}

module.exports = { getAllCombinationsBetween };
