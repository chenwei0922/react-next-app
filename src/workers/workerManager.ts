import { Methods } from "./heavy.worker";

type Resolver = (value: any) => void;

let worker: Worker | null = null;
let id = 0;
const callbacks = new Map<number, Resolver>();

const getWorker = () => {
  if (!worker && typeof window !== 'undefined') {
    worker= new Worker(new URL('./heavy.worker.ts', import.meta.url), {type: 'module'});
    worker.onmessage = (event) => {
      // console.log('Message received from worker', event.data);
      const { id, result } = event.data;
      callbacks.get(id)?.(result);
      callbacks.delete(id);
    }
  }
  // console.log('worker', worker);
  return worker;
}

export const callWorker = <M extends keyof Methods>(method: M, args: Parameters<Methods[M]>[0]): Promise<ReturnType<Methods[M]>> => {
  return new Promise((resolve) => {
    const wid = id++
    getWorker()?.postMessage({id: wid, method, args});
    callbacks.set(wid, resolve);
  })
}
//  callWorker('sum', { a: 1, b: 2}).then((result) => console.log(result))
//  callWorker('add', {p: 'd'}).then((result) => console.log(result))