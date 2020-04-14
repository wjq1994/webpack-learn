# 将插件引入全局
- webpack.ProvidePlugin
- expose-loader
- externals配置 + index.html引入cdn
- externals配置 + add-asset-html-cdn-webpack-plugin ??? (不支持webpack4，疑案)
- 引入本地模块
- expose-loader配置 将本地模块绑定到全局window ??? (疑案)

> webpack.ProvidePlugin

给每个模块都提供一个变量，每个模块都可以用，但是没有绑定到window上

注意

- 不用在页面引入import $ from 'query', 在模块中可以直接使用$

```javascript
console.log('index页面 ', $); //有值
console.log('index页面 window.$ ', window.$); //undefined
```

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    mode:'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output:{ // 每次会根据打包的内容产生一个hash戳
        // contentHash 每个文件内容不同hash就不相同
        // chunkHash 表示已入口文件产生一个hash戳
        filename: '[name].js', // 文件名
        // 不写文件夹 默认dist文件夹
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        }),
        new webpack.ProvidePlugin({ // 把jquery模块 给每个模块都提供一个$变量
            '$':'jquery'
        })
    ],
    module:{
        rules:[ // loader的写法 可以写成字符串 也可以写成对象 多个loader可以写成一个数组
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{ // .babelrc 文件
                        presets:['@babel/preset-env'], // 预设
                        plugins:[]
                    }
                }
            }
        ]
    },
}
```

> expose-loader

优点：

- 把变量暴露到全局上，window上可以引用，require.resolve('jquery')可以获取node_modules上的jquery模块

注意：

- 需要引入jquery模块  --npm install jquery
- 页面需要引入 import $ from 'jquery', 否则用不了

```javascript
import $ from 'jquery'

console.log('index页面 ', $); //有值
console.log('index页面 window.$ ', window.$); //有值
```

缺点：

- 将jquery模块打包后文件巨大

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    mode:'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output:{ // 每次会根据打包的内容产生一个hash戳
        // contentHash 每个文件内容不同hash就不相同
        // chunkHash 表示已入口文件产生一个hash戳
        filename: '[name].js', // 文件名
        // 不写文件夹 默认dist文件夹
        path:path.resolve(__dirname,'dist')
    },
    resolved
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        })
    ],
    module:{
        rules:[ // loader的写法 可以写成字符串 也可以写成对象 多个loader可以写成一个数组
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{ // .babelrc 文件
                        presets:['@babel/preset-env'], // 预设
                        plugins:[]
                    }
                }
            },
            // 把变量暴露到全局上
            { // import $ from jquery
                test: require.resolve('jquery'),
                use:{
                    loader:'expose-loader',
                    options:'aaaa' //window.aaaa
                }
            },
            { // import $ from jquery
                test: require.resolve('jquery'),
                use: {
                    loader: 'expose-loader',
                    options: 'jQuery'
                }
            }
        ]
    }
}
```

> externals配置

优点：

- 从外部引入依赖，在把变量暴露到全局上，每个模块都可以用
- 模块引入的时候会被忽略，不会打包
```javascript
---任一模块引入 webpack不会打入包中
import $ from 'jquery' 

console.log($); //有值
console.log(window.$); //有值
```
- 可以通过cdn引入外部依赖，提高性能
- 打包后，减轻包的体积

缺点：

- 全都在模版（public/index.html）里引入，代码不够简洁

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="https://cdn.bootcss.com/jquery/3.5.0/jquery.js"></script>
    <div id="app"></div>
</body>
</html>
```

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    mode:'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output:{ // 每次会根据打包的内容产生一个hash戳
        // contentHash 每个文件内容不同hash就不相同
        // chunkHash 表示已入口文件产生一个hash戳
        filename: '[name].js', // 文件名
        // 不写文件夹 默认dist文件夹
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        })
    ],
    module:{
        rules:[ // loader的写法 可以写成字符串 也可以写成对象 多个loader可以写成一个数组
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{ // .babelrc 文件
                        presets:['@babel/preset-env'], // 预设
                        plugins:[]
                    }
                }
            }
        ]
    },
    externals:{ // 从jquery包中 引出$ 符号就是外部的
        'jquery':'$'
    }
}
```

> 引入本地模块

```javascript
---webpack.config.js

resolve: {
    alias: {
        a: path.resolve(__dirname, 'src/a.js')
    }
},
```

```javascript
---需要引入的模块

import aaa from 'a'
```

> expose-loader配置 将本地模块绑定到全局window

```javascript
import $ from './a.js';


console.log('index页面 ', $); //有值
console.log('index页面 window.$ ', window.aaaa); //undefined
```

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    mode:'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output:{ // 每次会根据打包的内容产生一个hash戳
        // contentHash 每个文件内容不同hash就不相同
        // chunkHash 表示已入口文件产生一个hash戳
        filename: '[name].js', // 文件名
        // 不写文件夹 默认dist文件夹
        path:path.resolve(__dirname,'dist')
    },
    resolve: {
        alias: {
            a: path.resolve(__dirname, 'src/a.js')
        }
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        }),
        new webpack.ProvidePlugin({ // 把jquery模块 给每个模块都提供一个$变量
            '$':'jquery'
        })
    ],
    module:{
        rules:[ // loader的写法 可以写成字符串 也可以写成对象 多个loader可以写成一个数组
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{ // .babelrc 文件
                        presets:['@babel/preset-env'], // 预设
                        plugins:[]
                    }
                }
            },
            // 把变量暴露到全局上
            { // import $ from jquery
                test: path.resolve(__dirname, 'src/index.js'),
                use:{
                    loader:'expose-loader',
                    options:'aaaa'
                }
            },
        ]
    },
}
```