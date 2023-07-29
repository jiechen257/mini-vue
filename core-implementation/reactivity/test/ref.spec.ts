import { ref } from '../effect'
import { effect } from '../effect'

describe('ref spec', () => { 
  it("happy path", () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  it("should be reactive", () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    // effect 中追踪的依赖发生更新，effect 执行一次
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })
  
  it("should make nested properties reactive", () => {
    const a = ref({
      count: 1
    })

    let dummy;
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })
 })