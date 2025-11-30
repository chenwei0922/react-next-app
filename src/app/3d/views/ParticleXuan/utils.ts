
import { ShapeType } from './types';
import { CanvasTexture } from 'three';

// --- 工具函数：创建字符纹理 ---
// 将文字绘制到 Canvas 上并转换为 Three.js 纹理
export const createTextTexture = (char: string, color: string, font: string = 'Bold 100px sans-serif') => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // 添加发光效果
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillText(char, 64, 64);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// --- 工具函数：计算形状坐标 ---
// 根据形状类型和数量，生成粒子的位置数据
export const getPositions = (type: ShapeType, count: number, radius: number) => {
  //这里为什么用float32Array呢，因为Three.js的顶点缓冲区需要的是Float32Array类型的数据
  const positions = new Float32Array(count * 3); // 3 个坐标值 (x, y, z)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x = 0, y = 0, z = 0;

    if (type === 'sphere') {
      const phi = Math.acos(-1 + (2 * i) / count); // 计算纬度
      const theta = Math.sqrt(count * Math.PI) * phi; // 计算经度
      x = radius * Math.cos(theta) * Math.sin(phi); // 计算球面上的 x 坐标
      y = radius * Math.sin(theta) * Math.sin(phi); // 计算球面上的 y 坐标
      z = radius * Math.cos(phi); // 计算球面上的 z 坐标
    }
    else if (type === 'cube') {
      const side = radius * 1.5; // 立方体的边长
      x = (Math.random() - 0.5) * side; // 在 -0.5 到 0.5 之间生成随机数
      y = (Math.random() - 0.5) * side; 
      z = (Math.random() - 0.5) * side;
    }
    else if (type === 'torus') {
      const u = Math.random() * Math.PI * 2; // 0 到 2π 之间的随机数
      const v = Math.random() * Math.PI * 2;
      const r = radius * 0.4; // Tube radius
      const R = radius * 0.8; // Ring radius
      x = (R + r * Math.cos(v)) * Math.cos(u); // 计算圆环面上的 x 坐标
      y = (R + r * Math.cos(v)) * Math.sin(u); // 计算圆环面上的 y 坐标
      z = r * Math.sin(v); // 计算圆环面上的 z 坐标
    }
    else if (type === 'helix') {
      const t = i / count * 20; // Turns 
      x = Math.cos(t) * radius * 0.5; // 计算螺旋面上的 x 坐标
      z = Math.sin(t) * radius * 0.5; // 计算螺旋面上的 z 坐标
      y = (i / count - 0.5) * radius * 3; // 计算螺旋面上的 y 坐标
    }

    // 添加一些随机抖动，让粒子看起来更自然
    positions[i3] = x + (Math.random() - 0.5) * 0.2; // x 坐标
    positions[i3 + 1] = y + (Math.random() - 0.5) * 0.2; // y 坐标
    positions[i3 + 2] = z + (Math.random() - 0.5) * 0.2; // z 坐标
  }
  return positions;
};