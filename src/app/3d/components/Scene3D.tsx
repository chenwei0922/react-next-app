// components/Scene3D.jsx
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, useHelper, useTexture, Environment, useCubeTexture } from "@react-three/drei";
// 临时添加辅助工具查看光源位置
import { useMemo, useRef } from "react";
import {
  BoxGeometry,
  BoxHelper,
  DirectionalLight,
  Mesh,
  PointLight,
  PointLightHelper,
  SpotLight,
} from "three";
import { getAssetUrl } from "@/common/utils";
import { CirCleMesh, SceneContent } from "./common";

/**
 * position={[x, y, z]}  // 光源在3d空间中的位置 
 * intensity={0.5}      // 光源强度，默认1
 * color="white"      // 光源颜色，默认白色
 * distance={0}       // 光源影响范围，默认0表示无限远
 * decay={2}         // 光源衰减，默认2
 * angle={Math.PI / 3} // 聚光灯的锥角，默认 Math.PI / 3
 * 
 * 光源分类：
 * <ambientLight intensity={0.5} />  //光源:环境光，无方向，无阴影
 * <pointLight position={[10, 10, 10]} /> //光源:点光源，类似灯泡，有位置，可投射阴影
 * <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /> //平行光，类似太阳光
 * <spotLight position={[0, 10, 0]} angle={0.3} intensity={1} penumbra={0.5} castShadow /> //聚光灯，类似舞台聚光灯，圆锥形光照区域
 * 
 * 光源配方：
 * 1. 柔和室内光
  <ambientLight intensity={0.4} />
  <pointLight position={[5, 5, 5]} intensity={0.6} />
 * 2. 明亮的室外光
  <ambientLight intensity={0.8} />
  <directionalLight position={[10, 10, 5]} intensity={0.5} />
 * 3.戏剧性照明
  <ambientLight intensity={0.2} />
  <spotLight position={[0, 10, 0]} intensity={1} />
 */

export default function Scene3D() {
  // const directionalLightRef = useRef<DirectionalLight>(null);
  // const spotLightRef = useRef<SpotLight>(null);
  const lightRef = useRef<PointLight>(null);

  // 在开发时显示光源辅助线
  // useHelper(lightRef as any, PointLightHelper, 1, "red");

  return (
    <Canvas>
      {/* <SceneContent /> */}
      <ambientLight intensity={0.5} />
      <pointLight ref={lightRef} position={[10, 10, 10]} />

      <CirCleMesh />

      {/* 轨道控制器: 允许用户用鼠标旋转相机查看场景 */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} rotateSpeed={-0.25} enableDamping/>
    </Canvas>
  );
}
