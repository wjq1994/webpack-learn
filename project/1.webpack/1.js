(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) { // 查看模块是否存在
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = { // 如果不存在就创建一个模块
            i: moduleId,
            l: false,
            exports: {}
        };
        // 找到对应的传入的模块 让她执行
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        module.l = true;

        return module.exports;
    }
    // 默认会先引用主模块代码
    return __webpack_require__("./src/index.js");
})
    ({

        "./src/a.js":
            (function (module, exports) {

                eval("module.exports = 'hello'\n\n//# sourceURL=webpack:///./src/a.js?");
            }),
        "./src/index.js":
            (function (module, exports, __webpack_require__) {
                eval("// 模块打包器 支持es6 模块 commonjs模块\n\nlet str = __webpack_require__(/*! ./a */ \"./src/a.js\")\n\nconsole.log(str);\n\n//# sourceURL=webpack:///./src/index.js?");

            })
    });
    // 自己实现了一个commonjs规范，在浏览器中也可以解析 require module.exports语法s