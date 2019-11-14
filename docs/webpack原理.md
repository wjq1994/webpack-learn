## 引用

```javascript
const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const {transformFromAst} = require('babel-core');
```

## 步骤
```
基础的打包编译工具需要完成的功能：
1、转换 ES6 语法成 ES5
2、处理模块加载依赖
3、生成一个可以在浏览器加载执行的 js 文件
```

## 实现

核心步骤就是通过 babylon 生成 AST ，通过 babel-core 的 transformFromAst 方法将 AST 重新生成源码，traverse 的作用就是帮助开发者遍历 AST 抽象语法树，帮助我们获取树节点上的需要的信息和属性

1. 全局ID

全局的自增 id，记录每一个载入的模块的 id，我们将所有的模块都用唯一标识符进行标示，因此自增 id 是最有效也是最直观的，有多少个模块，一统计就出来了。

2. 对文件进行处理
```javascript
function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  //将代码转换成抽象语法树（AST）
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });
  const dependencies = [];
  //遍历ast树，提取树中的dependencies（依赖，也就是我们文件中所有的 import xxxx from xxxx）
  //node.source.value就是我们 import from xxxx 中的地址
  traverse(ast, {
    ImportDeclaration: ({node}) => {
      dependencies.push(node.source.value);
    },
  });
  //获取到依赖之后，将AST代码转换成commonjs代码，并且将ID自增
  const id = ID++;
  const {code} = transformFromAst(ast, null, {
    presets: ['env'],
  });
  
  const customCode = loader(filename, code)
  return {
    id,
    filename,
    dependencies,
    code,
  };
}
```

3. 将所有文件模块组成集合queue
```javascript
function createGraph(entry) {
  //收集入口文件entry的依赖
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);
    asset.dependencies.forEach(relativePath => {
      //将相对路径转化为绝对路径
	  const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }
  return queue;
}
```
4. 创建bundle函数
```javascript
function bundle(graph) {
  let modules = '';
  //将上一步生成的文件模块集合 整理成{0: code, 1: code, 2: code}, code为二元数组包括执行代码，和模块mapping(模块的绝对路径和打包对应的ID)
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });
  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;
  return result;
}
```

## 实用工具

[代码转换成AST](https://astexplorer.net/)