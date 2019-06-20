# webpack-learn
webpack学习

[参考链接](https://webpack.docschina.org/guides/getting-started)

##### 创建一个bundle，基本安装
利用命令 ```npx webpack``` 会将我们的脚本 src/index.js（默认路径） 作为 [入口起点](https://webpack.docschina.org/concepts/entry-points)，也会生成 dist/main.js（默认路径） 作为 [输出](https://webpack.docschina.org/concepts/output)

``` javascript
//如果src/index.js不存在
ERROR in Entry module not found: Error: Can't resolve './src' in '/Users/wangjianqing/Desktop/project/webpack/webpack-demo'
```

##### 使用一个配置文件（webpack.config.js）
```
npx webpack --config webpack.config.js
```

```
如果 webpack.config.js 存在，则 webpack 命令将默认选择使用它。我们在这里使用 --config 选项只是向你表明，可以传递任何名称的配置文件。这对于需要拆分成多个文件的复杂配置是非常有用。
```