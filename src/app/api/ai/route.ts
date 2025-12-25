/**
 * 创建api路由，运行langgraph图，并将事件流转换为前端可读的数据流
 */
import { graph } from "@/app/ai/views/AIAgent/graph";
import { AgentStateStatus } from "@/app/ai/views/AIAgent/types";
import { NextResponse } from "next/server";

export const runtime = "edge" // 运行在edge环境，以获得更低延迟
// export const dynamic = 'force-dynamic'; // 强制使用动态导入,强制它不进行静态分析：

export async function POST(request: Request) {
  const { prompt } = await request.json();

  //创建一个ReadableStream，用于向前端推送数据
  const stream = new ReadableStream({
    async start(controller) {
      const inputs = {
        requirement:prompt,
        code: "",
        feedback: "",
        iteration: 0,
        status: "idle" as AgentStateStatus,
      }
      const encoder = new TextEncoder();
      try {
        //使用streamMode：updates 获取每个节点的更新
        const eventStream = await graph.stream(inputs, { streamMode: "updates" });
        for await (const event of eventStream) { //遍历事件流
          if(event.developer){
            //1.如果是developer节点的更新
            const data = JSON.stringify({type: 'developer', code: event.developer?.code, iteration: event.developer?.iteration});
            controller.enqueue(encoder.encode(data + '\n')); //将数据推送到前端
          } else if(event.reviewer){
            //2.如果是 Reviewer 节点的更新
            const data = JSON.stringify({type: 'reviewer', feedback: event.reviewer?.feedback, status: event.reviewer.status});
            controller.enqueue(encoder.encode(data + '\n')); //将数据推送到前端
          }
        }
      }catch (error) {
        console.error(error);
        const errorData = JSON.stringify({type: 'error', message: 'Stream failed'});
        controller.enqueue(encoder.encode(errorData + '\n')); //将错误信息推送到前端
      }finally {
        controller.close(); //关闭数据流
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}