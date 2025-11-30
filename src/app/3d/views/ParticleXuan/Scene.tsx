import { useMemo } from "react";
import { ShapeType } from "./types";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CharacterParticles } from "./CharacterParticles";
import { Color } from "three";
import { Canvas } from "@react-three/fiber";

// --- 主场景 ---
const Scene = ({
  text,
  shape,
  baseColor,
  density,
  bgColor,
}: {
  text: string;
  shape: ShapeType;
  baseColor: string;
  density: number;
  bgColor: string;
}) => {
  // 将输入字符串拆分为单个字符数组 (去重并清理空格)
  const chars = useMemo(() => {
    const arr = text.split("").filter((c) => c.trim() !== "");
    return arr.length > 0 ? arr : ["?"];
  }, [text]);

  // 根据总密度，分配给每个字符的粒子数量
  const countPerChar = Math.floor(density / chars.length);

  // 动态生成五彩斑斓的颜色
  const getDynamicColor = (index: number) => {
    const hsl = new Color(baseColor).getHSL({ h: 0, s: 0, l: 0 });
    // 基于基础色偏移色相，实现"五彩斑斓"但又统一的效果
    return new Color().setHSL((hsl.h + index * 0.2) % 1, 0.8, 0.6).getStyle();
  };

  return (
    <Canvas dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
      <ambientLight intensity={0.5} />

      <group>
        {chars.map((char, index) => (
          <CharacterParticles
            key={`${char}-${index}`}
            char={char}
            count={countPerChar}
            shape={shape}
            color={getDynamicColor(index)}
            radius={6}
          />
        ))}
      </group>
    </Canvas>
  );
};
export default Scene;
