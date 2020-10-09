const { resolve } = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const devServer = require('./devServer')
    // /**
    //  * @name MiniCSSExtractPlugin 将css单独打包抽离
    //  */
    // const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        // 打包名
        filename: 'js/build.js',
        // 输出文件夹地址
        path: resolve(__dirname, '../build')
    },
    // loader配置 通常用于解析相关文件
    module: {
        rules: [
            // 解析css
            {
                // test 匹配格式 这里一般用正则进行匹配
                test: /\.css$/,
                // 使用 加载顺序是倒叙加载的
                use: [
                    // 将js中的style 解析成style标签引入 都在js中 所以就不能配置outputPath
                    {
                        loader: 'style-loader',
                    },
                    // 将css文件解析成js字符
                    'css-loader',
                ],

            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 配置第三方css解析 应该先解析成css在插入成style标签
                    'less-loader'
                ]
            },
            {
                // 处理多个文件
                // warning 处理不了html元素src引入的图片 用html-loader可以解决
                test: /\.(jpg|png|jpeg|gif)$/,
                // 只使用一个loader (依赖于file-loader)
                loader: 'url-loader',
                // 相应配置
                options: {
                    // 图片大小小于8kn，就会被base64处理
                    limit: 8 * 1024,
                    // 关闭es6模块化解析 使用commonJS解析
                    esModule: false,
                    // 资源重命名
                    // hash 哈希截取第十位 ext原文件名
                    name: '[hash:10].[ext]',
                    // 输出地址
                    outputPath: 'img'
                }
            },
            {
                // url-loader默认使用es6模块解析 html-loader是用commonJS解析
                // 所以需要关闭url-loader的es模块化规范
                test: /\.html$/,
                // 处理html文件中引入的src图片
                use: {
                    loader: 'html-loader',
                }
            },
            // 排除其他资源(除了html css js资源的其他资源) 
            {
                exclude: /\.(css|js|html|jpg|png|jpeg|gif|json|less)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[hash:10].[ext]',
                        outputPath: 'media'
                    }
                }
            }
        ]
    },
    // 插件
    plugins: [
        // 打包html文件
        new HTMLWebpackPlugin({
            // 引用一个HTML文件 不需要手动引入资源
            template: './src/index.html'
        }),
    ],
    // 当前模式
    // 开发:development  生产：production
    mode: 'development',
    devServer,
}