// "use client";
// import dynamic from "next/dynamic";

import { cn, getAssetUrl } from "@/common/utils";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo } from "react";
// import BarChart from "./component/bar";
// import LineChart from "./component/line";
// import CicleChart from "./component/circle";

// 动态导入组件，禁用 SSR
const BarChart = dynamic(() => import("./component/bar"), {
  ssr: false,
});

const LineChart = dynamic(() => import("./component/line"), {
  ssr: false,
});

const CicleChart = dynamic(() => import("./component/circle"), {
  ssr: false,
});

export default function Home() {
  const curenttime = useMemo(() => {
    return new Date().toLocaleString();
  }, []);
  return (
    <section
      className={cn(
        "w-screen min-h-screen",
        "bg-repeat bg-cover bg-center",
        // "bg-[url(/images/bg.jpg)]"
      )}
      style={{backgroundImage: `url(${getAssetUrl("/images/bg.jpg")})`}}
    >
      {/* <Image src={getAssetUrl("/images/bg.jpg")} alt="" width={100} height={50} priority /> */}
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
        <BarChart />
        <LineChart />
      </div>
      <div className="px-2 mt-2">
        <CicleChart />
      </div>
    </section>
  );
}
