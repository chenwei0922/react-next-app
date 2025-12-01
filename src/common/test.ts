// 定义有效的 Map key 类型
type ValidMapKey = object | string | number | symbol;

export class CacheData<K extends ValidMapKey, V = unknown> {
  private readonly limit: number = 100;
  private readonly defaultTTL?: number; // 默认缓存时间（毫秒）
  private _data: Map<K, { value: V; expireAt?: number }>;
  
  get data() {
    return this._data;
  }
  
  constructor(limit: number = 100, defaultTTL?: number) {
    this.limit = limit;
    this.defaultTTL = defaultTTL;
    this._data = new Map<K, { value: V; expireAt?: number }>();
    
    // 启动过期检查（可选）
    this.startExpirationCheck();
    
    Object.seal(this);
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 缓存时间（毫秒），不传则使用默认值
   */
  set(key: K, value: V, ttl?: number): void {
    // 清理过期数据
    this.cleanupExpired();
    
    // 如果超过限制，则删除最旧的数据
    if (this.size >= this.limit) {
      const firstKey = this.findFirstUnexpiredKey();
      if (firstKey) {
        this.data.delete(firstKey);
      }
    }
    
    const expireAt = this.calculateExpireAt(ttl);
    this.data.set(key, { value, expireAt });
  }

  /**
   * 获取缓存值
   * @param key 缓存键
   * @returns 缓存值或 undefined
   */
  get(key: K): V | undefined {
    // 清理过期数据
    this.cleanupExpired();
    
    const item = this.data.get(key);
    
    // 如果不存在或已过期
    if (!item || this.isExpired(item)) {
      if (item) {
        this.data.delete(key); // 删除过期项
      }
      return undefined;
    }
    
    // 更新访问顺序（LRU 策略）
    this.updateAccessOrder(key, item);
    
    return item.value;
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: K): boolean {
    const item = this.data.get(key);
    if (!item || this.isExpired(item)) {
      if (item) {
        this.data.delete(key); // 删除过期项
      }
      return false;
    }
    return true;
  }

  /**
   * 删除缓存
   */
  delete(key: K): boolean {
    return this.data.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.data.clear();
  }

  /**
   * 获取缓存数量（不包含已过期的）
   */
  get size(): number {
    this.cleanupExpired();
    return this.data.size;
  }

  /**
   * 获取所有有效的缓存键
   */
  keys(): K[] {
    this.cleanupExpired();
    return Array.from(this.data.keys());
  }

  /**
   * 获取所有有效的缓存值
   */
  values(): V[] {
    this.cleanupExpired();
    return Array.from(this.data.values()).map(item => item.value);
  }

  /**
   * 获取所有有效的缓存条目
   */
  entries(): [K, V][] {
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

  /**
   * 更新缓存时间
   * @param key 缓存键
   * @param ttl 新的缓存时间（毫秒）
   * @returns 是否更新成功
   */
  updateTTL(key: K, ttl: number): boolean {
    const item = this.data.get(key);
    if (!item || this.isExpired(item)) {
      if (item) {
        this.data.delete(key);
      }
      return false;
    }
    
    item.expireAt = this.calculateExpireAt(ttl);
    return true;
  }

  /**
   * 清理所有过期缓存
   */
  cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.data.entries()) {
      if (item.expireAt && item.expireAt <= now) {
        this.data.delete(key);
      }
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { total: number; expired: number } {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const item of this.data.values()) {
      if (item.expireAt && item.expireAt <= now) {
        expiredCount++;
      }
    }
    
    return {
      total: this.data.size,
      expired: expiredCount
    };
  }

  // 私有方法
  private calculateExpireAt(ttl?: number): number | undefined {
    const actualTTL = ttl ?? this.defaultTTL;
    return actualTTL ? Date.now() + actualTTL : undefined;
  }

  private isExpired(item: { value: V; expireAt?: number }): boolean {
    return item.expireAt ? item.expireAt <= Date.now() : false;
  }

  private updateAccessOrder(key: K, item: { value: V; expireAt?: number }): void {
    this.data.delete(key);
    this.data.set(key, item);
  }

  private findFirstUnexpiredKey(): K | undefined {
    for (const [key, item] of this.data.entries()) {
      if (!this.isExpired(item)) {
        return key;
      }
    }
    return undefined;
  }

  private startExpirationCheck(interval: number = 60000): void {
    // 每分钟自动清理一次过期缓存
    setInterval(() => {
      this.cleanupExpired();
    }, interval);
  }
}