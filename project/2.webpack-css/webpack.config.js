const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        }),
        new MiniCssExtractPlugin({
            filename:'css/css.css'
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
            },
            {
                test:/\.css$/,
                use:[
                 {
                     loader: MiniCssExtractPlugin.loader, //先loader将css暂存，再plugins导出到css文件
                     options:{
                         hmr:true
                     }
                 }
                //'style-loader'
                ,{
                    loader: 'css-loader', // 当匹配到css的文件的时候
                    options:{
                        importLoaders:2 // 当匹配到css的文件的时候, 先执行前两个（sass-loader，postcss-loader）
                    }
                }, 'postcss-loader'
               , 'sass-loader' ]
            }

        ]
    },
    externals:{ // 从jquery包中 引出$ 符号就是外部的
        'jquery':'$'
    }
}