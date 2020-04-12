
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render('hello',document.getElementById('app'))




// 可以动态加载video.js  打包的时候需要打包出两个  jsonp 创建一个script标签
// import()

// let btn = document.createElement('button');

// import xxx froim 'xxx'

// es6Module 静态的
// commonsModule requore

// btn.addEventListener('click',()=>{ // vue-router
    // 页面开始渲染的时候
    // prefetch preload

    // 单页应用 会配置很多个路由 路由页面可能就是 预先加载的
    //import(/* webpackChunkName: 'my'*/ /*webpackPrefetch:true*/'./video.js').then(data=>{ // 动态加载文件
     //   console.log(data.default);
    //})
//})

// document.body.appendChild(btn);




// import $ from 'jquery';
// console.log('$',$)


// // 1) 把所有的模块都注入一个变量 providePlugin
// // 2) bootstrap-table 强制依赖全局的window expose-loader 可以将任何模块暴露到全局上window
// import './index.css';  // js模块 babel-loader
// import {
//     render,
//     rerender
// } from './a.js'
// render();
// if(module.hot){ // devServer:{hot:true}
//     module.hot.accept(['./a.js'],function () {
//          rerender();
//     });
// }

// css-loader 可以转化里面引入的图片等 style-loader
//  sass-loader  node-sasss
// less-loader less
// stylus-loader stylus