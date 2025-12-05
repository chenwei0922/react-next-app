import { Button, Flex } from "@radix-ui/themes";
import React, { useRef } from "react";
import { IImageEditorReturns } from "./types";

interface IToolsOptions extends Omit<IImageEditorReturns, 'canvasRef' | 'containerRef'>{
  setPreviewUrl?(url: string):void
}
export const Tools = ({setPreviewUrl, ...rest}:IToolsOptions) => {
  const {imgUrl, isDrawingMask, onTest, onClearAI, onBrush, onGetPreviewUrl, onAddImage, onAddText, onGrayWhite, onBlur, onExport, onReset, onUndo, colorRef, ready} = rest

  const inputRef = useRef<HTMLInputElement>(null);

  const onPreview = () => {
    setPreviewUrl?.(imgUrl || onGetPreviewUrl() || '')
  }
  const onClickUpload = () => {
    const input = inputRef.current;
    if (input) {
      input.value = "";
      input.click();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    //这里为什么用FileReader?因为FileReader可以读取文件内容，并将其转换为base64格式
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string; // 获取文件内容
      onAddImage(data);
    };
    reader.readAsDataURL(file); // 读取文件内容
  };

  return (
    <Flex gap={"2"} wrap={"wrap"}>
      <input ref={colorRef} type="color" defaultValue={"#ff0000"}></input>
      <Button onClick={onClickUpload}>
        <input
          className="hidden"
          ref={inputRef}
          type={"file"}
          accept={"image/*"}
          onChange={handleChange}
        />
        上传图片
      </Button>
      <input type="file" hidden accept="image/*" />
      <Button onClick={onAddText} disabled={!ready}>
        添加文字
      </Button>
      <Button onClick={onGrayWhite} disabled={!ready}>
        灰白滤镜
      </Button>
      <Button onClick={() => onBlur()} disabled={!ready}>
        模糊滤镜
      </Button>
      <Button onClick={() => onBrush()} disabled={!ready}>
        画笔{isDrawingMask ? "关闭" : "开启"}
      </Button>
      {/* <Button onClick={() => ()} disabled={!ready}>橡皮擦</Button> */}
      {/* <Button onClick={() => onClearAI()} disabled={!ready}>
        AI 消除
      </Button> */}
      {/* <Button onClick={() => onTest()} disabled={!ready}>
        测试
      </Button> */}
      <Button onClick={onUndo} color={"green"} disabled={!ready}>
        撤销
      </Button>
      <Button onClick={onReset} color={"green"} disabled={!ready}>
        清空
      </Button>
      <Button onClick={onPreview} color={"green"} disabled={!ready}>
        预览图片
      </Button>
      <Button onClick={onExport} color={"green"} disabled={!ready}>
        导出图片
      </Button>
    </Flex>
  );
};
