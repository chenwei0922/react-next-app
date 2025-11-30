import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { RefObject, useRef } from "react";
import { Sphere } from "@react-three/drei";
import { getContinent, THEME } from "./utils";
import { InteractionStateType } from "./types";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  TextureLoader,
  Vector3,
} from "three";
import { getAssetUrl } from "@/common/utils";

// --- 组件：3D 全息地球 ---
const HologramEarth1 = ({
  interactionRef,
  onUpdateStats,
}: {
  interactionRef: RefObject<InteractionStateType>;
  onUpdateStats: (data: string) => void;
}) => {
  const earthRef = useRef<Group>(null); // 地球组
  const texture = useLoader(
    TextureLoader,
    getAssetUrl("/images/3d/earth_atmos_2048.jpg") // 地球纹理
  );

  // useFrame: 每一帧渲染前执行代码，用于动画和交互逻辑
  useFrame(() => {
    if (!earthRef.current) return;

    // 基础自转
    earthRef.current.rotation.y += 0.001;

    // 获取交互状态
    const state = interactionRef.current;

    // 左手控制逻辑
    if (state.leftHand.detected) {
      // 旋转控制
      const deltaX = (state.leftHand.x - 0.5) * 0.1;
      const deltaY = (state.leftHand.y - 0.5) * 0.1;
      earthRef.current.rotation.y += deltaX;
      earthRef.current.rotation.x += deltaY;

      // 缩放控制 (基于捏合距离)
      if (state.leftHand.isPinching) {
        const targetScale = 1 + state.leftHand.pinchDistance * 5;
        // 平滑插值
        earthRef.current.scale.lerp(
          new Vector3(targetScale, targetScale, targetScale),
          0.1
        );
      }
    } else {
      // 复位缩放
      earthRef.current.scale.lerp(new Vector3(1, 1, 1), 0.05);
    }

    // 回调大洲信息
    onUpdateStats(getContinent(earthRef.current.rotation.y));
  });

  return (
    <group ref={earthRef} position={[0, 0, 0]}>
      {/* 核心球体 */}
      <Sphere args={[1.2, 64, 64]}>
        <meshPhongMaterial
          map={texture}
          color={THEME.cyan}
          emissive={new Color("#004444")}
          transparent
          opacity={0.8}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      </Sphere>

      {/* 线框外壳 */}
      <Sphere args={[1.25, 32, 32]}>
        <meshBasicMaterial
          color={THEME.cyan}
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* 动态光环 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.45, 64]} />
        <meshBasicMaterial
          color={THEME.cyan}
          side={DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

const HologramEarth = (props:{
  interactionRef: RefObject<InteractionStateType>;
  onUpdateStats: (data: string) => void;
}) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={THEME.cyan} />
      <HologramEarth1 {...props}/>
    </Canvas>
  );
};

export default HologramEarth;
