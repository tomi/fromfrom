const config = require("./webpack.config");

config.mode = "production";

console.log("Production build");

module.exports = config;
