const dev = require("./dev"); // 开发
const production = require("./production"); // 生产

// 开发环境
process.env.NODE_DEV = "development";

module.exports = production;
