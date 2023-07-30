import { isTracking, trackEffects, triggerEffect } from "./effect";

class RefImpl {
	private _value: any;
	public dep;
	constructor(value) {
		this._value = value;
		this.dep = new Set();
	}

	get value() {
		if (isTracking()) {
			trackEffects(this.dep);
		}
		return this._value;
	}

	set value(newValue) {
    // 如果 ref.value 设置的 newValue 同旧值一样，则不做处理
    if (Object.is(newValue, this._value)) return;

		this._value = newValue;
		triggerEffect(this.dep);
	}
}

export function ref(raw) {
	return new RefImpl(raw);
}
