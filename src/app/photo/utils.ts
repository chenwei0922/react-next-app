const hex2rgba = (hex:string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b, 255]
}
const diff = (color1:number[], color2:number[]) => {
  return Math.abs(color1[0] - color2[0]) + Math.abs(color1[1] - color2[1]) + Math.abs(color1[2] - color2[2])
}
export const point2Index = (x:number, y:number, canvas:HTMLCanvasElement) => {
  return (y * canvas.width + x) * 4
}

export const changeColor1 = (x:number, y:number, colors:ImageDataArray, clickColor:number[], canvas:HTMLCanvasElement, inputColor:string) => {
  if(x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return

  const i = point2Index(x,y, canvas) // 获取像素点索引
  const currentColor= [colors[i], colors[i+1], colors[i+2], colors[i+3]] // 获取当前颜色
  if(diff(currentColor, clickColor) > 50){
    return
  }

  const targetColor = hex2rgba(inputColor || '#000000') // 获取目标颜色
  if(diff(currentColor, targetColor) == 0) return // 如果当前颜色和目标颜色相同，则不进行任何操作

  colors.set(targetColor, i)
  //tip：递归会栈溢出，使用循环写
  changeColor(x-1, y, colors, clickColor, canvas, inputColor)
  changeColor(x+1, y, colors, clickColor, canvas, inputColor)
  changeColor(x, y-1, colors, clickColor, canvas, inputColor)
  changeColor(x, y+1, colors, clickColor, canvas, inputColor)
}
export const changeColor = (x: number, y: number, colors: ImageDataArray, clickColor: number[], canvas: HTMLCanvasElement, inputColor: string) => {
  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

  const targetColor = hex2rgba(inputColor || '#000000');
  const startIndex = point2Index(x, y, canvas);
  const startColor = [colors[startIndex], colors[startIndex + 1], colors[startIndex + 2], colors[startIndex + 3]];
  
  // 如果起始颜色和目标颜色相同，或者与点击颜色差异过大，直接返回
  if (diff(startColor, clickColor) > 50 || diff(startColor, targetColor) === 0) {
    return;
  }

  // 使用队列进行广度优先搜索
  const queue: [number, number][] = [[x, y]];
  const visited = new Set<number>();
  
  while (queue.length > 0) {
    const [currentX, currentY] = queue.shift()!;
    const currentIndex = point2Index(currentX, currentY, canvas);
    
    // 如果已经访问过，跳过
    if (visited.has(currentIndex)) continue;
    visited.add(currentIndex);
    
    // 获取当前颜色并检查是否应该填充
    const currentColor = [colors[currentIndex], colors[currentIndex + 1], colors[currentIndex + 2], colors[currentIndex + 3]];
    if (diff(currentColor, clickColor) > 50) continue;
    
    // 设置目标颜色
    colors.set(targetColor, currentIndex);
    
    // 将相邻像素加入队列
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dx, dy] of directions) {
      const newX = currentX + dx;
      const newY = currentY + dy;
      
      if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
        const newIndex = point2Index(newX, newY, canvas);
        if (!visited.has(newIndex)) {
          queue.push([newX, newY]);
        }
      }
    }
  }
};

export const changeColor2 = (x: number, y: number, colors: ImageDataArray, clickColor: number[], canvas: HTMLCanvasElement, inputColor: string) => {
  // 边界检查
  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

  const width = canvas.width;
  const height = canvas.height;
  const targetColor = hex2rgba(inputColor || '#000000');
  const startIndex = point2Index(x, y, canvas);
  
  // 读取起始颜色
  const startColor = [
    colors[startIndex],
    colors[startIndex + 1], 
    colors[startIndex + 2],
    colors[startIndex + 3]
  ];
  
  // 提前返回检查
  if (diff(startColor, clickColor) > 50 || diff(startColor, targetColor) === 0) {
    return;
  }

  // 使用 Uint8Array 替代 Set 记录访问状态，更高效
  const visited = new Uint8Array(width * height);
  const queue: number[] = []; // 使用一维数组存储索引，减少内存占用
  
  // 工具函数：检查并处理像素
  const processPixel = (index: number) => {
    if (visited[index]) return false;
    visited[index] = 1;
    
    const currentColor = [
      colors[index],
      colors[index + 1],
      colors[index + 2], 
      colors[index + 3]
    ];
    
    if (diff(currentColor, clickColor) <= 50) {
      colors.set(targetColor, index);
      return true;
    }
    return false;
  };

  // 处理起始像素
  processPixel(startIndex);
  queue.push(startIndex);

  // 使用循环队列模式
  let head = 0;
  while (head < queue.length) {
    const currentIndex = queue[head++];
    
    // 计算坐标
    const currentX = currentIndex / 4 % width;
    const currentY = Math.floor(currentIndex / 4 / width);
    
    // 检查四个方向的相邻像素
    if (currentX > 0) {
      const leftIndex = currentIndex - 4;
      if (processPixel(leftIndex)) queue.push(leftIndex);
    }
    if (currentX < width - 1) {
      const rightIndex = currentIndex + 4;
      if (processPixel(rightIndex)) queue.push(rightIndex);
    }
    if (currentY > 0) {
      const topIndex = currentIndex - width * 4;
      if (processPixel(topIndex)) queue.push(topIndex);
    }
    if (currentY < height - 1) {
      const bottomIndex = currentIndex + width * 4;
      if (processPixel(bottomIndex)) queue.push(bottomIndex);
    }
  }
};