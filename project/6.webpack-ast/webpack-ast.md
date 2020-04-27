# AST(Abstract Syntax Tree)

- [什么是AST？](#什么是AST？)
- [AST用途](#AST用途)
- [JavaScript Parser](#JavaScriptParser)
    - [计算机是如何识别javascript代码的？](#计算机是如何识别javascript代码的？)
    - [常用JavaScriptParser](#常用JavaScriptParser)
- [AST Explorer](#AST&nbsp;Explorer)
- [实例](#实例)
    - [esprima](#esprima)
    - [babel](#babel)
- [参考文献](#参考文献) 

### 什么是AST？

这些工具的原理都是通过JavaScript Parser把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作。

- 在计算机科学中，抽象语法树（abstract syntax tree或者缩写为AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。
- Javascript的语法是为了给开发者更好的编程而设计的，但是不适合程序的理解。所以需要转化为AST来使之更适合程序分析，浏览器编译器一般会把源码转化为AST来进行进一步的分析等其他操作。

### AST用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
    - 如JSLint、JSHint对代码错误或风格的检查，发现一些潜在的错误
    - IDE的错误提示、格式化、高亮、自动补全等等
- 代码混淆压缩
    - UglifyJS2等
- 优化变更代码，改变代码结构使达到想要的结构
    - 代码打包工具webpack、rollup等等
    - CommonJS、AMD、CMD、UMD等代码规范之间的转化
    - CoffeeScript、TypeScript、JSX等转化为原生Javascript

### JavaScriptParser

#### 计算机是如何识别javascript代码的？

- JavaScript Parser，把js源码转化为抽象语法树的解析器。
- 浏览器会把js源码通过解析器转为抽象语法树，再进一步转化为字节码或直接生成机器码。
- 一般来说每个js引擎都会有自己的抽象语法树格式，Chrome的v8引擎，firefox的SpiderMonkey引擎等等，MDN提供了详细SpiderMonkey AST format的详细说明，算是业界的标准。

#### 常用JavaScriptParser

[esprima](https://github.com/jquery/esprima)

[uglifyJS2](https://github.com/mishoo/UglifyJS2)

[traceur](https://github.com/google/traceur-compiler)

[acorn](https://github.com/acornjs/acorn)

[espree](https://github.com/eslint/espree)

[@babel/parser](https://github.com/babel/babel/tree/master/packages/babel-parser)

### AST&nbsp;Explorer

https://astexplorer.net/

### 实例

#### esprima

1. 安装依赖

esprima 将代码解析成ast 

estraverse 对ast操作

escodegen ast生成代码

```javascript
npm i esprima estraverse escodegen
```

2. astexplorer

利用astexplorer，将代码可视化生成ast树，方便操作

3. 实现具体逻辑

```javascript
//1.用来把源代码转成抽象语法树 code=>ast
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
let indent = 0;
function padding() {
    return ' '.repeat(indent);
}
//Identifier一般就是变量
let code = `function ast(){}`;
let ast = esprima.parseModule(code);
//console.log(JSON.stringify(result, null, 2));
estraverse.traverse(ast, {
    //每个节点都会进一遍
    enter(node) { //进入
        console.log(padding() + node.type + '进入');
        if (node.type === 'FunctionDeclaration') {
            node.id.name = 'newAst';
        }
        indent += 2;
    },
    leave(node) {//离开
        indent -= 2;
        console.log(padding() + node.type + '退出');
    }
});
//把修改过后的抽象语法树重新生成源代码
let result = escodegen.generate(ast);
console.log(result);
```

#### babel

@babel/core esprima 可以把源代码转成语法树

babel-traverse 可以用来遍历语法树或者修改语法树

babel-types 生成AST语法的节点，或者验证一个节点是不是某种类型

> 箭头函数转换

```javascript
//cnpm i @babel/core babel-types babel-traverse -D
// @babel/core esprima 可以把源代码转成语法树
// babel-traverse 可以用来遍历语法树或者修改语法树
//babel-types 生成AST语法的节点，或者验证一个节点是不是某种类型
let babel = require('@babel/core');
let t = require('babel-types');
const code = `const sum = (a,b)=>a+b`;
//const result = `const sum = function(a,b){return a+b}`
//这是一种访问者模式，就是可以访问语法树中所有的节点，在里面可以对节点进行转换
//path当前路径  path.node 代表当前对应的节点
//path.parent 当前路径的父节点 path.parentPath代表当前路径父路径
let ArrayFunctionPlugin = {
    visitor: {
        ArrowFunctionExpression: (path) => {
            console.log(path);
            let node = path.node;//获取老节点 
            let id = path.parent.id;
            let params = node.params;
            path.parentPath.parent.kind = 'var';
            let body = t.blockStatement([
                t.returnStatement(node.body)
            ]);
            let functionExpression = t.functionExpression(id, params, body, false, false);
            //在当前的路径上，用新的节点替换掉老的节点
            path.replaceWith(functionExpression);
        }
    }
}
//babel只一个转换引擎，默认什么都不做，它要做的工作需要我们通过插件来提供
let result = babel.transform(code, {
    plugins: [ArrayFunctionPlugin]
});
console.log(result.code);
```

> babel插件开发

```javascript
//开发插件完成以下操作
import { flatten as xx, concat } from 'lodash';
//import xx from 'lodash/flatten';
//import concat from 'lodash/concat';
```

```javascript
let babel = require('@babel/core');
let t = require('babel-types');

let visitor = {
    ImportDeclaration: {
        enter(path, state = { opts }) {
            let specifiers = path.node.specifiers;
            let source = path.node.source;//"lodash"
            if (state.opts.libraryName === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
                let importDeclarations = specifiers.map(specifier => {
                    return t.importDeclaration([t.importDefaultSpecifier(specifier.local)], t.stringLiteral(`${source.value}/${specifier.imported.name}`));
                });
                path.replaceWithMultiple(importDeclarations);
            }
        }
    }
}
module.exports = function (babel) {
    return { visitor };
}
```

### 参考文献

[babel-handbook](https://github.com/jamiebuilds/babel-handbook)

[babel从入门到入门的知识归纳](https://zhuanlan.zhihu.com/p/28143410)

[babel-type](https://www.babeljs.cn/docs/babel-types)