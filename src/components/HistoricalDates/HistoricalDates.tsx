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

  const [activeDot, setActiveDot] = useState<ICalculatedDot | ISlider>(sliders[0])
  const [rotateAngle, setRotateAngle] = useState<number>(0)
  const [calculatedDots, setCalculatedDots] = useState<ICalculatedDot[]>([])
  const [slides, setSlides] = useState<ISlider['slides']>(sliders[0].slides)

  const dateRangeRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);


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

  const reoderDots = (clickedDotIndex: number) => {
    let reoderedDots = calculatedDots.map(dot => {
      const currentIndex = dot.index;
      // Новый индекс: (текущий индекс - индекс кликнутого + длина массива) % длина массива
      const newIndex = (currentIndex - clickedDotIndex + calculatedDots.length) % calculatedDots.length;
      return {
        ...dot,
        index: newIndex
      };
    });
    setCalculatedDots(reoderedDots)
  }

  const rotateMiddleSlider = (dot: ICalculatedDot)  => {
    if (dot.id === activeDot.id) return

    let angleDifference = rotateAngle-(dot.index) * (360 / calculatedDots.length) 
    if (dot.index >= Math.ceil(calculatedDots.length / 2)) {
      angleDifference = 360 + angleDifference
    }

    setActiveDot(dot)
    setRotateAngle(angleDifference)

    reoderDots(dot.index)

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

  const handleNextDotClick = () => {
    let currentDotIdx = 0;
    if (isCalculatedDot(activeDot)) {
      currentDotIdx = calculatedDots.findIndex(dot => dot.id === activeDot.id)
    }  

    const nextDotIdx = currentDotIdx >= calculatedDots.length - 1 ? 0 : currentDotIdx + 1
    rotateMiddleSlider(calculatedDots[nextDotIdx])
  }

  const handlePrevDotClick = () => {
    let currentDotIdx = 0;
    if (isCalculatedDot(activeDot)) {
      currentDotIdx = calculatedDots.findIndex(dot => dot.id === activeDot.id)
    }  

    const prevDotIdx = currentDotIdx === 0 ? calculatedDots.length - 1 : currentDotIdx - 1
    rotateMiddleSlider(calculatedDots[prevDotIdx])
  }

  useGSAP(() => {
    gsap.to(startDateRef.current, { 
      innerText: activeDot.dateRange.start,
      duration: 1,
      snap: {
        innerText: 1,
      },
     });
     gsap.to(endDateRef.current, { 
       innerText: activeDot.dateRange.end,
       duration: 1,
       snap: {
         innerText: 1,
       },
      });
    
  },{ dependencies: [activeDot], scope: dateRangeRef });

  const addZeroToNumber = (number: number) => {
    return number < 10 ? `0${number}` : number
  }

  return (
    <div className={styles.wrapper}>
        <div className={styles.rules}></div>
        <h2 className={styles.title}>Исторические даты</h2>
        <div className={styles.middleSlider}>
            <div className={styles.dots} style={{
                "--rotate-angle": rotateAngle + 'deg',
            } as any}>
              {calculatedDots.map((dot, index) => {
                return (
                  <div key={dot.id} className={classNames(styles.dot, {
                    [styles.active]: dot.id === (activeDot ? activeDot.id : 0),
                  })} style={{
                      "--calculated-angle-x": dot.calculatedAngles.x,
                      "--calculated-angle-y": dot.calculatedAngles.y,
                    } as any}
                    onClick={() => {rotateMiddleSlider(dot)}}
                    >
                    <span className={styles.dotNumber}>{index + 1}</span>
                    <strong className={styles.dotTitle}>{dot.title}</strong>
                  </div>
                )
              })}
            </div>
            <div ref={dateRangeRef} className={styles.dateRange}>
              <strong ref={startDateRef}>{sliders[0].dateRange.start}</strong>
              <strong ref={endDateRef}>{sliders[0].dateRange.end}</strong>
            </div>    
        </div>
        <div className={styles.middleSliderControlls}>
          <div className={styles.middleSliderControllsIndicator}>
            {addZeroToNumber(isCalculatedDot(activeDot) ? calculatedDots.findIndex(dot => dot.id === activeDot.id) + 1 : 1)} / {addZeroToNumber(calculatedDots.length)}
          </div>
          <div className={styles.middleSliderControllsWrapper}>
            <ArrowButton type='outline' orientation='left' className={styles.sliderPrev} onClick={() => handlePrevDotClick()} />
            <ArrowButton type='outline' orientation='right' className={styles.sliderNext} onClick={() => handleNextDotClick()} />
          </div>
        </div>

        <HistoricalSwiper slides={slides} />
    </div>
  )
}

export default HistoricalDates