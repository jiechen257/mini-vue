// vue.util.defineReactive(obj, key, val)
function defineReactive(obj, key, val) {
    observe(val);
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        // 触发：依赖收集
        get() {
            console.log("get key:", key, val);
            // 此时的 Dep.target 也就是一个 Watcher 实例
            Dep.target && dep.subscribe(Dep.target) 
            return val;
        },
        // 触发：依赖更新
        set(v) {
            console.log("set key:", key, v);
            observe(v); // 有可能设置的也是一个对象
            val = v;
            // 通知更新
            dep.notify()
        },
    });
}

function observe(obj) {
    if (typeof obj !== "object" || obj === null) {
        return;
    }
    Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}
// this.$set(obj, key, val)， 这里需要注意obj，必须是已经进行响应式处理的对象
function set(obj, key, val) {
    defineReactive(obj, key, val);
}

class Watcher {
    constructor(key, update) {
        this.key = key
        this.updater = update
        // 触发：依赖收集
        Dep.target = this // 设置一个全局的静态属性，储存Watcher实例
        obj[key] // 读一下触发Object.defineProperty里的get方法进行依赖收集
        Dep.target = null // 一旦建立了关系，则设置为空，防止频繁被添加
    }

    update() {
        const val = obj[this.key]
        this.updater(val)
    }
}
// 每一个key关联一个Dep
class Dep {
    constructor() {
        this.deps = []
    }

    subscribe(dep) {
        this.deps.push(dep)
    }

    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

// 模拟更新函数
function update(key) {
    // state本身的handle
    const fn = function (val) {
        app.innerHTML = val
    }
    fn(obj[key])
    // vue去绑定 key => handle
    new Watcher(key, function(val) {
        fn(val)
    })
}

let obj = { name: "jiechen", age: 18 };

// 模拟 data() 中的额外操作
observe(obj);

// 模拟 methods 中的额外操作
update('age')

setInterval(() => {
    obj.age++
}, 1000)