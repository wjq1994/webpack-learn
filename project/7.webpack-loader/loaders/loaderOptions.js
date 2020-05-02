const loaderUtils = require("loader-utils");

// 异步调用
function loader(source) {
  const options = loaderUtils.getOptions(this);
  console.log(options);
  return source
}

module.exports = loader;