
import style from '../css.module.scss'

export const CardFlip = () => {
  return (
    <div className={style['card-flip-container']}>
      <div className={style['card']}>
        <div className={style['card-front']}>
          <h2>Front Side</h2>
          <p>This is the front side of the card.</p>
        </div>
        <div className={style['card-back']}>
          <h2>Back Side</h2>
          <p>This is the back side of the card.</p>
        </div>
      </div>
    </div>
  )
}