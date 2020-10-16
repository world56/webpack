// css兼容性处理插件
const PostcssPresetEnv = require("postcss-preset-env");
// 将css单独打包抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * @name CssCompatible css兼容处理
 */
const CssCompatible = {
  // 设置环境 process.env.NODE_DEV = "development"
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      // 可以让postcss-loader 找到browserslist配置并进行处理
      plugins: [PostcssPresetEnv],
    },
  },
};

/**
 * @name CssToStaticFile css打包成静态css资源
 */
const CssToStaticFile = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    esModule: false,
    publicPath: "../",
  },
};

/**
 * @name CssLoader 兼容、解析成css、转移成静态资源
 */
const CssLoader = [
  // "style-loader"是直接打包进入js 并且动态通过js创建stlye标签引入
  CssToStaticFile,
  "css-loader",
  CssCompatible,
];

module.exports = {
  CssLoader,
  CssToStaticFile,
  CssCompatible,
};
