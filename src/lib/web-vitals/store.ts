import { VitalStore } from './type';
import { memoryStore } from './memory';
import { analyticsStore } from './analytics';

export function getVitalStore(env?: { ANALYTICS?: unknown }): VitalStore {
  // Cloudflare Edge
  if (env?.ANALYTICS) {
    return analyticsStore(env);
  }

  // 本地 / Node
  return memoryStore;
}
