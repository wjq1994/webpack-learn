function loader(source) {
    console.log("loader1执行");
    return source + ';console.log("loader1执行");';
 }


 module.exports = loader;