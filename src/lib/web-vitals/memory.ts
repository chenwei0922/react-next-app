import { VitalStore, WebVitalItem } from "./type";

const store: WebVitalItem[] = []
const MAX_STORE_SIZE = 500
const WINDOW_MS = 60 * 60 * 1000; // 1 小时

export const memoryStore:VitalStore = {
  async push(item) {
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
  },
  async list(){
    return store;
  }
}


