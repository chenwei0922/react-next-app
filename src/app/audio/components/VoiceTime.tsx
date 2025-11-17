"use client";
import { getAssetUrl } from "@/common/utils";
import { Card, Flex, Text } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";

/**
 * 音频分析
 * 1.如何得到声音数据
 *  1.1 音频上下文
 *  1.2 音频处理节点
 * 2.如何可视化展示数据(canvas)
 */
export const VoiceTime = () => {
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
    if(!analyserRef.current || !bufferRef.current) return;
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    if (!isPlayingRef.current && cancelAnimationFrameRef.current) {
      cancelAnimationFrame(cancelAnimationFrameRef.current)
      return
    }

    cancelAnimationFrameRef.current = requestAnimationFrame(() => update());

    analyser.getByteTimeDomainData(buffer); //获取音频数据
    // console.log("////buffer", buffer);
    draw(buffer as unknown as number[]);
  };

  const draw = (data: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2; // 设置线宽
    ctx.beginPath();

    const sliceWidth = canvas.width / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
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
    const testData = new Array(256).fill(128);
    // .map((_, i) => Math.sin(i * 0.1) * 100 + 100);
    // draw(testData);
  }, []);

  return (
    <Flex direction="column" gap="4">
      <Text className="text-center">Voice Time Analysis</Text>
      <audio
        ref={audioRef}
        onPlay={() => {
          // console.log("onPlay");
          if(!isReadyRef.current){
            isReadyRef.current = true
            init()
          }
          isPlayingRef.current = true;
          update()
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
