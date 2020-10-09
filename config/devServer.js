const { resolve } = require('path')

/**
 * @name devServer 自动化编译 express服务
 * 在内存种进行打包,不会生成本地代码
 * 指令 webpack-dev-server
 */

module.exports = {
    // 路径
    contentBase: resolve(__dirname, 'hash'),
    // gzip压缩
    compress: true,
    // 端口号
    port: 3003,
    // 默认打开浏览器
    // open: true
}