"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/common/utils";
// import CicleChart from "./circle";

// 动态导入组件，禁用 SSR
const BarChart = dynamic(() => import("./bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("./line"), {
  ssr: false,
});
const CicleChart = dynamic(() => import("./circle"), {
  ssr: false,
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  const curenttime = useMemo(() => {
    return new Date().toLocaleString();
  }, []);

  // 确保在客户端执行
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading1...</div>;
  }

  return (
    <section
      className={cn(
        "w-screen min-h-screen",
        "bg-repeat bg-cover bg-center",
        "bg-[url(/images/bg.jpg)]"
      )}
    >
      <div
        className={cn(
          "h-[3.25rem] relative flex flex-row items-center justify-center",
          "bg-no-repeat bg-cover bg-center",
          "bg-[url(/images/head_bg.png)]"
        )}
      >
        <h1 className="text-xl">可视化展板-D3</h1>
        <span className="text-xs absolute right-10">
          当前时间：{curenttime}
        </span>
      </div>
      <div className="flex flex-row space-x-1 px-2">
        <BarChart  />
        <LineChart />
      </div>
      <div className="px-2 mt-2">
        <CicleChart />
      </div>      
    </section>
  );
}
