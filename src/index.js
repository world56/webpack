/**
 * webpack入口文件
 * 1:运行指令
 * @name 开发环境
 * webpack ./src/index.js -o ./build/built.js --mode=development
 * @name 生产环境 会进行一些压缩操作
 * webpack ./src/index.js -o ./build/built.js --mode=production
 * @warning webpack不能对css、img进行识别 需要配置loader
 */
// @babel/polyfill 能兼容一些更新的语法 例如promise 但是引入体积会过大
import json from './json.json';
import './index.css';
import './index.less';
import './resource/iconfont/iconfont.css';
import running from './running';

function add() {
  // eslint-disable-next-line
  console.log("JSON122@", json)();
  running();
  return 1 + 2;
}

add();

const App = function App() {
  return 1;
};

function PromiseTest() {
  return new Promise((reslove) => {
    reslove();
  });
}

App();
PromiseTest();
