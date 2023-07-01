import { isReadonly, reactive, readonly } from "../reactive";

describe("readonly", () => {
	it("happy path", () => {
		const original = { foo: 1, bar: { baz: 2 } };

		const wrapped = readonly(original);
		expect(wrapped).not.toBe(original);
		expect(isReadonly(wrapped)).toBe(true);
		expect(isReadonly(original)).toBe(false);
		expect(isReadonly(wrapped.bar)).toBe(true);
		expect(isReadonly(original.bar)).toBe(false);
		expect(wrapped.foo).toBe(1);
	});

	it("warn then call set", () => {
		console.warn = jest.fn();
		const foo = readonly({ age: 18 });

		foo.age = 19;
		expect(console.warn).toBeCalled();
	});
});
