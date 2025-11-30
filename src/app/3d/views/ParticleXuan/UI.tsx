import { Settings2, Type, Box, Circle, Database, Palette } from "lucide-react";
import React from "react";
import { Color } from "three";

// --- UI 组件 ---
export const UI = ({
  config,
  setConfig,
}: {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}) => {
  //hsl()解析各参数含义？hsl(色相(0-360), 饱和度%, 亮度%)
  // 根据背景色计算 UI 文字颜色 (简单的亮度判断)
  const isDarkBg =
    new Color(config.bgColor).getHSL({ h: 0, s: 0, l: 0 }).l < 0.5;
  const uiColor = isDarkBg ? "text-white" : "text-gray-900";
  const borderColor = isDarkBg ? "border-white/20" : "border-black/20";

  return (
    <div
      className={`absolute top-0 right-0 p-6 w-80 max-h-screen overflow-y-auto ${uiColor}`}
    >
      <div
        className={`backdrop-blur-xl bg-opacity-10 bg-gray-500 rounded-2xl p-6 border ${borderColor} shadow-2xl transition-all duration-300`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Settings2 className="w-5 h-5" />
          <h1 className="font-bold text-xl tracking-wider">XUAN // ENGINE</h1>
        </div>

        {/* 1. 形状控制 */}
        <div className="mb-6">
          <label className="text-xs font-bold opacity-60 uppercase mb-2 block">
            Stereo Model
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "sphere", icon: Circle },
              { id: "cube", icon: Box },
              { id: "torus", icon: Database }, // 近似图标
              { id: "helix", icon: Type }, // 近似图标
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setConfig({ ...config, shape: item.id })}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  config.shape === item.id
                    ? `bg-[${config.particleColor}] text-black scale-110 shadow-lg ring-2 ring-offset-2 ring-offset-transparent`
                    : "bg-white/10 hover:bg-white/20"
                }`}
                style={{
                  backgroundColor:
                    config.shape === item.id ? config.particleColor : "",
                }}
              >
                <item.icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* 2. 文字输入 */}
        <div className="mb-6">
          <label className="text-xs font-bold opacity-60 uppercase mb-2 block flex items-center gap-2">
            <Type size={14} /> Particles Content
          </label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => setConfig({ ...config, text: e.target.value })}
            className={`w-full bg-black/20 border ${borderColor} rounded-lg px-3 py-2 outline-none focus:ring-2 ring-cyan-400/50 transition-all font-mono`}
            placeholder="输入文字..."
          />
        </div>

        {/* 3. 密度控制 */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold opacity-60 uppercase">
              Density
            </label>
            <span className="text-xs font-mono opacity-80">
              {config.density} pts
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={config.density}
            onChange={(e) =>
              setConfig({ ...config, density: parseInt(e.target.value) })
            }
            className="w-full h-1 bg-black/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* 4. 颜色控制 */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold opacity-60 uppercase mb-2 block flex items-center gap-2">
              <Palette size={14} /> Base Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.particleColor}
                onChange={(e) =>
                  setConfig({ ...config, particleColor: e.target.value })
                }
                className="w-8 h-8 rounded cursor-pointer border-none"
              />
              <span className="text-xs font-mono self-center opacity-70">
                {config.particleColor}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold opacity-60 uppercase mb-2 block">
              Background
            </label>
            <div className="flex gap-2 flex-wrap">
              {["#000000", "#1a1a2e", "#ffffff", "#222831", "#4b0082"].map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => setConfig({ ...config, bgColor: c })}
                    className={`w-6 h-6 rounded-full border border-gray-500/30 transition-transform hover:scale-125 ${
                      config.bgColor === c ? "ring-2 ring-white" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
