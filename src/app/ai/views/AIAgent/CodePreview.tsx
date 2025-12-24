// src/components/CodePreview.tsx
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useState } from "react";

interface Props {
  code: string;
}

export default function CodePreview({ code }: Props) {
  // 如果代码为空，显示占位符
  const displayCode = code || `export default function App() {
  return (
    <div className="p-4 text-center text-gray-500">
      Waiting for code generation...
    </div>
  );
}`;

  return (
    <SandpackProvider
      template="react"
      theme="dark"
      files={{
        "/App.js": displayCode,
      }}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"], // 注入 Tailwind CDN
      }}
      customSetup={{
        dependencies: {
          "lucide-react": "latest", // 支持图标库
          "clsx": "latest",
          "tailwind-merge": "latest"
        },
      }}
    >
      <SandpackLayout className="rounded-xl overflow-hidden shadow-lg border border-slate-700">
        {/* 左侧代码编辑器 (只读) */}
        <div className="relative flex-1">
          <SandpackCodeEditor 
            readOnly 
            showReadOnly={false}
            showTabs
            style={{height: '500px'}}
          />
          <CopyButton />
        </div>
        {/* 右侧实时预览 */}
        <SandpackPreview 
          showOpenInCodeSandbox={false} 
          style={{height: '500px'}}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}

const CopyButton = () => {
  const {sandpack} = useSandpack()
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const code = sandpack.files["/App.js"]?.code || ''
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后恢复图标
    })
  }
  return (
    <button
      className="absolute! top-2! right-2! z-10 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400"
      onClick={handleCopy}
    >
      {copied ? 'Copied!': 'Copy'}
    </button>
  )
}


