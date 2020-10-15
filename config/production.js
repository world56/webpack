const { resolve } = require("path");
// const {deleteFolder} = require('../script/build')
const devServer = require("./devServer");
// 打包html
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 将css单独打包抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css兼容性处理
const PostcssPresetEnv = require("postcss-preset-env");
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

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
                corejs: {
                  version: 3,
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: "60",
                  firefox: "60",
                  ie: "9",
                },
              },
            ],
          ],
          // 插件还能以沙箱垫片的方式防止污染全局
          //抽离公共的 helper function , 以节省代码的冗余
          plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-transform-modules-commonjs"
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
        // test 匹配格式 这里一般用正则进行匹配
        test: /\.css$/,
        // 使用 加载顺序是倒叙加载的
        use: [
          // 这里尝试打包成静态css文件
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
              publicPath: "../",
            },
          },
          // 将css文件解析成js字符
          "css-loader",
          {
            // css 兼容性处理插件 先进行兼容性处理
            // 设置环境 process.env.NODE_DEV = "development"
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // 可以让postcss-loader 找到browserslist配置
                plugins: [PostcssPresetEnv],
              },
            },
          },
        ],
      },

      // 解析less 并打包进入至js 可以动态引入html style标签
      {
        test: /\.less$/,
        use: [
          // 直接打包进入js 并且动态通过js创建stlye标签引入
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          // "style-loader",
          // 解析成可识别css代码
          "css-loader",
          // 配置第三方css解析 应该先解析成css在插入成style标签
          "less-loader",
        ],
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
  mode: "development",
  devServer,
};
