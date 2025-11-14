'use client'

import { Button } from "@radix-ui/themes";
import style from "../css.module.scss";
import { cn, getAssetUrl } from "@/common/utils";
import { useState } from "react";


export const BaseContainer = () => {
  return (
    <div className={cn("p-4 gap-4 flex flex-col", style.base)}>
      <BorderRotateAnimate />
      <NineImg />
      <TextUnderlineAnimate />
    </div>
  );
};

//边框旋转动画
const BorderRotateAnimate = () => {
  return <div className={style.btn}>边框旋转动画</div>
}

//九宫格图片动画
export const NineImg = () => {
  const [isHover, setIsHover] = useState(false)
  return (
    <div
      className={cn(
        "w-[120px] h-[120px] group",
        "grid grid-cols-3"
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {new Array(9).fill(0).map((_, i) => {
        const r = Math.floor(i / 3);
        const c = i % 3;
        const bgx = -c * 100 + '%'
        const bgy = -r * 100 + '%'
        const disX = (c-1) * 5 + 'px'
        const disY = (r-1) * 5 + 'px'
        return (
          <div
            key={i}
            className={cn("group-hover:border group-hover:border-white")}
            style={{
              backgroundImage: `url(${getAssetUrl("/images/test.png")})`,
              backgroundSize: "120px 120px",
              backgroundPosition: `${bgx} ${bgy}`,
              transform: isHover ? `translate(${disX}, ${disY})` : `translate(0, 0)`
            }}
          />
        );
      })}
    </div>
  );
};

//文本下划线动画
export const TextUnderlineAnimate = () => {
  return (
    <div className={style['text-div']}>
      <span className={style['text-underline']}>你忘了 划过伤口的冷风 你信了 不痛不痒就算过了一生 你 为什么 看见雪飘落就会想唱歌 为什么 在放手时刻眼泪会掉落</span>
    </div>
  )
}
