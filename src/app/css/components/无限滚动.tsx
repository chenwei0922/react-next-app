import { useEffect, useRef } from "react";
import style from "../css.module.scss";
import { cn } from "@/common/utils";

export const Carousel = () => {
  const count = 6;
  return (
    <div className={style.carousel}>
      <div className={cn(style.group, style.animate)}>
        {new Array(count).fill(0).map((_, i) => (
          <div key={i} className={style.card}>
            {i + 1}
          </div>
        ))}
      </div>
      <div inert className={cn(style.group, style.animate)}>
        {new Array(count).fill(0).map((_, i) => (
          <div key={i} className={style.card}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
export const CarouselJsAnimate = () => {
  const count = 6;
  const origin = new Array(count).fill(0).map((_, i) => i + 1);
  const data = [...origin, ...origin];
  const divRef = useRef<HTMLDivElement>(null);

  const onClick = (i: number) => {
    console.log("click", i);
  };
  useEffect(() => {
    //animate动画
    const div = divRef.current;
    if (!div) return;
    const animate = div.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: 5000, iterations: Infinity, easing: "linear" }
    );
    animate.pause();
    div.addEventListener("mouseenter", () => {
      animate.pause();
    });
    div.addEventListener("mouseleave", () => {
      animate.play();
    });
    return () => {
      animate.cancel();
      //移除鼠标监听事件
      div.removeEventListener("mouseenter", () => {
        animate.pause();
      });
      div.removeEventListener("mouseleave", () => {
        animate.play();
      });
    };
  }, []);
  return (
    <div className={style.carousel}>
      <div className={style.group} ref={divRef}>
        {data.map((_, i) => {
          const realIndex = i % count;
          return (
            <div
              key={i}
              className={style.card}
              role="button"
              tabIndex={0}
              onClick={() => onClick(realIndex)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onClick(realIndex);
              }}
            >
              {realIndex + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CarouselJsRAF = () => {
  const count = 6;
  const origin = new Array(count).fill(0).map((_, i) => i + 1);
  const data = [...origin, ...origin];
  const divRef = useRef<HTMLDivElement>(null);

  const onClick = (i: number) => {
    console.log("click", i);
  };
  useEffect(() => {
    //animate动画
    const div = divRef.current;
    if (!div) return;
    let x = 0; //当前位移
    let rafId: number|null=null; //动画id
    let speed = 3; //速度

    //拖拽逻辑
    let isDragging = false; //是否拖拽
    let startX = 0; //开始拖拽的位置
    let lastX = 0; //上一次拖拽的位置
    let moved = false; //是否移动
    let timer: NodeJS.Timeout | null = null; //定时器

    const contentWidth = div.scrollWidth / 2;

    //rAF主循环 自动逻辑
    const loop = () => {
      if (!isDragging) {
        //自动逻辑
        x -= speed;
      }
      if (x <= -contentWidth) {
        x += contentWidth;
      }
      if (x >= 0) {
        x -= contentWidth;
      }
      div.style.transform = `translateX(${x}px)`;
      if (!isDragging) {
        rafId = requestAnimationFrame(loop);
      }
    };
    // loop();

    const onPointerDown = (e) => {
      console.log("onPointerDown");
      isDragging = true;
      moved = false;
      startX = e.clientX;
      lastX = e.clientX;
      speed = 0;

      // 以下二选一即可
      // 1.设置捕获，会导致内部onClick失效，需手动触发点击事件
      // 2.不设置的话，拖拽时又会触发点击事件，需判断是否拖拽限制点击事件执行
      div.setPointerCapture(e.pointerId); //设置捕获

      if(rafId){
        cancelAnimationFrame(rafId); //取消自动逻辑
      }
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      //点击事件: <5px 判定为点击
      if (Math.abs(e.clientX - startX) > 5) {
        moved = true;
      } // 拖拽阈值

      // console.log("onPointerMove");
      const dx = e.clientX - lastX;
      x += dx;
      // console.log("dx=", dx, x);
      loop();
      lastX = e.clientX;
    };
    const onPointerUp = (e) => {
      div.releasePointerCapture(e.pointerId); //释放捕获

      //点击事件: <5px 判定为点击
      if (!moved) {
        //click item，非滚动
        //设置捕获时，要做的处理，使用坐标反查元素，再触发点击事件
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        const card = el?.closest(`.${style.card}`);
        const index = Number(card?.getAttribute('data-realindex') || 0)
        console.log("click card", card, index);
        onClick(index)
      }

      console.log("onPointerUp");
      if (timer) {
        clearTimeout(timer);
      }

      //启动自动逻辑
      isDragging = false;
      //5s后启动自动逻辑，防止拖拽后立即启动
      timer = setTimeout(() => {
        // speed = 3;
        // loop();
      }, 5000);
    };

    div.addEventListener("pointerdown", onPointerDown);
    div.addEventListener("pointermove", onPointerMove);
    div.addEventListener("pointerup", onPointerUp);

    return () => {
      if(rafId){
        cancelAnimationFrame(rafId);
      }
      //移除鼠标监听事件
      div.removeEventListener("pointerdown", onPointerDown);
      div.removeEventListener("pointermove", onPointerMove);
      div.removeEventListener("pointerup", onPointerUp);
    };
  }, []);
  return (
    <div className={cn(style.carousel, style["carousel-raf"])}>
      <div className={style.group} ref={divRef}>
        {data.map((_, i) => {
          const realIndex = i % count;
          return (
            <div
              key={i}
              className={cn(style.card, 'card')}
              data-realindex={realIndex}
              // onClick={(e) => {
              //   onClick(realIndex)
              // }}
            >
              {realIndex + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};
