# 常用插件

### babel系列

- @babel/plugin-transform-runtime

> plugin-transform-runtime

优点：

    - 不会污染全局变量 
    - 多次使用只会打包一次
    - 依赖统一按需引入,无重复引入,无多余引入

缺点：
    
    - 不支持实例化的方法Array.includes(x) 就不能转化
    - 如果使用的API用的次数不是很多，那么transform-runtime 引入polyfill的包会比不是transform-runtime 时大