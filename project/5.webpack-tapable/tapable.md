# tapable思路总结

- 两个重要的类 Hook.js（负责处理参数和方法）, HookCodeFactory.js（负责创建函数）
- 核心发布定阅模式

## 案例分析 SyncHook

> 使用SyncHook

1. SyncHook extends Hook

2. SyncHook 新增编译方法，在call时调用

```javascript
//  call调用的方法并不是写死，而是动态的编译出来
const Hook = require('./Hook');
const HookCodeFactory = require('./HookCodeFactory');
const factory = new HookCodeFactory();
class SyncHook extends Hook {
    //  call调用的方法并不是写死，而是动态的编译出来
    compile(options) {//{args,taps}
        factory.setup(this, options);
        return factory.create(options);
    }
}
module.exports = SyncHook;
```

3. new SyncHook(['name', 'age'])

存放参数列表 ['name', 'age']

4. hook.tap

注册监听函数

5. hook.call

利用HookCodeFactory创建一个函数，将所有监听函数都放在创建函数里执行


```javascript
let hook = new SyncHook(['name', 'age']);    // Hook里存放参数列表 ['name', 'age']
//tap用来注册监听函数，就类似于events库中的on
hook.tap('1', (name, age) => {               // 注册监听函数 
    console.log(1, name, age);
});
hook.tap('2', (name, age) => {
    console.log(2, name, age);
});
//call表示执行，触发所有监听函数执行
hook.call('zhufeng', 10);                   // 利用HookCodeFactory new Function 创建一个函数，所有的监听函数都放在新创建的函数里
```