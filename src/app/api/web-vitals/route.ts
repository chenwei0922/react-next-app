import { NextRequest } from "next/server";
import {  pushStore, WebVitalItem } from "./store";

//Node.js runtime 会在同一实例内共享模块作用域变量
// export const runtime = "nodejs";
// export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body:WebVitalItem = await req.json();
  pushStore(body)
  return Response.json({ ok: true });
}
