import { extend } from "../shared";

let activeEffect: any;
let shouldTrack = false;
class ReactiveEffect {
	private _fn;
	deps = [];
	active = true;
	onStop?: () => void;
	constructor(fn: any, public scheduler?: any) {
		this._fn = fn;
	}

	run() {
		if (!this.active) {
			return this._fn();
		}
		shouldTrack = true;
		// 此处的 this，绑定添加创建 effect 时的上下文
		// 当调用 fn 时，确保对应的上下文是对应的 this
		activeEffect = this;

		const result = this._fn();
		// reset
		shouldTrack = false;

		return result;
	}

	stop() {
		if (this.active) {
			if (this.onStop) {
				this.onStop();
			}
			cleanEffect(this);
			this.active = false;
		}
	}
}

function cleanEffect(effect: any) {
	effect.deps.forEach((dep: any) => dep.delete(effect));
	effect.deps.length = 0;
}

const targetMap = new WeakMap();

// 收集依赖
export function track(target, key) {
	if (!isTracking()) return;

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

	trackEffects(dep);
}

export function trackEffects(dep: any) {
	// 收集 effect
	if (dep.has(activeEffect)) return;

	dep.add(activeEffect);
	activeEffect?.deps.push(dep);
}

export function isTracking() {
	return shouldTrack && activeEffect !== undefined;
}

// 触发依赖
export function trigger(target, key) {
	let depsMap = targetMap.get(target);
	let dep = depsMap.get(key);

	triggerEffect(dep);
}

export function triggerEffect(dep: any) {
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler();
		} else {
			effect.run();
		}
	}
}

export function effect(fn: any, options: any = {}) {
	// fn
	const _effect = new ReactiveEffect(fn, options.scheduler);

	extend(_effect, options);

	_effect.run();
	const runner: any = _effect.run.bind(_effect);
	runner.effect = _effect;

	return runner;
}

export function stop(runner: any) {
	runner.effect.stop();
}
