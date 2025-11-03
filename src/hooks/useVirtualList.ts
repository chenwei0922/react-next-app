import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface UseVirtualListProps<T> {
  items: T[]
  itemHeight: number
  overscan?: number
  containerTarget?: RefObject<HTMLDivElement | null>
}

export const useVirtualList = <T extends object>(props: UseVirtualListProps<T>) => {
  const { itemHeight, items, overscan = 5, containerTarget } = props

  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = containerTarget ?
    (containerTarget as RefObject<HTMLDivElement | null>) :
    internalRef;

  const [visibleItems, setVisibleItems] = useState<{ data: T; originalIndex: number; offsetTop: number; }[]>([])
  const scrollTriggerByScrollToFuncRef = useRef<boolean>(false)
  const [scrollTop, setScrollTop] = useState<number|null>(null)

  const calculateVisibleItems = useCallback((container: HTMLDivElement) => {
    const { clientHeight: containerHeight, scrollTop } = container
    const offset = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)

    const startIndex = Math.max(0, offset - overscan);
    const endIndex = Math.min(items.length, offset + visibleCount + overscan)

    setVisibleItems(items.slice(startIndex, endIndex).map((item, index) => {
      return {
        data: item,
        originalIndex: startIndex + index,
        offsetTop: (startIndex + index) * itemHeight
      }
    }))
  }, [itemHeight, items, overscan])

  const scrollTo = useCallback((index: number) => {
    setScrollTop(index * itemHeight)
  }, [itemHeight])

  useEffect(() => {
    if(scrollTop === null) return
    const container = containerRef.current
    if (!container) return
    
    scrollTriggerByScrollToFuncRef.current = true
    container.scrollTop = scrollTop
    // container.scrollTo({ top: scrollTop, behavior: 'smooth' })
    calculateVisibleItems(container)
    setScrollTop(null)
  }, [calculateVisibleItems, containerRef, scrollTop])

  // 监听滚动和尺寸变化
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    calculateVisibleItems(container)

    //监听滚动事件
    const handleScroll = () => {
      if (scrollTriggerByScrollToFuncRef.current) {
        scrollTriggerByScrollToFuncRef.current = false
        return
      }
      calculateVisibleItems(container)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })

    // 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => calculateVisibleItems(container))
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [calculateVisibleItems, containerRef])

  return {
    containerRef,
    visibleItems,
    totalHeight: items.length * itemHeight,
    scrollTo
  }
}