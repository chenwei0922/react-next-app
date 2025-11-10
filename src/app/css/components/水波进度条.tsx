'use client'

export const WaterWaveAnimate = () => {
  const progress = 0.7
  const p = 0.7 * 80 / 100
  return (
    <div className="relative w-20 h-20 flex justify-center items-center bg-white rounded-full overflow-hidden">
      <div className="z-1 absolute left-[50%] top-full w-[100px] h-[100px] rounded-[42px] bg-green-400 animate-spin [animation-duration:3s]" style={{translate: `-50% -${p*100}%`}}></div>
      <div className="z-2 text-black text-xl">{progress*100}%</div>
    </div>
  )
}