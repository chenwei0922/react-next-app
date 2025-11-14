import { RefObject, useEffect, useRef } from "react";

export const useSizeObserver = <T extends HTMLElement>(onSizeChange: (entry: ResizeObserverEntry) => void):[RefObject<T | null>] => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      onSizeChange(entry)
    })

    observer.observe(node)

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [onSizeChange])

  return [ref] 
}