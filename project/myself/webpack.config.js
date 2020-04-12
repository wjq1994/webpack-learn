const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (...filename) => {
    return path.resolve(...filename)
}

module.exports = {
    entry: resolve(__dirname,"./src/main.js"), // 可以使用绝对路径 默认是当前src下的index
    output:{
        filename:'bundle.js', // 默认叫main.js
        path: resolve(__dirname,'./','dist')// 必须是绝对路径
    },
    plugins: [ // webpack  本身就是一个插件 他是由很多插件组合而成的 ，在打包的时候，在不同的位置上 执行对应的插件
        new HtmlWebpackPlugin({
            template: resolve(__dirname, './public/index.html'),
            filename: 'index.html',
            hash: true,
            chunksSortMode: 'manual', // 手动排序
            chunks: ['main'], // 需要引入的代码块
            // excludeChunks:['main'] // 排除某个模块
        }),

    ],
    // 我们需要转化js  把 es6 -> es5 es7 -> es5
    // babel  @babel/core(提供转化的方法)  @babel/preset-env(es6-es5)   babel-loader(用babel来处理)
    module: { // 要处理模块
        rules: [ // 默认loader的执行顺序是 右边往左边 从下到上
            {
                test: /\.js$/,
                use: 'babel-loader', // @babel/core 
                exclude: /node_modules/
            },
        ]
    } 
}