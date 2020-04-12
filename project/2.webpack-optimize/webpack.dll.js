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
            name: 'react',
            path:path.resolve(__dirname,'dll/manifest.json')
        })
    ]
}

// 我们写代码的时候 
// import React from 'react';
// import ReactDOM from 'react-dom'

// 把react 和reactdom 先打包好 留起来 
// 开发的时候 直接使用 打包好的结果