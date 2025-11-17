
import style from '../css.module.scss'
import Image from 'next/image'

export const NineGridFlex = () => {
  return (
    <div className={style["nine-grid"]}>
      {new Array(9).fill(0).map((_, i)=> {
        return <div key={i} className={style["grid-item"]}></div>
      })}
     
    </div>
  )
}


export const NineGridAnimate = () => {
  return (
    <div className={style["nine-grid-animate"]}>
      {new Array(5).fill(0).map((_, i)=> {
        return <div key={i} className={style["grid-item"]}>
          <Image src={`https://picsum.photos/300/300?random=${i}`} alt="random" width={80} height={80} />
        </div>
      })}
     
    </div>
  )
}

export const NineGridGrid = () => {
  return (
    <div className='flex flex-row flex-wrap gap-4'>
      <NineGridFlex />
      <NineGridAnimate />
    </div>
  )
}