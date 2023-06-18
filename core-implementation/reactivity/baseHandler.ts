import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);

function createGetter(isReadonly = false) {
	return function get(target, key) {
		const res = Reflect.get(target, key);

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
