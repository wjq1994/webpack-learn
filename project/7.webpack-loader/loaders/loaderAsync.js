let fs = require("fs");
let path = require("path");

// 异步调用
function loader(source) {
  let cb = this.async();
  let content = fs.readFile(path.resolve(__dirname, 'content.txt'),'utf-8', (err, content) => {
    cb(err, source + content)
  });
}
module.exports = loader;