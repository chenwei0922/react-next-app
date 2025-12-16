import { NextRequest } from "next/server";
import { getVitalStore } from "@/lib/web-vitals/store";

//Node.js runtime 会在同一实例内共享模块作用域变量
// export const runtime = "nodejs";
export const runtime = 'edge';

export async function POST(req: NextRequest, env:any) {
  const body = await req.json();
  const store = getVitalStore(env)
  await store.push(body)
  return Response.json({ ok: true });
}
