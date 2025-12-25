import { Annotation } from "@langchain/langgraph"

//使用 Annotation 来定义状态图的Schema
export const AgentState = Annotation.Root({
  requirement: Annotation<string>, //用户最初的需求
  code: Annotation<string>, //当前生成的代码
  feedback: Annotation<string>, //reviewer的反馈意见
  iteration: Annotation<number>, //循环次数(防止死循环)
  status: Annotation<"idle" | "reviewing" | "approved" | "rejected">, //状态
})

// 2. 提取 TypeScript 类型 (关键步骤)
// 注意：必须使用 typeof AgentState.State
export type AgentStateType = typeof AgentState.State;
export type AgentStateStatus = AgentStateType["status"];
// export type AgentStateStatus = "idle" | "reviewing" | "approved" | "rejected"