# webpack-loader （所有实例效果直接看打包后源码dist目录）
- [loader作用](#loader作用)
- [loader使用](#loader使用)
    - [如何配置多个loader](#如何配置多个loader)
    - [使用自定义loader的三种方式](#使用自定义loader的三种方式)
- [loader常用api](#loader常用api)
    - [cacheable](#cacheable)
    - [异步loader](#异步loader)
    - [raw&nbsp;loader](#raw&nbsp;loader)
    - [options](#options)
    - [更多api](#更多api)
- [loader实战](#loader实战)   
    - [babel-loader](#babel-loader)
    - [banner-loader](#banner-loader)
    - [file-loader](#file-loader)
    - [url-loader](#url-loader)
    - [pitch](#pitch)
        - [链式调用](#链式调用)
        - [参数](#参数)
- [loader分类](#loader分类)
    - [执行顺序](#执行顺序)
- [loader-runner](#loader-runner)
- [重点](#重点)

## loader作用

传递源代码

## loader使用

### 如何配置多个loader
- 多个loader执行顺序 normal顺序由下往上，或者 说由右向左

> config配置

```javascript
//都是根据模块的名字查找规则
resolveLoader: {
    modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
},
module: {
    rules: [
        {
            test: /\.js$/,
            exclude:/node_modules/,
            use: [
                'loader1', 'loader2' // 根据resolveLoader查找
            ]
        },
        {
            test: /\.js$/,
            exclude:/node_modules/,
            use: [
                'loader3' // 根据resolveLoader查找
            ]
        }
    ]
}
```

### 使用自定义loader的三种方式
- 使用绝地路径
- 配置resolveLoader里的 modules
- 使用npm link

## loader常用api

### cacheable

- 在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。 为此，Webpack 会默认缓存所有 Loader 的处理结果，

- 也就是说在需要被处理的文件或者其依赖的文件没有发生变化时， 是不会重新调用对应的 Loader 去执行转换操作的。

### 异步loader

- Loader 有同步和异步之分,上面介绍的 Loader 都是同步的 Loader，因为它们的转换流程都是同步的，转换完成后再返回结果。

- 但在有些场景下转换的步骤只能是异步完成的，例如你需要通过网络请求才能得出结果，如果采用同步的方式网络请求就会阻塞整个构建，导致构建非常缓慢

### raw loader

- 在默认的情况下，Webpack 传给 Loader 的原内容都是UTF-8格式编码的字符串。

- 但有些场景下 Loader 不是处理文本文件，而是处理二进制文件，例如 file-loader,就需要 Webpack 给 Loader 传入二进制格式的数据。 为此，你需要这样编写 Loader

### options

### 更多api

[loader api](https://www.webpackjs.com/api/loaders/)

## loader实战

### babel-loader

- @babel/core 转化 es5 代码
- source-map调试源代码
- this.resourcePath 获取文件路径
- this.callback 异步，或者当同步想返回多个值的时候

### banner-loader

- options
- this.cacheable
- schema-utils 校验options
- 异步loader

### file-loader

- let { interpolateName } = require('loader-utils'); 获取文件参数
- this.emitFile 复制文件到输出目录

### url-loader

基于file-loader

### pitch

- 以a!b!c!module为例,正常调用顺序应该是c=>b=>a,但是真正调用顺序是 a(pitch)=>b(pitch)=>c(pitch)=>c=>b=>a,如果其中任何一个pitching loader返回了值就相当于在它以及它右边的loader已经执行完毕
- 比如如果b返回了字符串result_b, 接下来只有a会被系统执行，且a的loader收到的参数是result_b
- loader根据返回值分为两种，一种是返回js代码(一个module的代码，含有类似module.export语句)的loader,另一种是不能作为最左边loader的其他loader
有时候我们想把两个第一种loader 连接起来，比如style-loader!css-loader! 问题是css-loader的返回值是一串js代码，如果按正常方式写style-loader的参数就是一串代码字符串
- 为了解决这种问题，我们需要在style-loader里执行require(css-loader!resources)

### 样式处理

- [css-loader](https://github.com/webpack-contrib/css-loader) 的作用是处理css中的 @import 和 url 这样的外部资源
- [style-loader](https://github.com/webpack-contrib/style-loader) 的作用是把样式插入到 DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的 innerHTML里
- [less-loader](https://github.com/webpack-contrib/less-loader) 把less编译成css

#### 链式调用

```javascript
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: [
          'a-loader',
          'b-loader',
          'c-loader'
        ]
      }
    ]
  }
};
```
执行顺序

```
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

#### 参数

remainingRequest指链式调用的右边，previousRequest指链式调用的左边

```javascript
loader.pitch = function (remainingRequest, previousRequest, data) {
    console.log('b-loader remainingRequest', remainingRequest);
    //b-loader remainingRequest /Users/wangjianqing/Desktop/project/webpack-learn/project/7.webpack-loader/loaders/c-loader.js!/Users/wangjianqing/Desktop/project/webpack-learn/project/7.webpack-loader/src/index.js
    console.log('b-loader previousRequest', previousRequest);
    //b-loader previousRequest /Users/wangjianqing/Desktop/project/webpack-learn/project/7.webpack-loader/loaders/a-loader.js
    data.name = '我是b-loader ';
    console.log('b-loader-pitch');
    //return 'b-result';
}
```

### loader分类

- pre 前置loader
- normal 普通loader
- inline 行内loader
- post 后置loader

#### 执行顺序

```
pre-loader-normal
c-loader-normal
b-loader-normal
a-loader-normal
data.name:  我是a-loader 
inline2-loader-normal
inline1-loader-normal
post-loader-normal
```

### loader-runner

loader整个过程源码

https://github.com/webpack/loader-runner/tree/master/lib

## 重点

1. 分析的时候把loader连成链 根据从上往下，从左往右的顺序，remainingRequest指链式调用的右边，previousRequest指链式调用的左边
2. 分析过程 [style-loader](loaders/style-loader.js)
```javascript
1. 串成链 配置文件从上往下，从左往右 ./src/style-loader.js!./src/css-loader.js!./src/style.css
2. pitch 里的 remainingRequest就是右面 ./src/css-loader.js!./src/style.css
3. 每当配置文件匹配到css时，先执行style的pitch，直接返回不会继续执行链了，
4. 在语法树解析时，会执行 require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)});  即"!!../loaders/css-loader.js!./style.css"
5. 又匹配到css文件（"!!../loaders/css-loader.js!./style.css"）因为!!，所以直接走css-loader，不会走style-loader
6. 如果不用!!，再走一遍style-loader，会出现死循环
7. 以上解析完毕。
```