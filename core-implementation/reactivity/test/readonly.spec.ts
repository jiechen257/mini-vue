import { reactive } from "../reactive";

describe("readonly", () => {
	it("happy path", () => {
		const original = { foo: 1, bar: { baz: 2 } };

		const wrapped = reactive(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
	});
});
