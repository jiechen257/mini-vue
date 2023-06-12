function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            console.log('get', key)
            // 依赖收集
            track(target, key)
            return typeof target[key] === 'object' ? reactive(target[key]) : target[key]
        },
        set(target, key, val) {
            console.log('set', key)
            target[key] = val
            // 通知更新
            trigger(target, key)
        },
        deleteProperty(target, key) {
            console.log('delete', key)
            delete target[key]
            trigger(target, key)
        }
    })
}

// 临时储存副作用函数
const effectStack = [] // 为什么是数组呢？ 因为effect存在嵌套,就会有多个副作用函数

// 依赖收集函数：包装fn,立即执行fn,返回包装结果
function effect(fn) {
    const e = createReactiveEffect(fn)
    e()
    return e
}

function createReactiveEffect(fn) {
    const effect = function() {
        try{
            effectStack.push(fn)
            return fn() // 执行可能会返回结果，所以要return
        } finally { 
            effectStack.pop()
        }
    }
    return effect
}

// 保存依赖关系的数据结构
const targetMap = new WeakMap() // WeakMap 弱引用，不影响垃圾回收机制

// 依赖收集：建立target/key和fn之间映射关系
function track(target, key) {
    // 1.获取当前副作用函数
    const effect = effectStack[effectStack.length - 1]
    if(effect){
        // 2.取出target/key对应的map
        let depMap = targetMap.get(target)
        if(!depMap){
        depMap = new Map()
        targetMap.set(target, depMap) 
        }

        // 3.获取key对应的set
        let deps = depMap.get(key)
        if(!deps){
            deps = new Set()
            depMap.set(key, deps)
        }

        // 4.存入set
        deps.add(effect)
    }
}

// 触发更新：当某个响应式数据发生变化，根据target、key获取对应的fn并执行他们
function trigger(target, key) {
    // 1.获取target/key对应的set,并遍历执行他们
    const depMap = targetMap.get(target)

    if(depMap){
        const deps = depMap.get(key)
        if(deps){
            deps.forEach(dep => dep());
        }
    }
}


const obj = reactive({ name: "jiechen", age: 18, info: { desc: "技术爱好者" } })

// 1. 先将fn存入effectStack中
// 2. 执行fn，触发proxy的get，然后进行track，在track的过程中将fn与key进行绑定
// 3. 绑定个过程是利用一个 key 对应的 depSet，里面存放对应的fn
effect(() => {
    console.log('effect1', obj.name)
})
effect(() => {
    console.log('effect2', obj.name, obj.info.desc)
})
obj.name = 'coman' // 更改一下
obj.info.desc = 'coder' // 更改一下