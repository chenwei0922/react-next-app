"use client";

import { Button, Card, Flex, Text } from "@radix-ui/themes";
import "../index.css";
import { useCallback, useRef, useState } from "react";

export const TextErasingEffect = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const text =
    "你忘了，划过伤口的冷风；你信了，不痛不痒就算过了一生；你，为什么，看见雪飘落就会想唱歌，为什么，在放手时刻眼泪会掉落！你忘了，划过伤口的冷风；你信了，不痛不痒就算过了一生；你，为什么，看见雪飘落就会想唱歌，为什么，在放手时刻眼泪会掉落！你忘了，划过伤口的冷风；你信了，不痛不痒就算过了一生；你，为什么，看见雪飘落就会想唱歌，为什么，在放手时刻眼泪会掉落！你忘了，划过伤口的冷风；你信了，不痛不痒就算过了一生；你，为什么，看见雪飘落就会想唱歌，为什么，在放手时刻眼泪会掉落！";  

  const start = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    let start = 0;
    const animate = () => {
      start += 2;
      const p = Math.min(start, 100)
      setProgress(p);
      if (start < 100) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    requestAnimationFrame(animate);
  }, [isAnimating]);

  const reset = () => {
    setProgress(0);
    setIsAnimating(false);
  };

  return (
    <div className="p-4">
      {/* <Flex direction={"column"} gap={"4"}>
        <Button onClick={start} disabled={isAnimating}>
          开始动画
        </Button>
        <Button onClick={reset}>重置动画</Button>
      </Flex> */}
      <Card>
        <div className="relative bg-black">
          <Text as="p">{text}</Text>
          <Text as="p" className="absolute inset-0">
            <Text
              className="eraser-text"
              // style={{
              //   background: `linear-gradient(to right, transparent ${progress}%, #000 calc(${progress}% + 30px))`,
              //   color: "transparent",
              //   transition: "all 5s ease",
              // }}
            >
              {text}
            </Text>
          </Text>
        </div>
      </Card>
    </div>
  );
};
