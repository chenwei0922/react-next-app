import { VitalStore } from './type';
import { memoryStore } from './memory';
import { analyticsStore } from './analytics';

export function getVitalStore(env?: { web_vitals?: unknown }): VitalStore {
  // Cloudflare Edge
  if (env?.web_vitals) {
    console.log('Using Cloudflare Edge analytics');
    return analyticsStore(env);
  }

  // 本地 / Node
  console.log('Using memory store');
  return memoryStore;
}
