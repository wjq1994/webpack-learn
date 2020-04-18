# dllPlugin 动态插件库

## 流程

1. 将第三方库提前打包，开发时直接使用，缩短打包时间

- 生成react.dll.js，manifest.json两个文件

```javascript
const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry:{
        react:['react','react-dom']
    },
    mode:'development',
    output:{
        filename:'react.dll.js',
        library:'react', // var a = ()(),
        // libraryTarget:'commonjs2', // 我要打包一个类库
        path:require('path').resolve(__dirname,'dll')
    },
    plugins:[
        new webpack.DllPlugin({
            name: 'react', //要与 output -> library 值一样
            path:path.resolve(__dirname,'dll/manifest.json')
        })
    ]
}
// 我们写代码的时候 
// import React from 'react';
// import ReactDOM from 'react-dom'

// 把react 和reactdom 先打包好 留起来 
// 开发的时候 直接使用 打包好的结果
```

2. 项目中引用

- 第一步：引用react.dll.js

```javascript
new AddAssetHtmlPlugin({
    filepath: path.resolve(__dirname,'dll/react.dll.js')
}),
```

- 第二步：引用manifest.json文件

```javascript
new webpack.DllReferencePlugin({
    manifest:path.resolve(__dirname,'dll/manifest.json')
})
```