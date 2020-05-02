function loader3(source) {
   console.log("loader3执行");
   return source + 'console.log("loader3执行");';
}
module.exports = loader3;