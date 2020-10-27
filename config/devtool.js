/**
 * @name devtool 映射编译前后代码 方便调试
 * @param {inline-source-map} 内联 (速度更快)
 * @param {hidden-source-map} 外联
 * @param {eval-source-map}  内联 每个地方都生成一个eval对应着source-map
 * @param {nosources-source-map} 外联 不带有源码 报错也映射不出来
 * @param {cheap-module-source-map} 外联 精确到行 是map到loader前的样子 如果不加 就是var 加了可能是let或const
 * @param {cheap-source-map} 外联 精确到行
 * @
 * @warn 速度 eval inline cheap 最快组合 eval-cheap-souce-map
 */
module.exports = '';

/**
 * @速度比较
 * eval > inline > cheap
 * 1：eval-cheap-source-map
 * 2：eval-source-map
 * 
 * @development 开发环境 主要以方便调试为主
 * 1：source-map
 * 2：cheap-module-source-map
 * 3：cheap-source-map
 * 综合：eval-source-map || eval-cheap-module-source-map
 * 
 * @production 生产环境 主要考虑安全、体积(所以用外联)
 * 1：cheap-module-source-map
 * 2：source-map
 * 3：nosources-source-map (彻底干掉源码)
 */