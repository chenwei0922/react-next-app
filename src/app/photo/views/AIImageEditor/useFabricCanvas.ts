import { Canvas } from "fabric";
import { RefObject, useEffect, useRef } from "react";


export const useFabricCanvas = () => {
  const fabricCanvasRef = useRef<Canvas>(null); //fabric的canvas实例
  const canvasRef = useRef<HTMLCanvasElement>(null); //html的canvas实例
  const containerRef = useRef<HTMLDivElement>(null); //canvas的容器
  const historyRef = useRef<object[]>([]); //保存历史记录

  const clearState = () => {
    historyRef.current = [];
  }
  const removeState = () => {
    historyRef.current.pop()
  }
  const addState = () => {
    if(!fabricCanvasRef.current) return
    const fabricCanvas = fabricCanvasRef.current;
    if (historyRef.current.length > 5) {
      //限制缓存5次
      historyRef.current.shift();
    }
    historyRef.current.push(fabricCanvas.toJSON());
    console.log('addState');
  }

  const getFabricCanvas = () => fabricCanvasRef.current;

  useEffect(()=> {
    if (!containerRef.current) return
    if (!canvasRef?.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    const fabricCanvas = new Canvas(canvas, {
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: "#f0f0f0",
    });
    //监听canvas对象的变化(移动、缩放、旋转等)
    fabricCanvas.on("object:modified", (e) => {
      console.log('object:modified');
      addState()
    })

    fabricCanvasRef.current = fabricCanvas;
    console.log('fabricCanvas init')

    const resize = () => {
      if (!containerRef.current) return
      const container = containerRef.current;
      const { clientWidth, clientHeight } = container
      fabricCanvas.setDimensions({ width: clientWidth, height: clientHeight });
      fabricCanvas.setZoom(clientWidth / fabricCanvas.width); //如果需要画布上对象同步缩放
      fabricCanvas.renderAll()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      clearState()
      fabricCanvas.off()
      fabricCanvas?.dispose();
      fabricCanvasRef.current = null;
      window.removeEventListener('resize', resize)
    };
  }, [])

  return {
    fabricCanvasRef,
    canvasRef,
    containerRef,
    historyRef,
    addState,
    clearState,
    removeState,
    getFabricCanvas
  }
}