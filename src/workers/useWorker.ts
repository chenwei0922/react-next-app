'use client'

import { callWorker } from "./workerManager"

export const useWorker = () => {
  return {
    sum(a: number, b: number) {
      return callWorker('sum', {a, b})
    }
  }
}

// const A = () => {
//   const {sum} = useWorker()
//   sum(1, 2)
// }