const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgeCssExtractPlugin = require('purgecss-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const glob = require('glob');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    devServer:{
        hot:true // 表示开启热更新
    },
    output: {
        filename: '[name].js',
        chunkFilename:"[name].video.js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname,'dll/react.dll.js')
        }),
        new MiniCssExtractPlugin({
            filename:'css/css.css'
        }),
        new PurgeCssExtractPlugin({
            paths: glob.sync(`public/**/*`, {
                nodir: true
            }),
        }),
        new webpack.DllReferencePlugin({
            manifest:path.resolve(__dirname,'dll/manifest.json')
        })
    ],
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { // .babelrc 文件
                        presets: ['@babel/preset-env','@babel/preset-react'], // 预设 执行顺序 从下往上 从右往左
                        plugins: [] // 执行顺序从上往下
                    }
                }
            },
            {
                test:/\.css$/,
                use:[
                 {
                     loader: MiniCssExtractPlugin.loader,
                     options:{
                         hmr:true
                     }
                 }
                ,{
                    loader: 'css-loader', // 当匹配到css的文件的时候
                    options:{
                        importLoaders:2
                    }
                }, 'postcss-loader'
               , 'sass-loader' ]
            }
        ]
    },
}