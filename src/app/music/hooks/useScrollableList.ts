import { useCallback, useEffect, useRef, useState } from "react";

interface UseScrollableListOptions {
  itemHeight: number;
  itemCount: number;
  activeIndex: number;
  autoScrollDelay?: number; // 手动滚动后恢复自动跟随的延迟时间（毫秒）
  isPlay?: boolean; // 惯性滚动的摩擦系数
}

interface UseScrollableListReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  offset: number;
  isManualScrolling: boolean;
}

const throttle = <T extends (...args:any[])=> void>(func: T, delay: number) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = new Date().getTime()
    if(now-lastCall < delay){
      return
    }
    lastCall = now
    return func(...args)
  }
}
export function useScrollableList({
  itemHeight,
  itemCount,
  activeIndex,
  autoScrollDelay = 4000,
  isPlay
}: UseScrollableListOptions): UseScrollableListReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  // 手动滚动恢复定时器
  const manualScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pointerStartOffsetRef = useRef<number>(0);
  const isTouchingRef = useRef(false)

  // 计算offset（自动跟随）
  const calculateOffset = useCallback(
    (container: HTMLDivElement) => {
      const height = container.clientHeight;
      let newOffset = activeIndex * itemHeight + itemHeight / 2 - height / 2;
      const maxOffset = itemCount * itemHeight - height;
      newOffset = Math.min(Math.max(0, newOffset), maxOffset);
      if(isPlay){
        setOffset(newOffset);
      }
    },
    [activeIndex, isPlay, itemCount, itemHeight]
  );

  // 标记手动滚动并设置恢复定时器
  const markManualScrolling = useCallback(() => {
    setIsManualScrolling(true);
    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current);
    }
    manualScrollTimerRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, autoScrollDelay);
  }, [autoScrollDelay]);

  const handlePointerEvent = useCallback((e: PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const delta = -(e.clientY - pointerStartOffsetRef.current)
    const maxOffset = itemCount * itemHeight - container.clientHeight;

    setOffset((prevOffset) => {
      let newOffset = prevOffset + delta;
      newOffset = Math.min(Math.max(0, newOffset), maxOffset);
      // console.log('////ddd', delta, newOffset)
      return newOffset;
    });

  }, [itemCount, itemHeight])

  // 处理触摸开始
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      setIsManualScrolling(true);

      pointerStartOffsetRef.current = e.clientY
      isTouchingRef.current = true;
      // console.log('////111',e, e.clientY, e.pageY, e.movementY, e.offsetY)
    },
    []
  );


  // 处理触摸移动
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      e.preventDefault();
      if (!isTouchingRef.current) return  
      // handlePointerEvent(e)
      throttle(handlePointerEvent, 50)(e)
    },
    [handlePointerEvent]
  );

  // 处理触摸结束
  const handlePointerUp = useCallback((e: PointerEvent) => {
    e.preventDefault();
    if (!isTouchingRef.current) return
    isTouchingRef.current = false
    handlePointerEvent(e)
    markManualScrolling()
  }, [handlePointerEvent, markManualScrolling]);

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 监听触摸事件（移动端）
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown );
      container.removeEventListener("pointermove", handlePointerMove );
      container.removeEventListener("pointerup", handlePointerUp );

      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current);
      }
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  // 自动跟随逻辑
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 只有在非手动滚动时才自动跟随
    if (!isManualScrolling) {
      calculateOffset(container);
    }

    // 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      if (!isManualScrolling) {
        calculateOffset(container);
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, [calculateOffset, isManualScrolling]);

  return {
    containerRef,
    offset,
    isManualScrolling,
  };
}

