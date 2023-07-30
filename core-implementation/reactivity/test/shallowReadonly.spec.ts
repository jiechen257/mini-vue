import { isReadonly, shallowReadonly } from "../reactive";

describe("test shallowReadonly", () => {
	it("should not make properties of complex objects to reactive", () => {
		const obj = shallowReadonly({ foo: { age: 10 } });
		expect(isReadonly(obj)).toBe(true);
		expect(isReadonly(obj.foo)).toBe(false);
	});
});
