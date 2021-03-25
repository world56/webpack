const { resolve } = require("path");
const { DllPlugin } = require("webpack");
// const {deleteFolder} = require('../script/build')
// 打包html
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 将css单独打包抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const devServer = require("./devServer");
// 兼容css
const { CssLoader } = require("./CssLoader");

const devtool = require("./devtool");

module.exports = {
  // 入口
  entry: ["./src/index.js", "./src/index.html"],
  // 出口
  output: {
    // 打包名
    /**
     * @name hash webpack HASH值一般有三种
     * @param hash webpack会生成一个唯一的哈希值，重新打包会导致无法检测文件更新
     * @param chunkhash 根据chunk生成哈希值，如果打包来源一致 导致js css的哈希值一样 (因为CSS来源JS，所以还是一致的)
     * @param contenthash 检测文件变化，从而生成新的哈希值
     */
    filename: "js/[name].[hash:10].js",
    // 输出文件夹地址
    path: resolve(__dirname, "../build"),
  },
  //将node_modules打包成一个chunk输出 自动分析多入口chunk 如果没有公共文件 会打包成单独chunk
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  // loader配置 通常用于解析相关文件
  module: {
    rules: [
      // eslint 校验  这里采用了优先执行 enforce pre
      // {
      //   test: /\.js$/,
      //   // 排除 对/node_modules/的检查
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      //   enforce: "pre", // 优先执行
      //   options: {
      //     // 自动修复
      //     fix: true,
      //   },
      // },
      {
        // 对响应的文件 只 loader一次 相当于break
        // 需要注意的是 在oneOf里不能同事两次loader一个响应的文件
        oneOf: [
          // 转译兼容
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              /**
               * @name thread-loader 多进程打包
               * 也有缺点 进程启动600ms 进程通讯也有开销 只有项目过大运用得到
               */
              {
                loader: "thread-loader",
                options: {
                  workers: 2, // 限制为2个进程
                },
              },
              {
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
                      },
                    ],
                  ],
                  plugins: [
                    // 插件还能以沙箱垫片的方式防止污染全局
                    // 抽离公共的 helper function , 以节省代码的冗余
                    "@babel/plugin-transform-runtime",
                    // 转成commonJS模块语法
                    // "@babel/plugin-transform-modules-commonjs",
                  ],
                  // Babel 缓存 第二次构建直接读取之前的缓存（）
                  cacheDirectory: true,
                },
              },
            ],
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
            use: CssLoader.concat(["less-loader"]),
            // 排除node_modules资源目录
            exclude: /node_modules/,
          },

          {
            // 处理多个文件
            // warning 处理不了html元素src引入的图片 用html-loader可以解决
            test: /\.(jpg|png|jpeg|gif)$/,
            // 只使用一个loader (依赖于file-loader)
            loader: "url-loader",
            // 相应配置
            options: {
              // 图片大小小于8kb，就会被base64处理
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
          // include 只要
          // exclude 排除
          {
            include: /\.(woff|svg|ttf|eot)$/,
            // exclude: /\.(css|js|html|jpg|png|jpeg|gif|json|less)$/,
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
      filename: "./css/[contenthash:10].css",
    }),
    // 压缩
    new OptimizeCssAssetsWebpackPlugin(),
    // 进行DLL打包
    new DllPlugin({
      name: "[name]_[hash]", // 暴露名称
      path: resolve(__dirname, "dll/manifest.json"),
    }),
  ],
  // 当前模式
  // 开发:development  生产：production
  mode: "production",
  devServer,
  // 映射编译前后代码 方便调试
  devtool,
  // 忽略打包库名 对应的npm包名
  externals: {
    jquery: "jQuery",
  },
};

// console.log('@ENV',process.env.NODE_DEV)
// "eslintConfig": {
//   "extends": "airbnb-base"
// }

// 缓存的意义是 二次启动更快
// tree shaking 删掉代码树中无用的代码(没有使用) c 可解决出现样式文件无法引入的问题
