import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffect } from "./effect";
import { reactive } from "./reactive";

export class RefImpl {
	private _value: any;
	public dep;
	private _rawValue: any;
	constructor(value) {
		this._rawValue = value;
		this._value = convert(value);
		this.dep = new Set();
	}

	get value() {
		trackRefValue(this);
		return this._value;
	}

	set value(newValue) {
		// 如果 ref.value 设置的 newValue 同旧值一样，则不做处理
		if (hasChanged(newValue, this._rawValue)) {
			this._value = convert(newValue);
			this._rawValue = newValue;
			triggerRefValue(this)
		}
	}
}

function convert(value) {
	return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
	if (isTracking()) {
		trackEffects(ref.dep);
	}
}


export function triggerRefValue(ref) {
  triggerEffect(ref.dep);
}

export function ref(raw) {
	return new RefImpl(raw);
}
