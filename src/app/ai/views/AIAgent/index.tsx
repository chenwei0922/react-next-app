// src/app/page.tsx
"use client";

import { useState, useRef } from "react";
import CodePreview from "./CodePreview";
import { Loader2, Terminal, CheckCircle, XCircle } from "lucide-react";
import { Flex, TextField } from "@radix-ui/themes";

type Log = {
  source: "developer" | "reviewer";
  message: string;
  timestamp: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [status, setStatus] = useState<
    "idle" | "reviewing" | "approved" | "rejected"
  >("idle");

  const addLog = (source: "developer" | "reviewer", message: string) => {
    setLogs((prev) => [
      ...prev,
      { source, message, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setLogs([]);
    setStatus("idle");
    setCurrentCode("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // 处理可能存在的多个 JSON 对象连在一起的情况
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === "developer") {
              setCurrentCode(data.code);
              setStatus("reviewing");
              addLog(
                "developer",
                `Generated code (Iteration ${data.iteration})`
              );
            } else if (data.type === "reviewer") {
              setStatus(data.status);
              if (data.status === "approved") {
                addLog("reviewer", "✅ Code Approved!");
              } else {
                addLog(
                  "reviewer",
                  `❌ Rejected: ${data.feedback.slice(0, 50)}...`
                );
              }
            }
          } catch (e) {
            console.error("Parse error", e);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col gap-6">
      {/* 顶部输入栏 */}
      <header className="max-w-6xl mx-auto w-full flex gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your component (e.g., A crypto dashboard card with stats)"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Start Workflow"}
        </button>
      </header>

      {/* 主体内容区域 */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* 左侧：工作流日志 */}
        <div className="lg:col-span-1 bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4" />
            <span className="font-mono text-sm">Agent Workflow Logs</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-sm">
            {logs.length === 0 && (
              <div className="text-slate-600 italic">Waiting to start...</div>
            )}
            {logs.map((log, i) => (
              <div
                key={i}
                className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <span className="text-slate-600 text-xs shrink-0">
                  {log.timestamp}
                </span>
                <div>
                  <span
                    className={`font-bold text-xs uppercase px-1.5 py-0.5 rounded mr-2 ${
                      log.source === "developer"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-purple-900 text-purple-300"
                    }`}
                  >
                    {log.source}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              </div>
            ))}
            {loading && status === "reviewing" && (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin" /> Reviewing...
              </div>
            )}
          </div>

          {/* 状态指示器 */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-sm text-slate-400">Current Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                status === "approved"
                  ? "bg-green-900 text-green-400"
                  : status === "rejected"
                  ? "bg-red-900 text-red-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 右侧：代码预览与编辑器 */}
        <div className="lg:col-span-2 h-[600px]">
          <CodePreview code={currentCode} />
        </div>
      </div>
    </main>
  );
}
