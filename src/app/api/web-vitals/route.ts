import { NextRequest } from "next/server";
import { getVitalStore } from "@/lib/web-vitals/store";

//Node.js runtime 会在同一实例内共享模块作用域变量
// export const runtime = "nodejs";
export const runtime = 'edge';

export async function POST(req: NextRequest, ctx: any) {
  const body = await req.json();
  // 仅输出结构化 JSON 日志，由外部监控软件采集
  // 这种方式几乎不占用服务器 CPU 和数据库连接
  console.log(JSON.stringify({
    level: 'info',
    message: 'web-vitals',
    ...body,
    timestamp: new Date().toISOString()
  }));
  console.log('ctx:', Object.keys(ctx))
  const env = ctx.env;
  const store = getVitalStore(env)
  await store.push(body)
  return Response.json({ ok: true });
}
