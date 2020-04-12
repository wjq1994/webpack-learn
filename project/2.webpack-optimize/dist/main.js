/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/react-dom/index.js":
/*!****************************************************************************!*\
  !*** delegated ./node_modules/react-dom/index.js from dll-reference react ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = (__webpack_require__(/*! dll-reference react */ \"dll-reference react\"))(\"./node_modules/react-dom/index.js\");\n\n//# sourceURL=webpack:///delegated_./node_modules/react-dom/index.js_from_dll-reference_react?");

/***/ }),

/***/ "./node_modules/react/index.js":
/*!************************************************************************!*\
  !*** delegated ./node_modules/react/index.js from dll-reference react ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = (__webpack_require__(/*! dll-reference react */ \"dll-reference react\"))(\"./node_modules/react/index.js\");\n\n//# sourceURL=webpack:///delegated_./node_modules/react/index.js_from_dll-reference_react?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n\n\nreact_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render('hello', document.getElementById('app')); // 可以动态加载video.js  打包的时候需要打包出两个  jsonp 创建一个script标签\n// import()\n// let btn = document.createElement('button');\n// import xxx froim 'xxx'\n// es6Module 静态的\n// commonsModule requore\n// btn.addEventListener('click',()=>{ // vue-router\n// 页面开始渲染的时候\n// prefetch preload\n// 单页应用 会配置很多个路由 路由页面可能就是 预先加载的\n//import(/* webpackChunkName: 'my'*/ /*webpackPrefetch:true*/'./video.js').then(data=>{ // 动态加载文件\n//   console.log(data.default);\n//})\n//})\n// document.body.appendChild(btn);\n// import $ from 'jquery';\n// console.log('$',$)\n// // 1) 把所有的模块都注入一个变量 providePlugin\n// // 2) bootstrap-table 强制依赖全局的window expose-loader 可以将任何模块暴露到全局上window\n// import './index.css';  // js模块 babel-loader\n// import {\n//     render,\n//     rerender\n// } from './a.js'\n// render();\n// if(module.hot){ // devServer:{hot:true}\n//     module.hot.accept(['./a.js'],function () {\n//          rerender();\n//     });\n// }\n// css-loader 可以转化里面引入的图片等 style-loader\n//  sass-loader  node-sasss\n// less-loader less\n// stylus-loader stylus\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "dll-reference react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = react;\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ })

/******/ });