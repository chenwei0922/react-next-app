"use server";

import { graph } from "./graph";
import { AgentStateStatus } from "./types";

export async function generateComponent(requirement: string) {
  try {
    // 初始化状态
    const initialState = {
      requirement,
      code: "",
      feedback: "",
      iteration: 0,
      status: "idle" as AgentStateStatus,
    };

    // 运行图
    // invoke 会运行直到图结束，并返回最终状态
    //一次性返回，如果需要流式返回，使用/api/ai
    const finalState = await graph.invoke(initialState);

    return {
      success: true,
      code: finalState.code,
      iterations: finalState.iteration,
      status: finalState.status,
      lastFeedback: finalState.feedback
    };
  } catch (error) {
    console.error("Agent Error:", error);
    return { success: false, error: "Failed to generate code." };
  }
}

/**
 * langchain/langgraph开发
 * @codesandbox/sandpack-react 代码执行容器，实时渲染LLM生成的React代码
 * @langchain/core
 * @langchain/google-genai gemini模型
 * @langchain/langgraph
 * @langchain/openai  openai模型
 * zod 专门为ts设计的schema(模式)声明和验证库，传统开发，ts只能在编译时提供类型检查，zod可在运行时提供类型检查
 * const UserSchema = z.object({
    id: z.number(),
    name: z.string().min(3),
    email: z.string().email(),
  })
 * type User = z.infer<typeof UserSchema>
 * type UserName = z.infer<typeof UserSchema["name"]>
 * const user: User = { id: 1, name: "John", email: "john@example.com" }
 * //运行时校验
 * const user = UserSchema.parse({ id: 1, name: "John", email: "john@example.com" })
 */