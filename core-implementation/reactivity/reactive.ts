import { mutableHandler, readonlyHandler, shallowReadonlyHandler } from "./baseHandler";

export const ReactiveFlags = {
  IS_REACTIVE: '__v_isReactive',
  IS_READONLY: '__v_isReadonly'
}

function createActiveObject(raw: any, baseHnadler) {
  return new Proxy(raw, baseHnadler);
  
} 

export function reactive(raw) {
  return createActiveObject(raw, mutableHandler);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandler);
}

export function shallowReadonly(raw){
  return createActiveObject(raw, shallowReadonlyHandler)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
} 

export function isProxy(raw) {
	return isReactive(raw) || isReadonly(raw)
}