import { p75 } from '@/lib/aggregate';
import { store } from '../web-vitals/store';
import { NextRequest } from 'next/server';

export const runtime = "nodejs";

const THRESHOLD = {
  LCP: 2500,
  INP: 200,
  CLS: 0.1,
};

export const GET = async (req: NextRequest) => {
  const grouped: Record<string, number[]> = {};
  // console.log("📊 Web 3333333:", store.length);
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