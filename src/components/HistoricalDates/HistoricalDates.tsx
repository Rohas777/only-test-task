import classNames from 'classnames';
import styles from './HistoricalDates.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ISlider } from '../../models/ISlider';
import ArrowButton from '../UI/arrowButton';
import HistoricalSwiper from '../HistoricalSwiper/HistoricalSwiper';
import HistoricalMiddleSlider from '../HistoricalMiddleSlider/HistoricalMiddleSlider';
import ICalculatedDot, { isCalculatedDot } from '../../models/ICalculatedDot';


interface HistoricalDatesProps {
  sliders: ISlider[]
}

const HistoricalDates:FC<HistoricalDatesProps> = ({ sliders }) => {

  const [calculatedDots, setCalculatedDots] = useState<ICalculatedDot[] | null>(null)
  const [slides, setSlides] = useState<ISlider['slides']>(sliders[0].slides)

  const initializeDots = (sliders: ISlider[]):ICalculatedDot[] => {
    const calculatedDots = [];
    const angleStep = (2 * Math.PI) / sliders.length; 
    const offsetAngle = 5 * Math.PI / 6;
  
    for (let i = 0; i < sliders.length; i++) {
      const angle = 2* Math.PI - i * angleStep + offsetAngle;

      calculatedDots.push(
        { 
          id: sliders[i].id,
          title: sliders[i].title,
          dateRange: sliders[i].dateRange,
          index: i,
          calculatedAngles: {
          x: Math.round(Math.cos(angle) * 1000) / 1000,
          y: Math.round(Math.sin(angle) * 1000) / 1000
        }}
      );
    }

    return calculatedDots

  }

  const switchSlider = (dot: ICalculatedDot) => {
    const newSlider = sliders.find(slider => slider.id === dot.id)

    if (newSlider) {
      setSlides(newSlider.slides)
    }
  }


  useEffect(() => {
    if (sliders.length < 2 || sliders.length > 6) {
      throw new Error("Количество интерактивных точек должно быть от 2 до 6");
    }

    setCalculatedDots(initializeDots(sliders));
  }, [])

  return (
    <div className={styles.wrapper}>
        <div className={styles.rules}></div>
        <h2 className={styles.title}>Исторические даты</h2>
         
        {calculatedDots && <HistoricalMiddleSlider dots={calculatedDots} onChangeActiveDot={switchSlider} />}
        <HistoricalSwiper slides={slides} />
    </div>
  )
}

export default HistoricalDates