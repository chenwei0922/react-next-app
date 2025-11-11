
import { cn } from '@/common/utils'
import styles from '../css.module.scss'

export const StarSky = () => {
  return (
    <div className={cn(styles['star-sky'])}>
      <div className={styles['layer1']}></div>
      <div className={styles['layer2']}></div>
      <div className={styles['layer3']}></div>
    </div>
  ) 
}