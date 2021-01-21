var path = require("path");

module.exports = {
  webpack: {
    alias: {
      root: path.resolve(__dirname, "src/"),
    },
  },
};
