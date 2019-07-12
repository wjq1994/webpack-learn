# webpack-learn
webpack学习

[参考链接](https://webpack.docschina.org/guides/getting-started)

## 一、起步

### 新建package.json 
npm init -y  ```直接略过所有问答，全部采用默认答案```

npm install webpack webpack-cli --save-dev ```webpack-cli 此工具用于在命令行中运行 webpack```

### 创建一个bundle，基本安装
利用命令 ```npx webpack``` 会将我们的脚本 src/index.js（默认路径） 作为 [入口起点](https://webpack.docschina.org/concepts/entry-points)，也会生成 dist/main.js（默认路径） 作为 [输出](https://webpack.docschina.org/concepts/output)

Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件（./node_modules/.bin/webpack）

``` javascript
//如果src/index.js不存在
ERROR in Entry module not found: Error: Can't resolve './src' in '/Users/wangjianqing/Desktop/project/webpack/webpack-demo'
```

### 使用一个配置文件（webpack.config.js）
```
npx webpack --config webpack.config.js
```

```
如果 webpack.config.js 存在，则 webpack 命令将默认选择使用它。我们在这里使用 --config 选项只是向你表明，可以传递任何名称的配置文件。这对于需要拆分成多个文件的复杂配置是非常有用。
```

### NPM 脚本
考虑到用 CLI 这种方式来运行本地的 webpack 不是特别方便，我们可以设置一个快捷方式。在 package.json 添加一个 npm 脚本(npm script)
```javascript
{
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "build": "webpack" 
	  //新加命令，如果 webpack.config.js 存在，则 webpack 命令将默认选择使用它，
	  //如果 webpack.config.js不存在 src/index.js（默认入口文件，没有会报错）dist/main.js（默认输出文件，没有会自动创建）
      //通过模块名引用本地安装的 webpack 包 
	},
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9",
      "lodash": "^4.17.5"
    }
}
```

```npm run build``` 命令替代 ```npx``` 命令。注意，使用 npm 的 scripts，我们可以像使用 npx 那样```通过模块名引用本地安装的 npm 包```。这是大多数基于 npm 的项目遵循的标准，因为它允许所有贡献者使用同一组通用脚本（如果必要，每个 flag 都带有 --config 标志）。

### 总结
1. 安装
```
npm init -y 
npm install webpack webpack-cli --save-dev
```
2. 调整项目目录结构
3. 新增webpack配置文件（webpack.config.js）
4. 配置package.json