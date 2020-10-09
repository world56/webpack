/**
 * webpack入口文件
 * 1:运行指令
 * @name 开发环境
 * webpack ./src/index.js -o ./build/built.js --mode=development
 * @name 生产环境 会进行一些压缩操作
 * webpack ./src/index.js -o ./build/built.js --mode=production
 * @warning webpack不能对css、img进行识别 需要配置loader
 */
import json from './json.json'
import './index.css'
import './index.less'

import './resource/iconfont/iconfont.css'


function add() {
    console.log('JSON122@', json)
    return 1 + 2
}

add()