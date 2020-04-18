# webpack打包后文件分析

- [准备知识](#准备知识)
- [harmony](#harmony)
- [打包分析](#打包分析)
    - [同步加载](#同步加载)
    - [异步加载](#异步加载)
- [总结](#总结)

### 准备知识

- Symbol.toStringTag

```javascript
let obj = {};
//1参数是要定义属性的对象 2参数是属性名 3参数是属性描述器
Object.defineProperty(obj, Symbol.toStringTag, {
    value: 'Module'
});
console.log(Object.prototype.toString.call(obj));
console.log(Object.prototype.toString.call([]));
console.log(Object.prototype.toString.call(null));
console.log(Object.prototype.toString.call(undefined));
console.log(Object.prototype.toString.call('string'));
console.log(Object.prototype.toString.call(true));
```

- Object.create(null)
- Object.defineProperty

### harmony

常用的载入模块，es6模块、common模块

- common.js加载 common.js
```javascript
//index.js
let title = require('./title');
console.log(title.name);
console.log(title.age);
```

```javascript
//title.js
exports.name = 'title_name';
exports.age = 'title_age';
```

```javascript
//bundle.js
{
"./src/index.js":
  (function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  }),
"./src/title.js":
  (function(module, exports) {
    exports.name = 'title_name';
    exports.age = 'title_age';
  })
}
```
- common.js加载 ES6 modules
- ES6 modules 加载 ES6 modules
- ES6 modules 加载 common.js
```javascript
//index.js
import home, { name, age } from './title';
console.log(name);
console.log(age);
console.log(home);
```
```javascript
//title.js
module.exports = { home: 'beijing' };
module.exports.name = 'title_name';
module.exports.age = 'title_age';
```
```javascript
//bundlse.js
{
    "./src/index.js":
      (function (module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./title */ "./src/title.js");
    /* harmony import */ var _title__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_title__WEBPACK_IMPORTED_MODULE_0__);
        console.log(_title__WEBPACK_IMPORTED_MODULE_0__["name"]);
        console.log(_title__WEBPACK_IMPORTED_MODULE_0__["age"]);
        console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a);
      }),

    "./src/title.js":
      (function (module, exports) {
        module.exports = {
          home: 'beijing'
        };
        module.exports.name = 'title_name';
        module.exports.age = 'title_age';
      })
  }
```

### 打包分析

- 同步加载
- 异步加载

#### 同步加载

生成一个简单的配置

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development', //开发模式下打包出来的文件不会压缩
    devtool: 'none',//不需要生成sourcemap文件
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),//产出的文件路径
        filename: 'bundle.js'//产出的文件名
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                },
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
```

分析打包后的文件（主要方法）

- d
```javascript
//d defineProperty 通过getter的方式增加属性
function d(obj, name, get) {
    Object.defineProperty(obj, name, {
        enumerable: true,
        get
    });
}
let obj = {};
let myAge = 100;
d(obj, 'age', function () {
    return myAge;
});
console.log(obj);
console.log(obj.age);
```

- r
```javascript
//转为ES6模式
function r(obj) {
    Object.defineProperty(obj, Symbol.toStringTag, {
        enumerable: true,
        value: 'Module'
    });
    obj[Symbol.toStringTag] = 'Module';
    Object.defineProperty(obj, '__esModule', { enumerable: true, value: true });
    obj['__esModule'] = true;
}
let obj = {};
r(obj);
console.log(obj);
```
- n
```javascript
//module可能是一个commonjs模块，也可能是一个es6模块
//es6模块 会有一个 __esModule=true,默认导出在模块的default属性上
function n(mod) {
    let getter = mod.__esModule ? function () {
        return mod.default;
    } : function () {
        return mod;
    }
    return getter;
}
let mod = {
    __esModule: true,
    default: { name: 'zhufeng' }
}
let getter = n(mod);
console.log(getter());
let mod2 = {
    name: 'jiagou'
}
let getter2 = n(mod2);
console.log(getter2());
```
- t
```javascript
// create a fake namespace object 创建一个命名空间对象
// mode & 1: value is a module id, require it
// mode & 2: merge all properties of value into the ns
// mode & 4: return value when already ns object
// mode & 8|1: behave like require
//value可能是一个模块ID，也可能是一个模块对象

__webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule)
        return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value)
        __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
};


let modules = {
    'moduleA': function (module, exports) {
        module.exports = 'moduleA导出内容';
    },
    'moduleB': function (module, exports) {
        module.exports = {
            __esModule: true,
            default: 'moduleB导出内容'
        };
    },
    'moduleC': function (module, exports) {
        module.exports = { name: 'moduleC导出内容' };
    }
}
function t(value, mode) {
    if (mode & 1) {//模块ID需要加载
        value = __webpack_require__(value);
    }
    if (mode & 4) {//如果已经是es6模块了，则直接返回
        if (value.__esModule)
            return value;
    }
    if (mode & 8) return value; //直接返回，不需要包装成es6 modules
    var ns = Object.create(null);
    ns.__esModule = true;
    ns.default = value;//把value放在新创建的命名空间的default属性上
    if (mode & 2) {//如果2为true,就把value的所有属性都拷贝到ns对象上
        for (let key in value) {
            ns[key] = value[key];
        }
    }
    return ns;
}

function t2(value, isModuleId, returnEs6Modules, immediatelyReturn, copyAttributes) {
    if (isModuleId) {//模块ID需要加载
        value = __webpack_require__(value);
    }
    if (returnEs6Modules) {//如果已经是es6模块了，则直接返回
        if (value.__esModule)
            return value;
    }
    if (immediatelyReturn) return value; //直接返回，不需要包装成es6 modules
    var ns = Object.create(null);
    ns.__esModule = true;
    ns.default = value;//把value放在新创建的命名空间的default属性上
    if (copyAttributes) {//如果2为true,就把value的所有属性都拷贝到ns对象上
        for (let key in value) {
            ns[key] = value[key];
        }
    }
    return ns;
}
let moduleA = t('moduleA', 0b1001);
console.log(moduleA);
let moduleB = t('moduleB', 0b0101);
console.log(moduleB.default);
//强行的把moduleC按照es6module返回
let moduleC = t2('moduleC', true, true, false, true);// 0111转成十进制7 1+2+4
console.log(moduleC);
function __webpack_require__(moduleId) {
    //声明了一个新的模块
    var module = {
        i: moduleId,
        l: false,
        exports: {}
    }
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
}
```

####  异步加载

> 异步加载步骤（基本通用）

1. 先加载主代码块，主代码块里包含入口模块和入口模块直接依赖的模块
2. 点击按钮的，会通过JSONP其它 代码块，其它代码里包含其它额外的模块。
3. 先创建一个script标签，然后把它的src指向要异步加载 的代码块的文件的路径。然后把这个script标签添加页面里面去。
4. 然后浏览器会立刻马上请求对应的资源。
5. 资源返回后异步加载的脚本会立刻执行。[].webpackJsonpCallback
6. webpackJsonpCallback里面会把对应的代码块的加载状态设置为0，然后把新取到的模块的定义合并到原来的模块总的对象上。
7. promise完成就，异步加载也就是完成，然后就是调用t进行require这个模块了，然后就可以后续调用了

> 异步的模块会生成新的bundle

```javascript
import a from './a';
let button = document.createElement('button');
button.innerHTML = '异步加载额外的模块' + a;
button.onclick = function () {//绑定一个事件
    // /*webpackChunkName: 'b'*/ Magic Comments（魔术注释法）定义打包的文件名
    import(/*webpackChunkName: 'b'*/'./b').then(result => {
        console.log(result);
    });
}
document.body.appendChild(button);
```

> 异步模块b.bundle.js

打包后新生成b.bundle.js  等待被加载

```javascript
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["b"],{

/***/ "./src/b.js":
/*!******************!*\
  !*** ./src/b.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var a = __webpack_require__(/*! ./a */ "./src/a.js");

var c = __webpack_require__(/*! ./c */ "./src/c.js");

module.exports = 'b模块的' + a + c;

/***/ }),

