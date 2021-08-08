const period = {
  D1: "D1",
  H4: "H4",
  H1: "H1",
  M30: "M30",
  M15: "M15",
  M5: "M5",
};

const periodInMs = {
  D1: 86400000,
  H4: 14400000,
  H1: 3600000,
  M30: 1800000,
  M15: 900000,
  M5: 300000,
};

module.exports = {
  period,
  periodInMs,
};
