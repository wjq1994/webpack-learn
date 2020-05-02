function loader(source) {
   console.log("loader执行");
   // 开启该 Loader 的缓存功能  针对更改的js文件，会重新调用loader
  this.cacheable(true);
  // 关闭该 Loader 的缓存功能  针对所有的js文件，会重新调用loader
  // this.cacheable(false);
  return source;
}
module.exports = loader;