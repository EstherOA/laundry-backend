const pkg = require("../../package.json");

module.exports = {
  applicationName: pkg.name,
  mongodb: {
    url: process.env.MONGO_URL,
  },
  JWT_SECRET: process.env.JWT_SECRET,
};
