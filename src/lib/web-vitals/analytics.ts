
import { WebVitalItem, VitalStore } from './type';

export const analyticsStore = (env: any): VitalStore => ({
   async push(item: WebVitalItem) {
    env.web_vitals.writeDataPoint({
      blobs: [
        item.name,
        item.route,
      ],
      doubles: [
        item.value,
      ],
      indexes: [
        item.name,
      ],
    });

    console.log('📊 [EDGE] Web Vital Push:', item.route);
  },

  async list() {
    const res = await env.web_vitals.query({
      sql: `
        SELECT
          blobs[0] as name,
          blobs[1] as route,
          AVG(doubles[0]) as value,
          COUNT(*) as count
        FROM web_vitals
        WHERE timestamp > NOW() - INTERVAL '1 hour'
        GROUP BY name, route
      `,
    });

    return res.rows;
  },
});
