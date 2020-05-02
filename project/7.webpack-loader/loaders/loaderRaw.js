let fs = require("fs");
let path = require("path");

// 异步调用
function loader(source) {
  console.log(typeof source);
  console.log(source);
  return source
}

module.exports = loader;
module.exports.raw = true;