"use client";
import { getAssetUrl } from "@/common/utils";
import { Card, Flex, Text } from "@radix-ui/themes";
import { useEffect, useRef } from "react";

/**
 * 音频分析
 * 1.如何得到声音数据
 *  1.1 音频上下文
 *  1.2 音频处理节点
 * 2.如何可视化展示数据(canvas)
 */
export const VoiceAnalysis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isReadyRef = useRef(false);
  const isPlayingRef = useRef(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const cancelAnimationFrameRef = useRef<number | null>(null);

  const init = () => {
    if (!audioRef.current) return;
    const audioContext = new AudioContext();
    // const docume = new Audio(getAssetUrl("audio/1.mp3"))
    const source = audioContext.createMediaElementSource(audioRef.current); //音频源

    const analyser = audioContext.createAnalyser(); //音频处理节点
    //做频域分析的时候，需要设置fftSize (时域分析一般用于剪辑软件波形图)
    //fftSize越大，分析越精细，但是计算量越大，性能消耗也越大
    analyser.fftSize = 512; //设置FFT大小
    const buffer = new Uint8Array(
      analyser.frequencyBinCount
    ) as Uint8Array<ArrayBuffer>; //创建一个Uint8Array来存储音频数据

    source.connect(analyser); //连接音频处理节点
    analyser.connect(audioContext.destination); //连接音频输出节点

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    bufferRef.current = buffer;
  };

  const update = () => {
    if (!analyserRef.current || !bufferRef.current) return;
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    if (!isPlayingRef.current && cancelAnimationFrameRef.current) {
      cancelAnimationFrame(cancelAnimationFrameRef.current);
      return;
    }

    analyser.getByteFrequencyData(buffer); //获取音频数据
    // console.log("////buffer", buffer);
    const offset = Math.floor((buffer.length * 2) / 3); //计算偏移量
    const datas = new Array(offset * 2); //创建一个数组来存储音频数据
    for (let i = 0; i < offset; i++) {
      datas[i] = datas[datas.length - i - 1] = buffer[i];
    }
    draw(datas as unknown as number[]);

    cancelAnimationFrameRef.current = requestAnimationFrame(update);
  };

  const draw = (data: number[], maxValue: number = 255) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    //根据canvas实际尺寸进行计算
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const minDimension = Math.min(canvas.width, canvas.height);
    const r = minDimension / 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    const hslStep = 360 / (data.length - 1); // 每个数据对应的颜色角度

    const maxLen = minDimension / 2 - r; // 最大长度
    const minLen = 2; // 最小长度

    for (let i = 0; i < data.length; i++) {
      ctx.beginPath(); // 开始路径
      const len = Math.max((data[i] / maxValue) * maxLen, minLen); // 计算长度
      const rotate = hslStep * i; // 计算角度
      // ctx.strokeStyle = "red";
      ctx.strokeStyle = `hsl(${rotate}deg, 65%, 65%)`; // 设置颜色
      ctx.lineWidth = minLen; // 设置线宽

      const rad = (rotate * Math.PI) / 180; // 计算弧度
      const beginX = centerX + r * Math.cos(rad); // 计算起始点x坐标
      const beginY = centerY + r * Math.sin(rad); // 计算起始点y坐标
      const endX = centerX + (r + len) * Math.cos(rad); // 计算终点x坐标
      const endY = centerY + (r + len) * Math.sin(rad); // 计算终点y坐标
      ctx.moveTo(beginX, beginY); // 移动到起始点
      ctx.lineTo(endX, endY); // 画线到终点
      ctx.stroke(); // 绘制路径
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 200;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = canvas.style.height = `${size}px`;

    // 立即绘制测试内容
    const testData = new Array(256).fill(0);
    // .map((_, i) => Math.sin(i * 0.1) * 100 + 100);
    // draw(testData, 255);
  }, []);

  return (
    <Flex direction="column" gap="4">
      <Text className="text-center">Voice Frequency Analysis</Text>
      <audio
        ref={audioRef}
        onPlay={() => {
          // console.log("onPlay");
          if (!isReadyRef.current) {
            isReadyRef.current = true;
            init();
          }
          isPlayingRef.current = true;
          update();
        }}
        onPause={() => {
          // console.log("onPause");
          isPlayingRef.current = false;
        }}
        src={getAssetUrl(`/audio/song.mp3`)}
        controls
      />
      <Card>
        <canvas ref={canvasRef} id="canvas"></canvas>
      </Card>
    </Flex>
  );
};
