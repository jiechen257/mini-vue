class ReactiveEffect {
	private _fn;
	constructor(fn: any) {
		this._fn = fn;
	}

	run() {
		activeEffect = this;
		this._fn();
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
		effect.run();
	}
}

let activeEffect;

export function effect(fn: any) {
	// fn
	const _effect = new ReactiveEffect(fn);
	_effect.run();
}
