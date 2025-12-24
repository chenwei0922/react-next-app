import {ChatOpenAI} from '@langchain/openai'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // 导入 Google 包
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { AgentState } from './types'

//1.定义共享状态 state
//2.定义agent节点逻辑
//3.构建 langgraph图，定义节点间关系

// deepseek: agent -> sk-92df42ef107f428e88ab0e7d3e41f0af
// 初始化模型
const model = new ChatGoogleGenerativeAI({
  // deepseek: 'sk-92df42ef107f428e88ab0e7d3e41f0af',
  // google gemini: 'AIzaSyABzmxoKljb4DQWEWW4L6azP9zoJSjIcBw'
  apiKey: 'AIzaSyABzmxoKljb4DQWEWW4L6azP9zoJSjIcBw',
  model: 'gemini-2.5-flash',
  // modelName: "gemini-1.5-flash", //gpt-4o, deepseek-chat, gemini-1.5-flash
  temperature: 0, //控制生成文本的随机性，值越高越随机
  // maxTokens: 4000, //控制生成文本的长度，值越高越长
  // topP: 1, //控制生成文本的多样性，值越高越多样
  // frequencyPenalty: 0, //控制生成文本的重复性，值越高越重复
  // presencePenalty: 0, //控制生成文本的连贯性，值越高越连贯
  // stop: ["\n\n"], //控制生成文本的结束，值越高越结束
})

/**
 * 1. Developer Agent: 负责写代码或修复代码
 */
export const developerNode = async (state: typeof AgentState.State) => {
  const {requirement, code, feedback, iteration} = state
  console.log(`🚀 Developer is working... (Iteration: ${iteration})`);

  let prompt = ''
  if (iteration === 0) {
    //第一次生成
    prompt = `
      You are an expert React & Next.js developer.
      Task: Create a component based on this requirement: "${requirement}".
      Rules:
      1. Return ONLY the code. No markdown backticks, no explanations.
      2. Ensure it's a complete, functional component.
      3. Use Tailwind CSS for styling.
    `;
  }else{
    //修复模式
    prompt = `
      You are an expert React & Next.js developer.
      Your previous code was rejected. Fix it based on the feedback.
      
      Original Requirement: "${requirement}"
      Current Code: 
      ${code}
      
      Reviewer Feedback: 
      ${feedback}
      
      Rules:
      1. Return ONLY the fixed code. No markdown backticks.
    `;
  }

  const response = await model.invoke([new HumanMessage(prompt)]);
  // 清理可能存在的 markdown 符号
  const cleanCode = (response.content as string).replace(/```tsx|```jsx|```/g, "").trim();

  return {
    code: cleanCode,
    iteration: iteration + 1,
    status: "reviewing" as const
  }
}

/**
 * 2. Reviewer Agent: 负责审查代码
 * 使用 withStructuredOutput 强制输出 JSON，保证流程控制的稳定性
 */
export const reviewerNode = async (state: typeof AgentState.State) => {
  const { code } = state;
  console.log("🧐 Reviewer is checking...");

  // 定义 Reviewer 的输出结构
  const ReviewSchema = z.object({
    isApproved: z.boolean().describe("Whether the code meets the requirements and is bug-free"),
    feedback: z.string().describe("Specific instructions on what to fix if rejected, or 'Looks good' if approved"),
  });
  const structuredReviewer = model.withStructuredOutput(ReviewSchema);

  const prompt = `
    You are a Senior Tech Lead. Review the following React code.
    Check for:
    1. Syntax errors.
    2. Missing imports.
    3. Logic issues.
    
    Code:
    ${code}
  `;

  const result = await structuredReviewer.invoke([new HumanMessage(prompt)]);

  return {
    status: result.isApproved ? "approved" : "rejected",
    feedback: result.feedback,
  } as Partial<typeof AgentState.State>;
}

