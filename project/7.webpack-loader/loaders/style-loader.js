/* function loader(source) {//output.css
    return (
        `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(style);
        `
    )
} */
let loaderUtils = require('loader-utils');
//  inputSource=`module.exports ="div{color:red}"`
module.exports = (inputSource) => {

};
//request "./loaders/style-loader.js!./loaders/css-loader.js!./src/style.css"
//remainingRequest剩下的request    css-loader绝对路径!./style.css绝对路径 "./loaders/css-loader.js!./src/style.css"

//loaderUtils.stringifyRequest 转换路径的  绝对路径! 转成相对路径其实就是模块ID，也就是相对于项目根路径 ./src
//即：Users/wangjianqing/Desktop/project/webpack-learn/project/7.webpack-loader/src/style.css => ./src/style.css

//"!!" 表示忽略pre normal post 只留下inline   require('!!loader1!loader2!./style.css')

//require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)}); 在语法树解析，不是在loader中，所以在语法树中

//分析过程
//1. 串成链 配置文件从上往下，从左往右 ./src/style-loader.js!./src/css-loader.js!./src/style.css
//2. pitch 里的 remainingRequest就是右面 ./src/css-loader.js!./src/style.css
//3. 每当配置文件匹配到css时，先执行style的pitch，直接返回不会继续执行链了，
//4. 在语法树解析时，会执行 require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)});  即"!!../loaders/css-loader.js!./style.css"
//5. 又匹配到css文件（"!!../loaders/css-loader.js!./style.css"）因为!!，所以直接走css-loader，不会走style-loader
//6. 如果不用!!，再走一遍style-loader，会出现死循环
//7. 以上解析完毕。

module.exports.pitch = function (remainingRequest) {
    console.log('style pitch');
    console.log('remainingRequest', remainingRequest);
    //"!!../loaders/css-loader.js!./style.css"
    ///../loaders/css-loader.js!style-loader
    console.log('loaderUtils.stringifyRequest(this, "!!" + remainingRequest)=', loaderUtils.stringifyRequest(this, "!!" + remainingRequest));
    return (
        `
        let style = document.createElement('style');
        style.innerHTML = require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)}); 
        document.head.appendChild(style);
        `
    )
}