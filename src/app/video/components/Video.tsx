"use client";

import {  Button,  Flex, Text } from "@radix-ui/themes";
import { useRef, useState } from "react";
import Image from "next/image";

export const Video = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<{ url: string; blob: Blob }[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const handleUpload = () => {
    const input = inputRef.current;
    if (input) {
      input.value = "";
      input.click();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file)
      // console.log(file);
      setVideoUrl(URL.createObjectURL(file))

      captureFrames(file);
      // https://resources.xter.io/game/aod/main.mp4.jpeg?q=80
    }
  };
  
  const captureFrames = async (file: File) => {
    setResult([]);
    for (let i = 0; i < 10; i++) {
      const { url, blob } = await captureFrame(file, i + 1);
      // console.log('///', i, url)
      setResult((p) => [...p, { url, blob }]);
    }
  };

  const captureFrame = (file: File, time = 0) => {
    return new Promise<{ url: string; blob: Blob }>((resolve, reject) => {
      const video = videoRef.current;
      if (!video) {
        return;
      }
      video.src = URL.createObjectURL(file);
      video.currentTime = time;
      video.muted = true;
      video.preload = "metadata";
      video.autoplay = true;

      video.onseeked = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        draw()
      }
      video.oncanplay = () => {
        // draw()
      };
      const draw = () => {
        //使用canvas拿到该时间点的画面
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob as Blob);
            // console.log(url);
            resolve({ url, blob });
          }
        });
      }
      video.load()
    });
  };
  return (
    <Flex direction={"column"} gap={"4"}>
      <Flex direction={"column"} gap={'4'}>
        <Button onClick={handleUpload}>
          <input
            className="hidden"
            ref={inputRef}
            type={"file"}
            accept={"video/*"}
            onChange={handleChange}
          />
          选择视频文件(取视频帧，取前10秒)
        </Button>
        <Button onClick={() => captureFrames(file as File)}>重新获取视频帧</Button>
        <video ref={videoRef} className="hidden" controls></video>
        {videoUrl && <video src={videoUrl} muted controls></video>}
      </Flex>
      <div className="w-full overflow-x-auto">
        <Flex className="w-fit" direction={"row"} gap={"2"}>
          {result?.map((item, i) => (
            <Flex
              direction={"column"}
              gap={"1"}
              key={i}
              className="video w-[120px]"
            >
              <Image
                // className="w-[120px] h-[120px]"
                src={item.url}
                alt=""
                width={200}
                height={200}
                className={'aspect-square'}
              />
              <Button asChild>
                <a href={item.url} download>
                  下载
                </a>
              </Button>
            </Flex>
          ))}
        </Flex>
      </div>

    </Flex>
  );
};
