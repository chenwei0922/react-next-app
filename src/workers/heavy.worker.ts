
//只负责具体的计算
const methods = {
  sum({a,b}: {a:number, b: number}) {
    // console.log('worker sum', a, b);
    return a + b;
  },
  add({p}: {p: string}) {
    return p + '!';
  }
};

export type Methods = typeof methods;

export type MethodName = keyof Methods;

export type MethodParams<K extends MethodName> =
  Methods[K] extends (...args: infer P) => any ? P : never;

export type MethodReturn<K extends MethodName> =
  Methods[K] extends (...args: any[]) => infer R ? R : never;

type WorkerRequest<M extends keyof Methods = keyof Methods> = {
  id: number;
  method: M;
  // args: MethodParams<M>[0];
  args: Parameters<Methods[M]>[0];
};

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, method, args } = e.data;
  // console.log('worker', id, method, args);
  try {
    const result = (methods[method])(args as MethodParams<typeof method>[0]);
    // console.log('worker result', result);
    self.postMessage({ id, result });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};
