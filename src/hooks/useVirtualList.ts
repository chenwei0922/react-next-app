import { RefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface UseVirtualListProps<T> {
  items: T[]
  itemHeight: number
  overscan?: number
  containerTarget?: RefObject<HTMLDivElement | null>
}

export const useVirtualList = <T extends object>(props: UseVirtualListProps<T>) => {
  const { itemHeight, items, overscan = 5 } = props
  const containerRef = useRef<HTMLDivElement|null>(null);

  const [visibleItems, setVisibleItems] = useState<{ data: T; originalIndex: number; offsetTop: number; }[]>([])
  const [size, setState] = useState<{ width: number; height: number }>()
  const scrollTriggerByScrollToFuncRef = useRef<boolean>(false)

  const calcChange = useCallback(() => {
    const container = containerRef?.current
    if (!container) return
    const { clientHeight: containerHeight, scrollTop } = container

    const offset = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)

    const startIndex = Math.max(0, offset - overscan);
    const endIndex = Math.min(items.length, offset + visibleCount + overscan)

    // console.log('////vvv', startIndex, '->', endIndex, '->', visibleCount)

    const list = items.slice(startIndex, endIndex).map((item, index) => {
      return {
        data: item,
        originalIndex: startIndex + index,
        offsetTop: (startIndex + index) * itemHeight
      }
    })
    setVisibleItems(list)

  }, [containerRef, itemHeight, items, overscan])

  const scrollTo = useCallback((index: number) => {
    const container = containerRef?.current
    if (!container) return
    scrollTriggerByScrollToFuncRef.current = true

    // 创建新的滚动位置，不修改原始容器
    const newScrollTop = index * itemHeight;

    requestAnimationFrame(() => {
      container.scrollTop = newScrollTop
    });

    calcChange()
  }, [calcChange, containerRef, itemHeight])

  useLayoutEffect(() => {
    const el = containerRef?.current
    if (!el) {
      return
    }
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { clientWidth, clientHeight } = entry.target;
        setState({ width: clientWidth, height: clientHeight });
      });
    });
    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef])

  useEffect(() => {
    if (!size?.width || !size?.height || !items?.length) {
      return
    }
    requestAnimationFrame(() => {
      calcChange()
    })
  }, [calcChange, items?.length, size?.height, size?.width])


  //滚动事件监听
  useEffect(() => {
    const node = containerRef?.current
    if (!node) return
    const handleScroll = () => {
      if (scrollTriggerByScrollToFuncRef.current) {
        scrollTriggerByScrollToFuncRef.current = false
        return
      }
      calcChange()
    }
    node.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      node.removeEventListener('scroll', handleScroll)
    }
  }, [calcChange, containerRef])

  return {
    containerRef,
    visibleItems,
    totalHeight: items.length * itemHeight,
    scrollTo
  }
}