/***/ "./src/c.js":
/*!******************!*\
  !*** ./src/c.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = 'c模块的';

/***/ })

}]);
```

> 主模块bundle.js

1. 异步加载模块
```javascript
__webpack_require__.e(/*! import() | b */ "b").then(__webpack_require__.t.bind(null, /*! ./b */ "./src/b.js", 7)).then(function (result) {
    console.log(result);
  });
```
2. 执行__webpack_require__.e

__webpack_require__.e（异步方法）因为里面有异步操作，先创建一个script标签，然后把它的src指向要异步加载 的代码块的文件的路径。然后把这个script标签添加页面里面去，等待加载完成，返回promise。

3. script标签（即b.bundle.js）加载完成（这里jsonp原理），执行的是bundle.js里的方法webpackJsonpCallback()

4. webpackJsonpCallback里完成__webpack_require__.e的resolve状态

5. __webpack_require__.e异步结束执行then方法

```javascript
 (function(modules) { // webpackBootstrap
     // install a JSONP callback for chunk loading
     // jsonp里执行
 	function webpackJsonpCallback(data) {
 		var chunkIds = data[0];
 		var moreModules = data[1];

 		// add "moreModules" to the modules object,
 		// then flag all "chunkIds" as loaded and fire callback
 		var moduleId, chunkId, i = 0, resolves = [];
 		for(;i < chunkIds.length; i++) {
 			chunkId = chunkIds[i];
 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
 				resolves.push(installedChunks[chunkId][0]);
 			}
 			installedChunks[chunkId] = 0;
 		}
 		for(moduleId in moreModules) {
 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
 				modules[moduleId] = moreModules[moduleId];
 			}
 		}
 		if(parentJsonpFunction) parentJsonpFunction(data);

 		while(resolves.length) {
 			resolves.shift()();
 		}

 	};


 	// The module cache
 	var installedModules = {};

 	// object to store loaded and loading chunks
 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
 	// Promise = chunk loading, 0 = chunk loaded
 	var installedChunks = {
 		"main": 0
 	};



 	// script path function
 	function jsonpScriptSrc(chunkId) {
 		return __webpack_require__.p + "" + chunkId + ".bundle.js"
 	}

 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}

 	// This file contains only the entry chunk.
 	// The chunk loading function for additional chunks
 	__webpack_require__.e = function requireEnsure(chunkId) {
 		var promises = [];


 		// JSONP chunk loading for javascript

 		var installedChunkData = installedChunks[chunkId];
 		if(installedChunkData !== 0) { // 0 means "already installed".

 			// a Promise means "currently loading".
 			if(installedChunkData) {
 				promises.push(installedChunkData[2]);
 			} else {
 				// setup Promise in chunk cache
 				var promise = new Promise(function(resolve, reject) {
 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
 				});
 				promises.push(installedChunkData[2] = promise);

 				// start chunk loading
 				var script = document.createElement('script');
 				var onScriptComplete;

 				script.charset = 'utf-8';
 				script.timeout = 120;
 				if (__webpack_require__.nc) {
 					script.setAttribute("nonce", __webpack_require__.nc);
 				}
 				script.src = jsonpScriptSrc(chunkId);

 				// create error before stack unwound to get useful stacktrace later
 				var error = new Error();
 				onScriptComplete = function (event) {
 					// avoid mem leaks in IE.
 					script.onerror = script.onload = null;
 					clearTimeout(timeout);
 					var chunk = installedChunks[chunkId];
 					if(chunk !== 0) {
 						if(chunk) {
 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
 							var realSrc = event && event.target && event.target.src;
 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
 							error.name = 'ChunkLoadError';
 							error.type = errorType;
 							error.request = realSrc;
 							chunk[1](error);
 						}
 						installedChunks[chunkId] = undefined;
 					}
 				};
 				var timeout = setTimeout(function(){
 					onScriptComplete({ type: 'timeout', target: script });
 				}, 120000);
 				script.onerror = script.onload = onScriptComplete;
 				document.head.appendChild(script);
 			}
 		}
 		return Promise.all(promises);
 	};

 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};

 	// define __esModule on exports
 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	// create a fake namespace object
 	// mode & 1: value is a module id, require it
 	// mode & 2: merge all properties of value into the ns
 	// mode & 4: return value when already ns object
 	// mode & 8|1: behave like require
 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";

 	// on error function for async loading
 	__webpack_require__.oe = function(err) { console.error(err); throw err; };

    // jsonp
 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
 	jsonpArray.push = webpackJsonpCallback;
 	jsonpArray = jsonpArray.slice();
 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
 	var parentJsonpFunction = oldJsonpFunction;


 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
 })
