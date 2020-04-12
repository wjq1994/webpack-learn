const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlCdnWebpackPlugin = require('add-asset-html-cdn-webpack-plugin');

module.exports = {
    mode:'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    // {
    //     main: path.resolve(__dirname, 'src/index.js'),
    //     a: path.resolve(__dirname, 'src/a.js'),
    // },
    output:{ // 每次会根据打包的内容产生一个hash戳
        // contentHash 每个文件内容不同hash就不相同
        // chunkHash 表示已入口文件产生一个hash戳
        filename: '[name].js', // 文件名
        // 不写文件夹 默认dist文件夹
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        }),
        new AddAssetHtmlCdnWebpackPlugin(true,{
            'jquery': "https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"
        })
        // new webpack.ProvidePlugin({ // 把jquery模块 给每个模块都提供一个$变量
        //     '$':'jquery'
        // })
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
            },
            // 把变量暴露到全局上
            // { // import $ from jquery
            //     test: require.resolve('jquery'),
            //     use:{
            //         loader:'expose-loader',
            //         options:'$'
            //     }
            // },
            // { // import $ from jquery
            //     test: require.resolve('jquery'),
            //     use: {
            //         loader: 'expose-loader',
            //         options: 'jQuery'
            //     }
            // }
        ]
    },
    externals:{ // 从jquery包中 引出$ 符号就是外部的
        'jquery':'$',
        'vue-router':'VueRouter'
    }
}

// console.log)
// console.log(path.resolve('./jquery'))