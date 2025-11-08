"use client";
import { Flex, Text } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSongLyrics, getSongUrl } from "../service";
import { cn } from "@/common/utils";

export const Song = () => {
  const [songId, setSongId] = useState(""); //1306923998
  const [result, setResult] = useState<{ time: number; text: string }[]>([]);
  const [url, setUrl] = useState("");
  const [index, setIndex] = useState<number>(-1);

  useEffect(() => {
    getSongLyrics(songId).then((res) => {
      // console.log("the song data=", res);
      setResult(res);
    });
    getSongUrl("1306923998").then((res) => {
      // console.log("the song url=", res);
      setUrl(res);
    });
  }, [songId]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const calculateOffset = useCallback(
    (container: HTMLDivElement) => {
      const height = container.clientHeight;
      const itemH = 40
      let newOffset = index * itemH + itemH / 2 - height / 2;
      newOffset = Math.min(Math.max(0, newOffset), result.length * itemH - height)
      setOffset(newOffset);
    },
    [index, result.length]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // 初始计算
    calculateOffset(container);

    // 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => calculateOffset(container));
    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container)
    };
  }, [calculateOffset, index]);

  return (
    <Flex
      className="w-screen h-screen p-4"
      gap="4"
      align={"center"}
      direction={"column"}
    >
      {/* <Flex direction={"row"} gap={"4"}>
        <Button onClick={() => getSongLyrics("")}>Get LRC</Button>
        <Button onClick={() => getSongUrl("")}>Get Audio Url</Button>
      </Flex> */}
      <div
        ref={containerRef}
        className={cn("flex justify-center w-full h-full overflow-hidden")}
      >
        <ul
          className="duration-300 transition-transform"
          style={{ transform: `translateY(-${offset}px)` }}
        >
          {result?.map((it, i) => (
            <div
              className={cn(
                "text-center text-gray-400 h-10 leading-10 transition-all duration-300",
                i === index && "scale-125 text-white"
              )}
              key={it.time.toString()}
            >
              <Text>{it.text}</Text>
            </div>
          ))}
        </ul>
      </div>
      {url && (
        <audio
          onTimeUpdate={(e) => {
            const currentTime = e.currentTarget.currentTime;
            const i = result?.findIndex((it) => it.time > currentTime);
            // console.log('///i', i-1, i, currentTime)
            setIndex(i === -1 ? result.length - 1 : i - 1);
          }}
          src={url}
          controls
        ></audio>
      )}
    </Flex>
  );
};
