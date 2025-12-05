import { useEffect, useRef, useState } from "react";
import { useFabricCanvas } from "./useFabricCanvas";
import { Canvas, CircleBrush, FabricImage, filters, PencilBrush, Textbox } from "fabric";
import { IImageEditorReturns } from "./types";

export const useFabricTool = (): IImageEditorReturns => {
  const { getFabricCanvas, historyRef: { current: history }, removeState, addState, clearState, canvasRef, containerRef } = useFabricCanvas();

  const colorRef = useRef<HTMLInputElement>(null); //取色器
  const [ready, setReady] = useState<boolean>(false); //画布上是否添加了图片
  const [isDrawingMask, setIsDrawingMask] = useState<boolean>(false); //是否处于画笔状态
  const [imgUrl, setImgUrl] = useState<string>('');

  const handleFilter = (filter: filters.Blur | filters.Grayscale) => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas) return;
    console.log('onAddFilter')
    const objects = fabricCanvas
      ?.getObjects()
      .filter((obj) => obj.type === "image");
    objects.forEach((obj) => {
      const img = obj as FabricImage;
      img.filters.push(filter);
      img.applyFilters();
      fabricCanvas.renderAll();
      addState()
    });
  }

  //1. 添加图片到画布
  const onAddImage = (url: string) => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas) return;
    console.log('onAddImage')
    clearState();
    FabricImage.fromURL(url).then((img: FabricImage) => {
      // img.scaleToWidth(300);
      const isHorizontal = img.width > img.height
      if(isHorizontal){
        img.scaleToWidth(fabricCanvas.getWidth())
      }else{
        img.scaleToHeight(fabricCanvas.getHeight())
      }
      fabricCanvas.add(img);
      fabricCanvas.centerObject(img);
      setReady(true)
      addState()
    })
  }

  //2. 添加文字
  const onAddText = () => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas || !ready) return;
    console.log('onAddText')
    const text = new Textbox("文本", {
      left: 100,
      top: 100,
      fill: colorRef.current?.value || "#000000",
      stroke: '#ffffff'
    });
    //添加的文案如何让其一直处于图片最上方
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    addState()
  };

  //3. 灰白滤镜
  const onGrayWhite = () => {
    handleFilter(new filters.Grayscale())
  };

  //4. 模糊滤镜,限制n类型是0-1
  const onBlur = (n: number = 0.2) => {
    //blur: 0~1之间, 0为无模糊，1为最大模糊
    handleFilter(new filters.Blur({ blur: Math.min(1, Math.max(0, n)) }))
  };

  //5. 画笔
  const onBrush = () => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas || !ready) return;

    const nextState = !isDrawingMask
    setIsDrawingMask(nextState)
    if (!nextState) {
      fabricCanvas.set('isDrawingMode', false)
      return
    }
    console.log('onAddBrush')
    fabricCanvas.set('isDrawingMode', nextState)
    const brush = new PencilBrush(fabricCanvas);
    brush.color = colorRef.current?.value || "#000000"
    brush.width = 10
    fabricCanvas.set('freeDrawingBrush', brush)
    addState()
  }

  //6.获取图片地址
  const onGetPreviewUrl = () => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas || !ready) return;
    return exportEffective(fabricCanvas)
  };

  //7. 下载图片
  const onExport = () => {
    const now = new Date().toLocaleString()
    const dataURL = onGetPreviewUrl();
    if (!dataURL) return
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${now}.png`;
    link.click();
  }

  // 8.撤销
  const onUndo = () => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas) return;
    if (history.length <= 1) return;
    removeState()
    const json = history[history.length - 1];
    fabricCanvas.loadFromJSON(json).then(() => {
      fabricCanvas.renderAll();
    })
  }

  //9. 清空画布
  const onReset = () => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas) return
    fabricCanvas.getObjects().forEach((obj) => {
      // console.log(obj.type)
      fabricCanvas.remove(obj)
    })
    clearState()
    setReady(false)
    setImgUrl("")
    fabricCanvas.isDrawingMode = false
    setIsDrawingMask(false)
    // fabricCanvas.clear();
  }

  //10. AI清除
  const onClearAI = () => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas || !ready) return;
    console.log('onClearAI')
    const maskDataUrl = exportMask(fabricCanvas)
    const originDataUrl = exportOriginalWithOutMask(fabricCanvas)
    // TODO: 调用AI接口清除AI内容
  }
  // 导出有效区域
  const exportEffective = (fabricCanvas: Canvas) => {
    const objects = fabricCanvas.getObjects();
    // 计算所有对象的边界
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    objects.forEach(obj => {
      const bound = obj.getBoundingRect();
      minX = Math.min(minX, bound.left);
      minY = Math.min(minY, bound.top);
      maxX = Math.max(maxX, bound.left + bound.width);
      maxY = Math.max(maxY, bound.top + bound.height);
    });
    const width = maxX - minX;
    const height = maxY - minY;

    const dataURL = fabricCanvas.toDataURL({
      left: minX,
      top: minY,
      width: width,
      height: height,
      format: "png",
      multiplier: window?.devicePixelRatio || 1, //导出图片的倍率，默认为1，即原图大小
    });
    return dataURL;
  }
  // 导出Mask
  const exportMask = (fabricCanvas: Canvas) => {
    const objects = fabricCanvas.getObjects();
    //保存原状态
    const oldState = {
      bg: fabricCanvas.backgroundColor,
      items: objects.map(obj => {
        return {
          obj,
          stroke: obj.stroke,
          shadow: obj.shadow,
          visible: obj.visible
        }
      })
    }

    // 修改画笔为白色 & 隐藏其他对象
    objects.forEach((obj) => {
      if (obj.type === "path") {
        obj.stroke = '#ffffff'
        obj.shadow = null
      } else {
        //其他隐藏
        obj.visible = false
      }
    })
    fabricCanvas.backgroundColor = '#000000' //背景设为黑色
    fabricCanvas.renderAll()
    //导出Mask
    const maskDataUrl = exportEffective(fabricCanvas)
    //恢复原状态
    oldState.items.forEach(state => {
      state.obj.stroke = state.stroke;
      state.obj.shadow = state.shadow;
      state.obj.visible = state.visible;
    });
    fabricCanvas.backgroundColor = oldState.bg;
    fabricCanvas.renderAll();
    return maskDataUrl
  }
  // 导出原图不含Mask
  const exportOriginalWithOutMask = (fabricCanvas: Canvas) => {
    const objects = fabricCanvas.getObjects();
    const pathObjs = objects.filter(obj => obj.type === "path");
    pathObjs.forEach(obj => {
      if (obj.type === "path") {
        obj.visible = false; // 临时隐藏
      }
    });
    fabricCanvas.renderAll()
    // 导出无 path 的原图
    const originDataUrl = exportEffective(fabricCanvas)
    // 恢复 path 的可见性
    pathObjs.forEach((obj) => {
      obj.visible = true;
    })
    fabricCanvas.renderAll();
    return originDataUrl
  }

  const onTest = () => {
    const fabricCanvas = getFabricCanvas()
    if (!fabricCanvas) return
    const maskDataUrl = exportMask(fabricCanvas)
    const originDataUrl = exportOriginalWithOutMask(fabricCanvas)
    setImgUrl(originDataUrl)
  }

  useEffect(() => {
    return () => {
      setReady(false)
      setImgUrl("")
    }
  }, [])
  return {
    canvasRef,
    containerRef,
    colorRef,
    ready,
    isDrawingMask,
    onAddText,
    onGrayWhite,
    onBlur,
    onBrush,
    onGetPreviewUrl,
    onExport,
    onUndo,
    onReset,
    onAddImage,
    onClearAI,
    onTest,
    imgUrl
  }
}