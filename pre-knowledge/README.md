## 出发点

在学习 vue 底层原理的道路上，最终实现一个 `mini-vue`

## 响应式原理的区别

vue2 是创建一个 watcher,一个 dep 建立关系

vue3 利用一个新的 api —— effect
- effect 会接收一个函数 fn,这个函数会和它内部的那些依赖响应式数据之间建立关系

### track 过程中的数据类型应用

对 targetMap 使用 `WeakMap` 类型是为了防止内存泄露

至于 keyMap 为什么不用 `WeakMap` 类型
- 一方面 key 值的类型一般是基本类型而不是对象，不能作为 `WeakMap` 的键
- 另一方面 `Map` 的查找和遍历性能也优于 `WeakMap`

deps 是 `Set` 结构：一个 Key 可能被多个 fn 调用，而且 fn 不用重复添加，需要去重，所以需要使用 Set 数据结构


## render 函数

通过一个使用原生的 render 函数来渲染一个全局的 `SearchBar` 组件

- 组件的挂载与卸载

- 全局组件应用单例模式



## diff
### vue2 双端比较

新列表和旧列表两个列表的头与尾互相对比，在对比的过程中指针会逐渐向内靠拢，直到某一个列表的节点全部遍历过，对比停止

### vue3 最长递增子序列

借鉴于 [inferno](https://github.com/infernojs/inferno)

该算法其中有两个理念:

1. 相同的前置与后置元素的预处理

2. 最长递增子序列，此思想与 React 的 diff 类似又不尽相同