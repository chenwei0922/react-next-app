import { useEffect, useRef, useState } from "react";
import { Activity, Cpu, Crosshair, Fingerprint, Globe } from "lucide-react";
import { THEME } from "./utils";

// --- 组件：HUD 界面层 ---
export const HUDLayer = ({
  systemData,
  handStatus,
}: {
  systemData: any;
  handStatus: any;
}) => {
  const [time, setTime] = useState<Date|null>(null);
  const [hexStream, setHexStream] = useState("");

  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // 在 useEffect 中调用不纯的函数
    // setScanProgress(Math.random() * 20 + 80);
    requestAnimationFrame(() => {
      setScanProgress(Math.random() * 20 + 80);
    })
  }, []);

  // 悬浮窗 Ref
  const panelRef = useRef<HTMLDivElement>(null);

  // 模拟十六进制数据流和时间
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const matrix = setInterval(() => {
      setHexStream(
        Array(8)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16777215).toString(16))
          .join(" ")
          .toUpperCase()
      );
    }, 100);
    return () => {
      clearInterval(timer);
      clearInterval(matrix);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (handStatus.current.rightHand.isPinching && panelRef.current) {
        // 将归一化坐标转换为屏幕像素
        const x = (1 - handStatus.current.rightHand.x) * window.innerWidth; // 镜像翻转
        const y = handStatus.current.rightHand.y * window.innerHeight;

        panelRef.current.style.transform = `translate(${x - 200}px, ${
          y - 100
        }px)`; // 居中偏移
        panelRef.current.style.border = "2px solid #fff"; // 激活状态高亮
      } else if (panelRef.current) {
        panelRef.current.style.border = `1px solid ${THEME.cyan}`;
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate); // 开始动画循环

    return () => {
      cancelAnimationFrame(animationFrameId); // 清除动画循环
    }
  }, [handStatus])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden font-mono text-cyan-400 select-none z-10">
      {/* 背景扫描线效果 */}
      <div
        className="absolute inset-0 z-[-1] opacity-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 2px, 3px 100%",
        }}
      ></div>

      {/* 顶部暗角与发光 */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,20,20,0.8) 100%)",
        }}
      ></div>

      {/* 左上角：系统状态 */}
      <div
        className="absolute top-8 left-8 p-4 border-l-4 border-cyan-400 bg-black/40 backdrop-blur-sm"
        style={{ boxShadow: THEME.boxGlow }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="animate-pulse" />
          <h2
            className="text-xl font-bold"
            style={{ textShadow: THEME.textGlow }}
          >
            系统核心 :: 在线
          </h2>
        </div>
        <div className="text-xs opacity-70 leading-relaxed max-w-[200px] break-all">
          {hexStream}
        </div>
        <div className="mt-2 h-1 w-full bg-gray-800">
          <div
            className="h-full bg-cyan-400 animate-pulse"
            style={{ width: "87%" }}
          ></div>
        </div>
      </div>

      {/* 右上角：J.A.R.V.I.S 标题 */}
      <div className="absolute top-8 right-8 text-right">
        <h1
          className="text-6xl font-black tracking-tighter"
          style={{ textShadow: THEME.textGlow }}
        >
          J.A.R.V.I.S
        </h1>
        <div className="text-2xl mt-1 flex items-center justify-end gap-3">
          {time && <span>{time.toLocaleTimeString()}</span>}
          <Activity className="animate-bounce text-red-500" />
        </div>
        <div className="text-sm opacity-60 mt-2">MK-85 战术界面 // 激活</div>
      </div>

      {/* 左下角：手势状态 */}
      <div className="absolute bottom-8 left-8 flex gap-6">
        <div
          className={`flex flex-col items-center p-3 border border-cyan-500/30 ${
            systemData.leftHandDetected ? "bg-cyan-900/40" : "opacity-30"
          }`}
        >
          <Fingerprint size={32} />
          <span className="text-xs mt-1">左手：地球控制</span>
          <span className="text-[10px] text-cyan-200">
            {systemData.leftGesture}
          </span>
        </div>
        <div
          className={`flex flex-col items-center p-3 border border-cyan-500/30 ${
            systemData.rightHandDetected ? "bg-cyan-900/40" : "opacity-30"
          }`}
        >
          <Crosshair size={32} />
          <span className="text-xs mt-1">右手：数据拖拽</span>
          <span className="text-[10px] text-cyan-200">
            {systemData.rightGesture}
          </span>
        </div>
      </div>

      {/* 右侧悬浮窗：情报分析面板 (可拖拽) */}
      {/* 注意：初始位置在 CSS transform 中，实际移动由 JS 控制 */}
      <div
        ref={panelRef}
        className="absolute w-64 bg-black/60 backdrop-blur-md p-4 flex flex-col gap-3 transition-colors duration-200"
        style={{
          top: 0,
          left: 0,
          transform: "translate(calc(100vw - 350px), calc(50vh - 100px))", // 初始位置
          boxShadow: THEME.boxGlow,
          border: `1px solid ${THEME.cyan}`,
        }}
      >
        <div className="flex justify-between items-center border-b border-cyan-500/50 pb-2">
          <span className="font-bold flex items-center gap-2">
            <Globe size={16} /> 地理情报
          </span>
          <span className="text-[10px] bg-cyan-500 text-black px-1">LIVE</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="opacity-70">目标区域:</span>
            <span className="font-bold text-white drop-shadow-md">
              {systemData.continent}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="opacity-70">扫描完成度:</span>
            <span className="text-cyan-200">
              {scanProgress.toFixed(1)}%
            </span>
          </div>

          {/* 模拟数据图表 */}
          <div className="flex gap-1 h-8 items-end mt-2 opacity-80">
            {[40, 70, 30, 80, 50, 90, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-500/50"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
