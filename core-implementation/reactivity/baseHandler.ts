import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { ReactiveFlags, isReactive, isReadonly, reactive, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow =false) {
	return function get(target, key) {
		const res = Reflect.get(target, key);

		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly;
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isReadonly;
		}

		// shallowReadonly
		if (shallow) {
			return res;
		}

		if (isObject(res)) {
			return isReadonly ? readonly(res) : reactive(res);
		}

		if (!isReadonly) {
			// 依赖收集
			track(target, key);
		}
		return res;
	};
}

function createSetter(isReadonly = false): any {
	return function set(target, key, value) {
		if (isReadonly) {
			console.warn(`Cannot set ${key} because it is readonly.`);
			return true;
		} else {
			const res = Reflect.set(target, key, value);

			// 触发依赖
			trigger(target, key);
			return res;
		}
	};
}

export const mutableHandler = {
	get,
	set,
};

export const readonlyHandler = {
	get: readonlyGet,
	set: readonlySet,
};

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
	get: shallowReadonlyGet
})
