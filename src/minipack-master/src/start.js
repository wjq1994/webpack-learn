const minipack = require('./minipack.js')
const path = require('path');

console.log(minipack)
minipack.webpackMini('./example/entry.js', path.resolve('mini.js'))