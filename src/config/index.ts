const pkg = require("../../package.json");

module.exports = {
  applicationName: pkg.name,
  mongodb: {
    url: "mongodb://localhost:37017/laundry_db",
  },
  JWT_SECRET: process.env.JWT_SECRET,
};
