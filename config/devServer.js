const { resolve } = require("path");

/**
 * @name devServer 自动化编译 express服务
 * 在内存种进行打包,不会生成本地代码
 * 指令 webpack-dev-server
 */

module.exports = {
  // 路径
  contentBase: resolve(__dirname, "hash"),
  // gzip压缩
  compress: true,
  // 监听文件变化
  watchContentBase:true,
  // 端口号
  port: 3003,
  // 默认打开浏览器
  // open: true
  /**
   * @name hot 热更新
   * style-loader内部实现了
   * html 需要在入口entry引入一下才行
   */
  hot: true,
};
