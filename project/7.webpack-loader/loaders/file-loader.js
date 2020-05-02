/**
 * 把文件从源代码的目录输出到了输出目录 里
 * @param {} inputSource 
 */
let { interpolateName } = require('loader-utils');
function loader(content) {
    let filename = interpolateName(this, '[hash].[ext]', { content }); // interpolateName获取文件参数
    console.log('filename', filename);
    this.emitFile(filename, content); //复制文件到输出目录
    return `
    exports.__esModule = true;
    exports[Symbol.toStringTag]='Module';
    exports.default = ${JSON.stringify(filename)}
    `;
}
loader.raw = true;
module.exports = loader;
