'use client'
import { useSizeObserver } from '@/hooks/useSizeObserver'
import Image from 'next/image'
import { PropsWithChildren, useCallback, useState } from 'react'

export const XScroll = (props: PropsWithChildren) => {
  const {children} = props
  const [size, setSize] = useState({w: 0, h:0})

  const handleSizeChange = useCallback((p: ResizeObserverEntry) => {
    const { contentBoxSize } = p
    setSize({
      w: contentBoxSize?.[0].inlineSize,
      h: contentBoxSize?.[0].blockSize
    })
  }, [])
  const [ref] = useSizeObserver<HTMLDivElement>(handleSizeChange)
  return (
    <div ref={ref} className="w-screen h-[200px]">
      <div className=' relative origin-[top_left] -rotate-90 overflow-scroll' style={{width: size.h, height: size.w, translate: `0 ${size.h}px`}}>
        <div className=" absolute origin-[top_left] rotate-90" style={{width: size.w, height: size.h, left: size.h}}>
          {children}
        </div>
      </div>
    </div>
  )
}

export const Scroll = () => {
  const data = Array.from({length: 25}, (_, i) => i)

  return (
    <XScroll>
      <div className='inline-flex flex-row'>
        {data.map(i =>{
          return (
            <div key={i} className='relative h-[200px] w-[200px] flex items-center justify-center'>
              <Image src={`https://picsum.photos/300/300?random=${i}`} alt="random" width={200} height={200} />
              <span className='absolute text-red-500'>在pc上，此处是纵向滚动控制横向滚动</span>
            </div>
          )
        })}
      </div>
    </XScroll>
  )
}