const path = require('path')
module.exports = {
    mode: 'development',// --mode production
    devServer: { // 开发服务 
        // 更改静态文件基础的目录 express.static()
        contentBase: path.resolve(__dirname, '../public'),
        compress: true, // 启动gzip压缩
        port: 3000,
        open: true, // 自动打开浏览器
        overlay:true // 弹出提示层 
    }
}