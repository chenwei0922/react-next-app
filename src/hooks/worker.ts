type Methods = {
  sum(...args: [number, number]): number;
  add(...args: [string]): string;
};

const methods: Methods = {
  sum(a, b) {
    return a + b;
  },
  add(p) {
    return p + '!';
  }
};

type MethodName = keyof Methods;

type MethodParams<K extends MethodName> =
  Methods[K] extends (...args: infer P) => any ? P : never;

type MethodReturn<K extends MethodName> =
  Methods[K] extends (...args: any[]) => infer R ? R : never;

type WorkerRequest = {
  [K in MethodName]: {
    id: number;
    method: K;
    args: MethodParams<K>;
    // args: Parameters<Methods[K]>;
  }
}[MethodName];


self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, method, args } = e.data;
  try {
    const result = (methods[method])((args as MethodParams<typeof method>));
    self.postMessage({ id, result });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};

// const worker = new Worker('worker.ts');
// worker.onmessage = (e) => {
//   console.log(e.data);
// };
// worker.postMessage({ id: 1, method: 'sum', args: [100, 200] });
// worker.postMessage({ id: 2, method: 'add', args: ['hello'] });