import { p75 } from '@/lib/aggregate';
import { NextRequest } from 'next/server';
import { getVitalStore } from '@/lib/web-vitals/store';

// export const runtime = "nodejs";
export const runtime = 'edge';

const THRESHOLD = {
  LCP: 2500,
  INP: 200,
  CLS: 0.1,
};

export const GET = async (req: NextRequest, {params}:any) => {
  const grouped: Record<string, number[]> = {};
  const env = await params.env;
  const _store = getVitalStore(env);
  const store = await _store.list()
  console.log("📊 Web Vitals Metrics:", store.length);
  for (const item of store) {
    const key = `${item.route}_${item.name}`;
    grouped[key] ??= [];
    grouped[key].push(item.value);
  }

  const result = Object.entries(grouped).map(
    ([key, values]) => {
      const [route, metric] = key.split("_");
      const metricP75 = p75(values);
      //告警逻辑
      if (metric === 'LCP' && metricP75 > THRESHOLD[metric]) {
        console.warn(
          "🔥 LCP 告警",
          "route:",
          route,
          "p75:",
          metricP75
        );
      }
      return {
        route,
        metric,
        p75: metricP75,
        count: values.length,
      };
    }
  );

  return Response.json(result);
}