import { useMemo, useRef } from "react";
import { ParticleSystemProps } from "./types";
import { useFrame } from "@react-three/fiber";
import { createTextTexture, getPositions } from "./utils";
import { AdditiveBlending, Points } from "three";

// --- 组件：单个字符粒子群 ---
export const CharacterParticles = ({ char, count, shape, color, radius }: ParticleSystemProps) => {
  const pointsRef = useRef<Points>(null); // 保存粒子群的引用

  const texture = useMemo(() => createTextTexture(char, color), [char, color]);
  
  // 目标位置
  const targetPositions = useMemo(() => getPositions(shape, count, radius), [shape, count, radius]);
  
  // 当前位置 (用于动画插值)
  const currentPositions = useMemo(() => new Float32Array(count * 3), [count]);

  // 类似 useRequestAnimateFrame， useFrame在每一帧都会执行
  useFrame(() => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const lerpFactor = 0.05; // 动画速度

    for (let i = 0; i < count * 3; i++) {
      // 核心动画算法：从当前位置平滑移动到目标位置
      positions[i] += (targetPositions[i] - positions[i]) * lerpFactor;
    }
    
    // 让整个粒子群缓慢旋转
    pointsRef.current.rotation.y += 0.002;
    pointsRef.current.rotation.z += 0.001;

    // 更新顶点位置
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6} // 粒子大小
        map={texture}
        transparent
        alphaTest={0.1}
        depthWrite={false}
        blending={AdditiveBlending} // 发光叠加模式
      />
    </points>
  );
};
