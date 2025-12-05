import { FilesetResolver, HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { calculateDistance, THEME } from "./utils";
import { InteractionStateType } from "./types";

export const useHandSkeleton = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  // React State 用于低频 UI 更新
  const [uiState, setUiState] = useState({
    continent: "初始化中...",
    leftHandDetected: false,
    rightHandDetected: false,
    leftGesture: "等待",
    rightGesture: "等待",
  });

  // Mutable Ref 用于高频数据 (MediaPipe -> Three.js/DOM)
  // 避免 React 重渲染导致卡顿
  const interactionState = useRef<InteractionStateType>({
    leftHand: {
      x: 0,
      y: 0,
      detected: false,
      isPinching: false,
      pinchDistance: 0,
    },
    rightHand: { x: 0, y: 0, detected: false, isPinching: false },
  });

  useEffect(() => {
    let animationFrameId: number;
    let handLandmarker: HandLandmarker;
    const video = videoRef.current; // 保存 ref 的当前值

    const setupVision = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      startCamera();
    };

    const startCamera = async () => {
      const video = videoRef.current;
      if (!video) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
      setLoading(false);
    };

    const predictWebcam = async () => {
      if (!videoRef.current || !canvasRef.current || !handLandmarker) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      // 保持 Canvas 尺寸与视频一致
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startTimeMs = performance.now();
      const results = handLandmarker.detectForVideo(video, startTimeMs);

      // 重置交互状态
      const newInteractionState = { ...interactionState.current };
      newInteractionState.leftHand.detected = false;
      newInteractionState.rightHand.detected = false;

      let leftDetected = false;
      let rightDetected = false;

      if (results.landmarks) {
        for (const [index, landmarks] of results.landmarks.entries()) {
          const handedness = results.handedness[index]?.[0].categoryName; // "Left" or "Right"
          // 注意：MediaPipe 的 Left/Right 是基于镜像前的，需要根据实际画面调整
          // 这里假设画面是镜像的：用户的左手在屏幕左边

          // 绘制骨骼
          drawSkeleton(ctx, landmarks);

          // 计算几何中心
          const cx =
            landmarks.reduce((acc, l) => acc + l.x, 0) / landmarks.length;
          const cy =
            landmarks.reduce((acc, l) => acc + l.y, 0) / landmarks.length;

          // 拇指与食指距离 (捏合检测)
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const pinchDist = calculateDistance(thumbTip, indexTip);
          const isPinching = pinchDist < 0.05; // 阈值

          if (handedness === "Right") {
            // MediaPipe 通常反转，需实测，此处假设 Right 对应屏幕左侧控制地球的手
            leftDetected = true;
            newInteractionState.leftHand = {
              x: cx,
              y: cy,
              detected: true,
              isPinching,
              pinchDistance: pinchDist,
            };
          } else {
            rightDetected = true;
            newInteractionState.rightHand = {
              x: cx,
              y: cy,
              detected: true,
              isPinching,
            };
          }
        }
      }

      // 更新 Ref 数据源
      interactionState.current = newInteractionState;
      // 低频更新 React UI 状态 (避免每帧渲染)
      if (Math.random() > 0.9) {
        // 简单节流
        setUiState((prev) => ({
          ...prev,
          leftHandDetected: leftDetected,
          rightHandDetected: rightDetected,
          leftGesture: newInteractionState.leftHand.isPinching
            ? "缩放中"
            : "待机",
          rightGesture: newInteractionState.rightHand.isPinching
            ? "拖拽中"
            : "待机",
        }));
      }

      animationFrameId = requestAnimationFrame(predictWebcam);
    };

    // 绘制 2D 骨骼连线
    const drawSkeleton = (ctx: CanvasRenderingContext2D, landmarks: NormalizedLandmark[]) => {
      ctx.lineWidth = 2;
      ctx.strokeStyle = THEME.cyan;
      ctx.fillStyle = "#FFFFFF";

      // 关键点连线索引
      const connections = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [5, 9],
        [9, 10],
        [10, 11],
        [11, 12],
        [9, 13],
        [13, 14],
        [14, 15],
        [15, 16],
        [13, 17],
        [17, 18],
        [18, 19],
        [19, 20],
        [0, 17],
      ];

      connections.forEach(([i, j]) => {
        const p1 = landmarks[i];
        const p2 = landmarks[j];
        ctx.beginPath();
        //前面已经给canvas设置成视频的宽高，为什么还要乘以canvas的宽高，因为canvas的宽高是相对于视窗的，而视频的宽高是相对于画布的，所以需要乘以canvas的宽高，才能让线条的起点和终点在视频上
        ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
        ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
        ctx.stroke();
      });

      landmarks.forEach((p) => {
        ctx.beginPath();
        ctx.arc(
          p.x * ctx.canvas.width,
          p.y * ctx.canvas.height,
          3,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });
    };
    setupVision();

    return () => {
      if (video) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        video.srcObject = null;
        console.log('unmount')
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return { videoRef, canvasRef, uiState, setUiState, loading, interactionState };
};
