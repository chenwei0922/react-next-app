import { RefObject, useEffect, useMemo, useRef, useState } from "react";

//检测元素是否在可视区域
/**
 * 检测元素是否在可视区内
 * @param options IntersectionObserverInit
 * @returns [RefObject, boolean, IntersectionObserverEntry]
 */
export const useIsVisible = <T extends HTMLElement>(options: IntersectionObserverInit = {}): [RefObject<T | null>, boolean, IntersectionObserverEntry | null] => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<T>(null);

  //options外部缓存或内部缓存
  const memoOptions = useMemo(() => {
    return {root: options.root, rootMargin: options.rootMargin, threshold: options.threshold} as IntersectionObserverInit
  }, [options.root, options.rootMargin, options.threshold])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if(entry){
        setIsVisible(entry.isIntersecting)
        setEntry(entry)
      }
    }, memoOptions)

    observer.observe(node)

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [memoOptions]) // 注意：options 变化会重新创建 observer
  return [ref, isVisible, entry]
}