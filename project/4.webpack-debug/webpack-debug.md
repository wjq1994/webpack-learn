# webpack调试（大部分插件都是这样调试的）

- [命令行](#命令行)
- [代码](#代码)

### 命令行

> 执行webpack打包命令

```javascript
//package.json
"scripts": {
    "build": "webpack" //
}
```

```
npm run build
```

> 执行过程

.bin目录下寻找webpack执行文件


1. 可执行文件node_modules/.bin/webpack（mac）

```bash
#!/usr/bin/env node

。。。。具体逻辑

```

2. webpack 在找到 webpack-cli (入口debugger)

```javascript

// webpack-cli文件
(function() {
	// wrap in IIFE to be able to use return

    debugger

	const importLocal = require("import-local");
	// Prefer the local installation of webpack-cli
	if (importLocal(__filename)) {
		return;
	}

	require("v8-compile-cache");

    const ErrorHelpers = require("./utils/errorHelpers");
 
 // TODO...
```

### 代码

```javascript
//现在我要绕过webpack-cli直接运行webpack打包
let webpack = require('webpack');
let config = require('./webpack.config');
let compiler = webpack(config);
compiler.run((err, stats) => {
    console.log(stats);
});
```