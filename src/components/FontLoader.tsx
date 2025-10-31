// components/FontLoader.jsx
'use client'; // 如果是 Next.js App Router

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const fontPath = `${basePath}/fonts/DS-DIGIT.TTF`;

    // 动态创建样式
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'DS-DIGIT';
        src: url('${fontPath}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}