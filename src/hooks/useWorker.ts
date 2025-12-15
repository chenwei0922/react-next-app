import { useEffect, useRef } from "react"

export const useWorker = <TSend, TReceive>(url: string | URL) => {
  const workerRef = useRef<Worker | null>(null)
  
  useEffect(()=> {
    //new URL('../workers/worker.ts', import.meta.url)
    workerRef.current = new Worker(url)
    return () => {
      workerRef.current?.terminate()
    }
  }, [url])
  
  const post = (data:TSend) => {
    workerRef.current?.postMessage(data)
  }
  const onMessage=(cb:(data:TReceive) => void) => {
    const worker = workerRef.current
    if(!worker) return
    worker.onmessage = (event) => {
      cb(event.data)
    }
  }
  return {
    post,
    onMessage
  }
}

/**
 * src/workers/calc.worker.ts

// src/workers/calc.worker.ts
self.onmessage = (event) => {
  const { data } = event
  const result = data * 2
  //模拟高耗时任务
  self.postMessage(result)
}
*/