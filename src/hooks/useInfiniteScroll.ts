// hooks/useInfiniteScroll.ts
import { getClientHeight, getScrollHeight, getScrollTop } from '@/common/rect';
import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  enabled?: boolean;  //是否还有下一页或者还能滚动
  distance?: number; // 触发距离（px）
  threshold?: number; // 交叉比例阈值
}

/**
 * 无限滚动加载更多
 * @param onLoadMore 加载更多
 * @param options { enabled,distance,threshold }
 * @returns {moreRef: RefObject<T | null>;containerRef: RefObject<T | null>;}
 */
export const useInfiniteScroll = <T extends HTMLElement>(onLoadMore: () => void, options: UseInfiniteScrollOptions) => {
  const { enabled = true, distance = 100, threshold = 0.1 } = options

  const loadMoreRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver>(null);
  const containerRef = useRef<T>(null);

  const handleLoadMore = useCallback(() => {
    if (enabled) {
      onLoadMore();
    }
  }, [enabled, onLoadMore]);

  //方式1：底部加载更多dom(推荐)
  useEffect(() => {
    const node = loadMoreRef.current
    if (!node) return;

    //如果观察者已存在，先清理
    if (observerRef.current) {
      observerRef.current?.disconnect()
    }
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null, // 视口
        rootMargin: `${distance}px`, // 提前触发距离
        threshold, // 交叉比例
      }
    );

    observer.observe(node);
    observerRef.current = observer;

    return () => {
      observerRef.current?.disconnect()
    };
  }, [handleLoadMore, enabled, distance, threshold]);

  //方式2：通过容器scrollTop，需要做个节流
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollTop = getScrollTop(container)
      const scrollHeight = getScrollHeight(container)
      const clientHeight = getClientHeight(container)
      
      if (scrollHeight - scrollTop <= clientHeight + distance) {
        handleLoadMore();
      }

    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleLoadMore, distance])

  return { moreRef: loadMoreRef, containerRef: containerRef };
};