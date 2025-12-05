import { RefObject } from "react";

export interface IImageEditorReturns {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  colorRef: RefObject<HTMLInputElement | null>;
  ready: boolean;
  isDrawingMask: boolean;
  onAddText: () => void;
  onGrayWhite: () => void;
  onBlur: (n?: number) => void;
  onBrush: () => void;
  onGetPreviewUrl: () => string | undefined;
  onExport: () => void;
  onUndo: () => void;
  onReset: () => void;
  onAddImage: (url: string) => void;
  onTest: () => void;
  onClearAI: () => void;
  imgUrl: string
}