//Flip动画，元素结构动画
// first记录要监控的元素位置，last记录要元素结构变化后的位置，invert移动元素到first位置，play记录是否需要播放

import { Button, Card, Flex } from "@radix-ui/themes";
import { useLayoutEffect, useRef, useState } from "react";

const Data = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
  { id: 3, name: "王五" },
  { id: 4, name: "赵六" },
  { id: 5, name: "钱七" },
];

export const FlipAnimate = () => {
  const [data, setData] = useState(Data);

  const itemsRef = useRef<Map<number, HTMLButtonElement>>(new Map());
  const firstPositionsRef = useRef<Map<number, number>>(new Map());

  const getLocation = () => {
    const positions = new Map();
    itemsRef.current.forEach((item, key) => {
      if (item) {
        const rect = item.getBoundingClientRect();
        positions.set(key, rect.top);
      }
    });
    return positions;
  };

  const onSort = () => {
    //first位置
    firstPositionsRef.current = getLocation();
    const newArr = [...data];
    for (let i = newArr.length - 1; i > 0; i--) {
      // 生成 0 到 i 之间的随机索引
      const j = Math.floor(Math.random() * (i + 1));
      // 交换元素
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    setData(newArr); //等待react重新渲染
  };
  
  useLayoutEffect(() => {
    //last, invert, play,dom更新后立即执行
    itemsRef.current.forEach((item, key) => {
      const first = firstPositionsRef.current.get(key);
      const last = item.getBoundingClientRect().top;

      // 如果没有旧位置（比如是新增元素），则跳过
      if (first === undefined) return;
      //计算差值
      const dis = (first || 0) - (last || 0);
      if (dis !== 0) {
        //play
        item.animate(
          [
            { transform: `translateY(${dis}px)` }, // 起始帧：看起来还在旧位置
            { transform: "translateY(0)" }, // 结束帧：移动到新位置
          ],
          { duration: 500, easing: "cubic-bezier(0.33, 1, 0.68, 1)" } //顺滑的缓动曲线
        );
      }
    });
  }, [data]);

  return (
    <div className="p-4">
      <Card>
        <Button onClick={onSort}>Flip排序</Button>
        <Flex className="mt-4" direction={"column"} gap={"2"}>
          {data.map((it, index) => (
            <Button
              key={it.id}
              ref={(el) => {
                if (el) {
                  itemsRef.current.set(it.id, el);
                } else {
                  itemsRef.current.delete(it.id);
                }
              }}
            >
              {it.name}
            </Button>
          ))}
        </Flex>
      </Card>
    </div>
  );
};
