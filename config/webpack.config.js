const dev = require("./dev"); // 开发
const production = require("./production"); // 生产

// 开发环境 development production
process.env.NODE_DEV = "production";

module.exports = production;
