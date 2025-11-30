/**
 * mesh: 三维网格对象，是Three.js中用于表示三维几何体的基本构建块。它由几何体（geometry）(物体的形状)和材质（material）(物体的外观(颜色，纹理等))组成。
 * boxGeometry: 表示一个立方体或长方体。它接受三个参数，分别是宽度、高度和深度。
 * meshStandardMaterial:标准材质。 一种基于物理的材质，能够模拟现实世界中的光照效果。它支持金属度（metalness）和粗糙度（roughness）等属性，使得材质看起来更加真实。
 *
 */

import { getAssetUrl } from "@/common/utils";
import {
  Environment,
  useCubeTexture,
  useHelper,
  useTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BackSide, BoxGeometry, BoxHelper, Mesh, Vector3 } from "three";

interface MeshBoxProps {
  color?: string;
  position?: { x: number; y: number; z: number };
}

{/* <CubeMesh color="orange" position={{ x: 2, y: 1.6, z: -2 }} /> */}
export const CubeMesh = ({ color = "orange", position }: MeshBoxProps) => {
  const meshRef = useRef<Mesh | null>(null);

  // useFrame((state, delta) => {
  //   // 每一帧旋转立方体
  //   if (!meshRef.current) return;
  //   meshRef.current.rotation.x += delta;
  //   meshRef.current.rotation.y += delta * 0.5;
  // });

  // 显示边界框辅助工具
  useHelper(meshRef as any, BoxHelper, "cyan");

  //立方体
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1), []);

  // convert plain position object to a three.js Vector3 to satisfy @react-three/fiber types
  const posVec = useMemo(
    () => position ? new Vector3(position.x, position.y, position.z) : undefined,
    [position]
  );

  return (
    <mesh ref={meshRef} position={posVec}>
      <primitive object={geometry} />
      {/* <boxGeometry args={[1, 1, 1]} /> */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// <CirCleMesh />
export const CirCleMesh = () => {
  const meshRef = useRef<Mesh | null>(null);
  const [texture, texture2] = useTexture([
    getAssetUrl("/images/3d/kandao3.jpg"), 
    getAssetUrl("/images/3d/kandao3_depthmap.jpg")
  ]);
 
  
  return (
    <mesh ref={meshRef} >
      <sphereGeometry args={[6, 64, 64]} />
      <meshStandardMaterial side={BackSide} map={texture} displacementMap={texture2} displacementScale={0.1}/>
    </mesh>
  );
}

// <SceneContent />
export const SceneContent = () => {
  const path = useMemo(() => (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/images/3d/', []);

  const envMap = useCubeTexture(
    ['grid-1024.png', 'grid-1024.png', 'grid-1024.png', 'grid-1024.png', 'grid-1024.png', 'grid-1024.png'],
    { path: path }
  )

  const { camera } = useThree()
  
  useEffect(() => {
    // 配置相机参数
    camera.position.set(0, 1.6, 0)
    
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
  }, [camera])
  
  return (
    <>
    {/* 天蓝色背景 */}
      {/* <color attach="background" args={["#87CEEB"]} />  */}
      {/* 天空盒背景 */}
      <Environment map={envMap} background />
      {/* <Environment preset="night" background blur={0.5} /> */}
      {/* <Environment map={envMap} background/> */}
    </>
  );
};
