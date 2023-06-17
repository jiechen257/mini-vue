class ReactiveEffect {
	private _fn;
	constructor(fn: any, public scheduler?: any) {
		this._fn = fn;
	}

	run() {
		// 此处的 this，绑定添加创建 effect 时的上下文
		// 当调用 fn 时，确保对应的上下文是对应的 this
		activeEffect = this;
		return this._fn();
	}
}

const targetMap = new WeakMap();

// 收集依赖
export function track(target, key) {
	// target -> key -> dep
	let depsMap = targetMap.get(target);
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()));
	}

	let dep = depsMap.get(key);
	if (!dep) {
		dep = new Set();
		depsMap.set(key, dep);
	}

	dep.add(activeEffect);
}

// 触发依赖
export function trigger(target, key) {
	let depsMap = targetMap.get(target);
	let dep = depsMap.get(key);

	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler();
		} else {
			effect.run();
		}
	}
}

let activeEffect;

export function effect(fn: any, options: any = {}) {
	// fn
	const _effect = new ReactiveEffect(fn, options.scheduler);

	_effect.run();
	return _effect.run.bind(_effect);
}
