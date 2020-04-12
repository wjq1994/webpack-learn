const path = require('path');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (...filename) => {
    return path.resolve(...filename)
}
console.log(process.env.development);  // cross-env 
// 命令行的参数
module.exports = (env) => { // webpack 配置文件可以到出一个函数 函数的参数就是你传入的环境变量
    const isDev = env.development;

    const baseConfig = {
        entry: { // 多入口可以改成对象 、 数组 、字符串
            // b: resolve(__dirname, "../src/b.js"),
            main: resolve(__dirname, "../src/main.js"),
        },
        output: {
            filename: '[name].js', // 默认叫main.js
            path: resolve(__dirname, '../', 'dist')// 必须是绝对路径
        },
        plugins: [ // webpack  本身就是一个插件 他是由很多插件组合而成的 ，在打包的时候，在不同的位置上 执行对应的插件
            new HtmlWebpackPlugin({
                template: resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                hash: true,
                minify: !isDev ? { // 是否压缩
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                } : false,
                chunksSortMode: 'manual', // 手动排序
                chunks: ['main'], // 需要引入的代码块
                // excludeChunks:['main'] // 排除某个模块
            }),

        ],
        // 我们需要转化js  把 es6 -> es5 es7 -> es5
        // babel  @babel/core(提供转化的方法)  @babel/preset-env(es6-es5)   babel-loader(用babel来处理)
        module: { // 要处理模块
            rules: [ // 默认loader的执行顺序是 右边往左边 从下到上
                {test:/\.png|jpg|eot|vue|jsx|ts/}
                {
                    test: /\.js$/,
                    use: 'eslint-loader', // eslint 默认可以使用eslint --init来生成配置文件
                    exclude: /node_modules/,
                    enforce:'pre',  // 强制在所有js的loader之前执行
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader', // @babel/core 
                    exclude: /node_modules/
                },
            ]
            // eslint
            // 图片的引入 样式的引入 webpack优化配置
        }
    }
    // mergeOptions 
    return isDev ? merge(baseConfig, devConfig) : merge(baseConfig, prodConfig)
}


// js css 图片





// ----------------------------
// webpack 的默认配置文件 webpack特点是基于nodejs 遵循commonjs规范的
// const path = require('path');
// const resolve = (...filename)=>{
//     return path.resolve(...filename)
// }
// module.exports = {
//     entry: resolve(__dirname,'..',"./src/main.js"), // 可以使用绝对路径 默认是当前src下的index
//     output:{
//         filename:'bundle.js', // 默认叫main.js
//         path: resolve(__dirname,'../','dist')// 必须是绝对路径
//     }   
// }

// 打包可能有很多需求 区分环境变量 开发的时候 不要压缩， 不要抽离css js 上线的时候 压缩 合并优化... 

// 分成三部分 1. 基础  2.开发环境  3.生产环境
// 指定开发目录 

// 1) 我可以都以base.js为入口，在base里区分 调用开发还是生产
// 2) 走开发配置的文件  走生产配置


// babel-loader（webpack的loader，后面对应的是babel的包） @babel/core @babel/preset-env @babel/plugin-transform-rutime transform-runtime