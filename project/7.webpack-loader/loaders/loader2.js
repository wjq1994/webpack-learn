function loader2(source) {
   console.log("loader2执行");
   return source + 'console.log("loader2执行");';
}
module.exports = loader2;