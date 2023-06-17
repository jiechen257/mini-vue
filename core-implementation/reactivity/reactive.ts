import { mutableHandler, readonlyHandler } from "./baseHandler";


function createActiveObject(raw: any, baseHnadler) {
  return new Proxy(raw, baseHnadler);
  
} 

export function reactive(raw) {
  return createActiveObject(raw, mutableHandler);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandler);
}