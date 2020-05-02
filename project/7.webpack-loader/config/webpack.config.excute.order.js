const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    //都是根据模块的名字查找规则
    resolve: {

    },
    //都是根据模块的名字查找规则
    resolveLoader: {
        modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true
    },
    module: {
        rules: [
            {
                test: /title\.js$/,
                enforce: 'pre',//前置
                use: [
                    'pre-loader'
                ]
            },
            {
                test: /title\.js$/,
                enforce: 'post',//后置
                use: [
                    'post-loader'
                ]
            },
            {
                test: /title\.js$/,
                use: [ //normal
                    'a-loader',
                    'b-loader',
                    'c-loader'
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()   
    ]
}