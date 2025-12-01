type ValidMapKey = object | string | number | boolean

/**
 * 以下操作都会清理过期缓存：set,get,size,keys,values,entries
 */
export class CacheData<K extends ValidMapKey, V = unknown> {
  private readonly limit: number = 100;
  private readonly defaultTTL?: number; // 默认缓存时间（毫秒） 
  private _data: Map<K, {value: V, expireAt?: number}>;
  get data() {
    return this._data;
  }
  constructor(limit: number = 100, defaultTTL?: number) {
    this.limit = limit;
    this.defaultTTL = defaultTTL;
    this._data = new Map<K, {value: V, expireAt?: number}>();

    //启动过期检查
    // this.startExpirationCheck(); //可选

    //密封对象，防止添加新的属性
    Object.seal(this);
  }
  private startExpirationCheck(interval: number = 60000): void {
    // 每分钟自动清理一次过期缓存
    setInterval(() => {
      this.cleanupExpired();
    }, interval);
  }

  //清理过期缓存
  cleanupExpired() {
    const now = Date.now();
    for (const [key, item] of this.data.entries()) {
      if (item.expireAt && item.expireAt <= now) {
        this.data.delete(key);
      }
    }
  }
  //计算过期时间
  private calculateExpireAt(ttl?: number): number | undefined {
    const actualTTL = ttl ?? this.defaultTTL;
    return actualTTL ? Date.now() + actualTTL : undefined;
  }
  //判断是否过期
  private isExpired(item: {value: V, expireAt?: number}) {
    return item.expireAt ? item.expireAt <= Date.now() : false;
  }
  //更新访问顺序
  private updateAccessOrder(key: K, item: { value: V; expireAt?: number }): void {
    this.data.delete(key);
    this.data.set(key, item);
  }
  
  private findItem(key: K) {
    const item = this.data.get(key);
    //如果不存在，则返回undefined
    if (!item || this.isExpired(item)) {
      if(item){
        this.data.delete(key);
      }
      return undefined;
    }
    return item
  }

  //设置缓存
  set(key: K, value: V, ttl?:number) {
    //清理过期数据
    this.cleanupExpired();

    //如果超过限制，则删除最旧的数据
    if (this.size >= this.limit) {
      const firstKey = this.data.keys().next().value;
      if(firstKey){
        this.data.delete(firstKey);
      }
    }
    const expireAt = this.calculateExpireAt(ttl);
    this.data.set(key, {value, expireAt});
  }
  //获取缓存
  get(key: K): V | undefined {
    this.cleanupExpired();

    const item = this.findItem(key)
    if(!item){
      return undefined
    }
    //存在的话，则返回数据，并更新数据顺序
    this.updateAccessOrder(key, item);
    return item.value;
  }
  has(key: K) {
    const item = this.findItem(key)
    return !!item;
  }
  delete(key: K) {
    return this.data.delete(key);
  }
  clear() {
    this.data.clear();
  }
  get size() {
    this.cleanupExpired();
    return this.data.size;
  }
  keys() {
    this.cleanupExpired();
    return this.data.keys();
  }
  values() {
    this.cleanupExpired();
    return Array.from(this.data.values()).map(item => item.value);
  }
  entries():[K, V][] {
    this.cleanupExpired();
    return Array.from(this.data.entries()).map(([key, item]) => [key, item.value]);
  }

  /**
   * 获取缓存剩余时间
   * @param key 缓存键
   * @returns 剩余时间（毫秒），-1 表示永久，-2 表示不存在或已过期
   */
  getTTL(key: K): number {
    const item = this.data.get(key);
    if (!item || !item.expireAt) {
      return item ? -1 : -2; // -1: 永久, -2: 不存在
    }
    
    if (this.isExpired(item)) {
      this.data.delete(key);
      return -2;
    }
    
    return item.expireAt - Date.now();
  }
}

// new CacheData().set('a', 1);
// new CacheData().set(1, 2);
// new CacheData().set(true, 3);
// new CacheData().set({a: 1}, 4);
// interface IKey {
//   a: number
// }
// new CacheData<IKey>().set({a: 1}, 4);