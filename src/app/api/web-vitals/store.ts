export type WebVitalItem = {
  id: string;
  name: string;      // LCP / INP / CLS
  value: number;
  rating: string;
  timestamp: number;
  route: string;
  ua: string
};

// ⚠️ 注意：这是 Node.js 进程内共享内存
export const store: WebVitalItem[] = [];

export const pushStore = (item: WebVitalItem) => {
  store.push(item);
  //清理过期数据
  if(store.length > MAX_STORE_SIZE) {
    store.shift()
  }
  const now = Date.now();
  const filtered =store.filter((item) => item.timestamp >= now - WINDOW_MS);
  store.length = 0
  store.push(...filtered);
  console.log("📊 Web Vital Push:", store.length, item.route);
}

export const MAX_STORE_SIZE = 500
export const WINDOW_MS = 60 * 60 * 1000; // 1 小时
