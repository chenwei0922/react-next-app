import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./types";
import { developerNode, reviewerNode } from "./agents";


//判断逻辑：继续循环 还是 结束
const shouldContinue = (state: typeof AgentState.State) => {
  const { status, iteration } = state;

  const MAX_ITERATIONS = 3; // 防止无限烧钱
  if (status === "approved") {
    return END;
  }
  if (iteration >= MAX_ITERATIONS) {
    console.log("⚠️ Max iterations reached. Stopping to save tokens.");
    return END; //强制结束，防止死循环耗尽token
  }
  return "developer"; //驳回，回到developer
}

//构建图
const workflow = new StateGraph(AgentState)
.addNode("developer", developerNode)
.addNode('reviewer', reviewerNode)
.addEdge("developer", "reviewer") //developer -> reviewer
.addConditionalEdges("reviewer", shouldContinue, {
  developer: "developer", //如果被拒绝，回到developer
  [END]: END, //如果通过或超时，结束
})
//设置入口点
workflow.setEntryPoint("developer");
export const graph = workflow.compile()