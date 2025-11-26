'use client'
import { Card, Flex, Text } from "@radix-ui/themes"
import { useEffect, useMemo, useRef } from "react"
import { changeColor, point2Index } from "../utils"
import { getAssetUrl } from "@/common/utils"

const useImageEdit = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const init = () => {
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const img = new Image()

    img.src=getAssetUrl('/images/test2.png')
    img.onload = () => {
      canvas.width = 300
      canvas.height = 300
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }

  useEffect(()=> {
    init()
  }, [])
  useEffect(()=> {
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    canvas.addEventListener('click', (e) => {
      const x = e.offsetX
      const y = e.offsetY
      const imgData = ctx.getImageData(0,0,canvas.width, canvas.height) // 获取图片数据
      const colors = imgData.data
      const i = point2Index(x, y, canvas)
      const clickColor = [colors[i], colors[i+1], colors[i+2], colors[i+3]]
  
      changeColor(x, y, colors, clickColor, canvas, inputRef.current?.value || '#000000') //
      ctx.putImageData(imgData, 0, 0) // 将修改后的数据放回画布
    })
  }, [])
  return {
    canvasRef,
    inputRef
  }
}
export const PhotoEdit = () => {
  const {canvasRef, inputRef} = useImageEdit()

  return (
    <Flex direction={'column'} className="p-4">
      <Text >给图片换色</Text>
      <Card>
        <input ref={inputRef} type="color"></input>
        <canvas ref={canvasRef}></canvas>
      </Card>
    </Flex>
  )
}