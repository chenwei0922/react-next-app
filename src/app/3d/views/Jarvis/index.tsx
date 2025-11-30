'use client'

import { HUDLayer } from "./HUDLayer";
import { useHandSkeleton } from "./useHandLandMarker";
import { Loading } from "../../components/Loading";
import dynamic from "next/dynamic";

const HologramEarth = dynamic(() => import("./HologramEarth"), { ssr: false, loading: () => <Loading /> });

// --- 主应用组件 ---
export default function JarvisView() {
  const {canvasRef, videoRef, loading, uiState, interactionState, setUiState} = useHandSkeleton()
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      {/* 0. 加载层 */}
      {/* {loading && <Loading />} */}

      {/* 1. 摄像头原底层 (隐藏或变暗处理) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125 grayscale-[0.3]"
        style={{ transform: "scaleX(-1)" }} // 镜像翻转
      />

      {/* 2. 3D 全息层 (Three.js) */}
      <div className="absolute inset-0 z-0">
        <HologramEarth
          interactionRef={interactionState}
          onUpdateStats={(continent) =>
            setUiState((prev) => ({ ...prev, continent }))
          }
        />
      </div>

      {/* 3. 2D 骨骼绘制层 (Canvas Overlay) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-1"
        style={{ transform: "scaleX(-1)" }} // 确保与视频同步镜像
      />

      {/* 4. UI 交互层 */}
      <HUDLayer systemData={uiState} handStatus={interactionState} />
    </div>
  );
}
