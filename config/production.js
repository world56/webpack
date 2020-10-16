const { resolve } = require("path");
// const {deleteFolder} = require('../script/build')
const devServer = require("./devServer");
// 打包html
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 将css单独打包抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// 兼容css
const { CssLoader } = require("./CssLoader");

module.exports = {
  // 入口
  entry: "./src/index.js",
  // 出口
  output: {
    // 打包名
    filename: "js/build.js",
    // 输出文件夹地址
    path: resolve(__dirname, "../build"),
  },
  // loader配置 通常用于解析相关文件
  module: {
    rules: [
      // 转译兼容
      {
        test: /\.js$/,
        // exclude: /\.json$/, // 暂时不处理json
        loader: "babel-loader",
        options: {
          // js语法兼容到 es5
          // @babel/preset-env 只做基本语法兼容
          presets: [
            [
              "@babel/preset-env",
              {
                // 按需加载
                useBuiltIns: "usage",
                corejs: 3,
                targets: "> 5%",
              },
            ],
          ],
          plugins: [
            // 插件还能以沙箱垫片的方式防止污染全局
            //抽离公共的 helper function , 以节省代码的冗余
            "@babel/plugin-transform-runtime",
            // 转成commonJS模块语法
            // "@babel/plugin-transform-modules-commonjs",
          ],
        },
      },

      // eslint 校验
      {
        test: /\.js$/,
        // 排除 对/node_modules/的检查
        exclude: "/node_modules/",
        loader: "eslint-loader",
        options: {
          // 自动修复
          fix: true,
        },
      },

      // 解析css
      {
        test: /\.css$/,
        // 使用 加载顺序是倒叙加载的
        use: CssLoader,
      },

      // 解析less
      {
        test: /\.less$/,
        // 配置第三方css解析 应该先解析成css在插入成style标签
        use: CssLoader.concat(['less-loader']),
      },

      {
        // 处理多个文件
        // warning 处理不了html元素src引入的图片 用html-loader可以解决
        test: /\.(jpg|png|jpeg|gif)$/,
        // 只使用一个loader (依赖于file-loader)
        loader: "url-loader",
        // 相应配置
        options: {
          // 图片大小小于8kn，就会被base64处理
          limit: 8 * 1024,
          // 关闭es6模块化解析 使用commonJS解析
          esModule: false,
          // 资源重命名
          // hash 哈希截取第十位 ext原文件名
          name: "[hash:10].[ext]",
          // 输出地址
          outputPath: "img",
        },
      },

      {
        // url-loader默认使用es6模块解析 html-loader是用commonJS解析
        // 所以需要关闭url-loader的es模块化规范
        test: /\.html$/,
        use: {
          loader: "html-loader",
        },
      },

      // 排除其他资源(除了html css js资源的其他资源)
      {
        exclude: /\.(css|js|html|jpg|png|jpeg|gif|json|less)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[hash:10].[ext]",
            outputPath: "media",
          },
        },
      },
    ],
  },
  // 插件
  plugins: [
    // 打包html文件
    new HTMLWebpackPlugin({
      // 引用一个HTML文件 不需要手动引入资源
      template: "./src/index.html",
      minify: {
        // 折叠空格
        collapseWhitespace: true,
        // 移出注释
        removeComments: true,
      },
    }),
    // 独立打包css
    new MiniCssExtractPlugin({
      filename: "./css/[hash:10].css",
    }),
    // 压缩
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  // 当前模式
  // 开发:development  生产：production
  mode: "production",
  devServer,
};
