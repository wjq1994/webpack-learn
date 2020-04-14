const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    mode:'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output:{ // 每次会根据打包的内容产生一个hash戳
        // contentHash 每个文件内容不同hash就不相同
        // chunkHash 表示已入口文件产生一个hash戳
        filename: '[name].js', // 文件名
        // 不写文件夹 默认dist文件夹
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        })
    ],
    module:{
        rules:[ // loader的写法 可以写成字符串 也可以写成对象 多个loader可以写成一个数组
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{ // .babelrc 文件
                        presets:['@babel/preset-env'], // 预设
                        plugins:[]
                    }
                }
            }
        ]
    },
    externals:{ // 从jquery包中 引出$ 符号就是外部的
        'jquery':'$'
    }
}