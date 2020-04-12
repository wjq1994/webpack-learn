# webpack
### 学习目标

掌握webpack基础用法

### 学习方法

github npm

### 学习步骤

#### 基础用法
1. 初始化项目
```javascript
npm init -y
```
2. 配置webpack
```javascript
npm install webpack webpack-cli -D
```
3. 基本配置文件webpack.config.js
```javascript
const path=require('path');
module.exports={
	//主要是以下几个配置
    entry: './src/index.js', //配置入口文件的地址
    output: { //配置出口文件的地址
        path: path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module: {}, //配置模块,主要用来配置不同文件的加载器
    plugins: [], //配置插件
    devServer: {} //配置开发服务器
}
```
4. 区分生产和开发
```javascript
//利用命令行参数 --env.production(与progress.env不是一回事)
module.exports = (env) => { // webpack 配置文件可以到出一个函数 函数的参数就是你传入的环境变量

}
//cross-env

```
5. webpack-dev-sever (http服务)
6. html-webpack-plugin （生成html文件）
7. js处理 babel-loader (babel功能将es7，es6转换为es5，需要.babelrc配置文件)
8. eslint-loader (eslint语法校验)


#### 小技巧
1. 模版打包器默认支持es6
2. 命令行输入 npx webpack --mode development, npx命令默认执行node_modules里的指令
3. 加hash戳可以解决缓存的问题
