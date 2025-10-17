'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
// import Scene3D from './components/Scene3D';

// 使用动态导入，并禁用服务端渲染
const Scene3D = dynamic(() => import('./components/Scene3D'), {
  ssr: false,
});

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* 为3D组件加载提供回退UI */}
      <Suspense fallback={<div>Loading 3D Scene...</div>}>
        <Scene3D />
      </Suspense>
    </div>
  );
}