/************************************************************************/
 ({

/***/ "./src/a.js":
/*!******************!*\
  !*** ./src/a.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

console.log('a模块初始化');
module.exports = 'a模块';

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a */ "./src/a.js");
/* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_a__WEBPACK_IMPORTED_MODULE_0__);

var button = document.createElement('button');
button.innerHTML = '异步加载额外的模块' + _a__WEBPACK_IMPORTED_MODULE_0___default.a;

button.onclick = function () {
  //绑定一个事件  
  __webpack_require__.e(/*! import() | b */ "b").then(__webpack_require__.t.bind(null, /*! ./b */ "./src/b.js", 7)).then(function (result) {
    console.log(result);
  });
};

document.body.appendChild(button);

/***/ })

 });
```
### 总结

> 异步的用法

第一步：new Promise

第二步：将异步逻辑放在Promise中

第三步：异步处理完成后给Promise一个状态resolve或reject

```javascript
new Promise((resolve, reject) => {
    console.log("异步开始");
}).then(() => {
    console.log("异步完成"); // 没有resolve/reject，不会执行
});
```

> jsonp的用法

两个必要条件

一、两个js文件a.js和b.js

二、a.js加载b.js，b.js执行a.js里的方法

> t函数

利用二进制 & 减少if else的使用

```javascript
// create a fake namespace object 创建一个命名空间对象
// mode & 1: value is a module id, require it
// mode & 2: merge all properties of value into the ns
// mode & 4: return value when already ns object
// mode & 8|1: behave like require
//value可能是一个模块ID，也可能是一个模块对象

__webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule)
        return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value)
        __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
};

```