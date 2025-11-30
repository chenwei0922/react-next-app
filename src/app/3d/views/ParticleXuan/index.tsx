"use client";

import {  useState } from "react";
import { ShapeType } from "./types";
import { UI } from "./UI";
import { Loading } from "../../components/Loading";
import { Color } from "three";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <Loading />,
});

// --- App 入口 ---
export default function App() {
  const [config, setConfig] = useState({
    text: "xuan",
    shape: "sphere" as ShapeType,
    density: 3000,
    particleColor: "#00ffff",
    bgColor: "#000000",
  });

  return (
    <div
      className="w-full h-screen relative transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: config.bgColor }}
    >
      <Scene
        text={config.text}
        shape={config.shape}
        baseColor={config.particleColor}
        density={config.density}
        bgColor={config.bgColor}
      />

      <UI config={config} setConfig={setConfig} />

      {/* 底部版权/提示 */}
      <div
        className={`absolute bottom-4 left-6 text-xs font-mono opacity-40 pointer-events-none ${
          new Color(config.bgColor).getHSL({ h: 0, s: 0, l: 0 }).l < 0.5
            ? "text-white"
            : "text-black"
        }`}
      >
        DRAG TO ROTATE • SCROLL TO ZOOM
      </div>
    </div>
  );
}
