// 计算两点间的距离
export const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// 根据经度计算所在大洲
export const getContinent = (rotationY: number): string => {
  // 将旋转角度归一化到 0 - 2PI
  const normalized = (rotationY % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  const deg = (normalized * 180) / Math.PI;
  
  // 简化的经度映射逻辑
  if (deg > 30 && deg <= 100) return "大西洋 / 非洲";
  if (deg > 100 && deg <= 190) return "美洲大陆";
  if (deg > 190 && deg <= 280) return "太平洋";
  if (deg > 280 && deg <= 340) return "亚洲 / 澳洲";
  return "欧洲 / 中东";
};

// --- 全局样式常量 (Tailwind 配合行内样式模拟) ---
export const THEME = {
  cyan: '#00FFFF',
  bg: 'rgba(0, 20, 20, 0.8)',
  textGlow: '0 0 10px #00FFFF, 0 0 20px #00FFFF',
  boxGlow: '0 0 10px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1)',
};