const path = require('path');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = (...filename) => {
    return path.resolve(...filename)
}
console.log(process.env.development);  // cross-env 

module.exports = (env) => {
  console.log(env)
}