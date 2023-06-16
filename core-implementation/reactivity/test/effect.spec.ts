import { effect } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // update
    user.age++;
    expect(nextAge).toBe(12);
  })

  it('effect should return runner when call it', () => {
    // effect 返回一个 runner function，这个 function 返回值是 fn 的返回值
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return 'foo';
    })

    expect(foo).toBe(11);
    
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe('foo');
  })
})