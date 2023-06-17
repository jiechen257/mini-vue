import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
	it("happy path", () => {
		const user = reactive({
			age: 10,
		});

		let nextAge;
		effect(() => {
			nextAge = user.age + 1;
		});

		expect(nextAge).toBe(11);

		// update
		user.age++;
		expect(nextAge).toBe(12);
	});

	it("effect should return runner when call it", () => {
		// effect(fn) -> function(runner) -> fn -> return
		let foo = 10;
		const runner = effect(() => {
			foo++;
			return "foo";
		});

		expect(foo).toBe(11);

		const r = runner();
		expect(foo).toBe(12);
		expect(r).toBe("foo");
	});

	it("scheduler", () => {
		// 1. 通过 effect 的第二个参数给定一个 scheduler 的 fn
		// 2. effect 第一次执行的时候会调用 fn
		// 3. 如涉及到响完式的数据变化，不会执行 fn，而是把 fn 收集到 scheduler 中
		// 4. 如果执行 runner ，则执行 fn，将 fn 执行结果返回

		let dummy;
		let run: any;
		const scheduler = jest.fn(() => {
			run = runner;
		});

		const obj = reactive({ foo: 1 });
		const runner = effect(
			() => {
				dummy = obj.foo;
			},
			{ scheduler }
		);

		expect(scheduler).not.toHaveBeenCalled();
		expect(dummy).toBe(1);

		obj.foo++;
		expect(scheduler).toHaveBeenCalledTimes(1);
		expect(dummy).toBe(1);

		run();
		expect(dummy).toBe(2);
	});

	it("stop", () => {
		let dummy;
		const foo = reactive({ age: 18 });
		const runner = effect(() => {
			dummy = foo.age;
		});

		foo.age = 20;
		expect(dummy).toBe(20);
		stop(runner);

		foo.age = 30;
		expect(dummy).toBe(20);

		runner();
		expect(dummy).toBe(30);
	});

  it("onStop", () => {
    let dummy;
    const foo = reactive({ age: 18 });
    const onStop = jest.fn();
    const runner = effect(() => {
      dummy = foo.age;
    }, {
      onStop
    })

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  })
});
