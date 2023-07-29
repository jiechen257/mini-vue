## TDD 开发
1. 编写测试
2. 编写代码使得测试通过
3. 重构、优化代码

## happy path 的命名
> "happy path" 指代码执行过程中没有出现错误或异常情况的正常执行路径

当 Vue 在运行时按照预期过程顺利执行，没有发生任何错误或异常，这条路径就被称为 "happy path"

``` js
Vue 的 happy path：
create(app).mount('#root') //create(app) 返回一个 app dom 挂载到根节点上

1. 初始化
2. 渲染 render
3. 调用 patch 解析 create(app)
4. 创建 vnode 节点, createVNode(type, props?, children?)
5. render
6. patch 判断类型走对应 fn
7. 更新，触发 trigger 方法
8. render -> patch -> processElement -> patchElement
```

## effect

本身是在依赖收集的时候，作为 `_effect` 属性存入跟踪的依赖之中

拓展结构：
- scheduler
- stop
- onStop



