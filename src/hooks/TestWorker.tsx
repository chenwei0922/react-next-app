import { useEffect } from "react"
import { useWorker } from "./useWorker"

const A = () => {
  const {post, onMessage} = useWorker(new URL('./worker.ts', import.meta.url))

  useEffect(()=> {
    onMessage((msg) => console.log(msg))
  }, [onMessage])
  
  return <button onClick={() => post('hello')}>click</button>
}