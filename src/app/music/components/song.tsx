"use client";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { getSongLyrics, getSongUrl } from "../service";
import { useScrollableList } from "../hooks/useScrollableList";
import { cn, getAssetUrl } from "@/common/utils";

export const Song = () => {
  const [songId, setSongId] = useState(""); //1306923998
  const [result, setResult] = useState<{ time: number; text: string }[]>([]);
  const [url, setUrl] = useState("");
  const [index, setIndex] = useState<number>(-1);
  const [isPlay, setIsPlay] = useState(false)

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

  // 使用滚动hook
  const { containerRef, offset } = useScrollableList({
    itemHeight: 40,
    itemCount: result.length,
    activeIndex: index,
    autoScrollDelay: 4000,
    isPlay
  });
  const audioRef = useRef<HTMLAudioElement>(null)

  // const onPlay = () => {
  //   const audio = audioRef.current
  //   if(!audio) return
  //   if(audio.played){
  //     audio.pause()
  //   }else if(audio.paused){
  //     audio.play()
  //   }
  // }


  return (
    <Flex
      className="w-screen h-screen p-4"
      gap="4"
      align={"center"}
      direction={"column"}
    >
      {url && (
        <audio
          ref={audioRef}
          onTimeUpdate={(e) => {
            // 手动滚动时不自动更新歌词索引
            // if (isManualScrolling) return;
            
            const currentTime = e.currentTarget.currentTime;
            const i = result?.findIndex((it) => it.time > currentTime);
            // console.log('///i', i-1, i, currentTime)
            setIndex(i === -1 ? result.length - 1 : i - 1);
          }}
          src={getAssetUrl(`/audio/song.mp3`)}
          controls          
          onPlay={()=> setIsPlay(true)}
          // className="hidden"
        ></audio>
      )}
      <div
        ref={containerRef}
        className={cn("flex justify-center w-full h-full overflow-hidden touch-none")}
        style={{WebkitOverflowScrolling: 'touch'}}
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
    </Flex>
  );
};
