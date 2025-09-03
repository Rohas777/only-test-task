import classNames from 'classnames';
import styles from './HistoricalMiddleSlider.module.scss';
import { FC, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ArrowButton from '../UI/ArrowButton/ArrowButton';
import ICalculatedDot, { isCalculatedDot } from '../../models/ICalculatedDot';
import { addZeroToNumber } from '../../helpers/helpers';



interface HistoricalMiddleSliderProps {
    dots: ICalculatedDot[],
    onChangeActiveDot: (dot: ICalculatedDot) => void
}

const HistoricalMiddleSlider: FC<HistoricalMiddleSliderProps> = ({ dots, onChangeActiveDot }) => {

    ///===========================================================================================
    ///=========================== BUISNESS LOGIC ================================================
    ///===========================================================================================

    const [activeDot, setActiveDot] = useState<ICalculatedDot>(dots[0])
    const [rotateAngle, setRotateAngle] = useState<number>(0)
    const [orderedDots, setOrderedDots] = useState<ICalculatedDot[]>(dots)
    

    const reoderDots = (clickedDotIndex: number) => {
        let reoderedDots = orderedDots.map(dot => {
            const currentIndex = dot.index;
            const newIndex = (currentIndex - clickedDotIndex + orderedDots.length) % orderedDots.length;
            return {
                ...dot,
                index: newIndex
            };
        });
        setOrderedDots(reoderedDots)
    }

    const rotateMiddleSlider = (dot: ICalculatedDot) => {
        if (dot.id === activeDot.id) return

        let angleDifference = rotateAngle - (dot.index) * (360 / orderedDots.length)
        if (dot.index >= Math.ceil(orderedDots.length / 2)) {
            angleDifference = 360 + angleDifference
        }

        setActiveDot(dot)
        setRotateAngle(angleDifference)

        reoderDots(dot.index)

        onChangeActiveDot(dot)
    }

    const handleNextDotClick = () => {
        let currentDotIdx = 0;
        if (isCalculatedDot(activeDot)) {
            currentDotIdx = orderedDots.findIndex(dot => dot.id === activeDot.id)
        }

        const nextDotIdx = currentDotIdx >= orderedDots.length - 1 ? 0 : currentDotIdx + 1
        rotateMiddleSlider(orderedDots[nextDotIdx])
    }

    const handlePrevDotClick = () => {
        let currentDotIdx = 0;
        if (isCalculatedDot(activeDot)) {
            currentDotIdx = orderedDots.findIndex(dot => dot.id === activeDot.id)
        }

        const prevDotIdx = currentDotIdx === 0 ? orderedDots.length - 1 : currentDotIdx - 1
        rotateMiddleSlider(orderedDots[prevDotIdx])
    }

    ///===========================================================================================
    ///=========================== ANIMATION LOGIC ===============================================
    ///===========================================================================================

    const dateRangeRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

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

    }, { dependencies: [activeDot], scope: dateRangeRef });

    return (
        <>
            <div className={styles.middleSlider}>
                <div className={styles.dots} style={{
                    "--rotate-angle": rotateAngle + 'deg',
                } as any}>
                    {orderedDots.map((dot, index) => {
                        return (
                            <div key={dot.id} className={classNames(styles.dot, {
                                [styles.active]: dot.id === (activeDot ? activeDot.id : 0),
                            })} style={{
                                "--calculated-angle-x": dot.calculatedAngles.x,
                                "--calculated-angle-y": dot.calculatedAngles.y,
                            } as any}
                                onClick={() => { rotateMiddleSlider(dot) }}
                            >
                                <span className={styles.dotNumber}>{index + 1}</span>
                                <strong className={styles.dotTitle}>{dot.title}</strong>
                            </div>
                        )
                    })}
                </div>
                <div ref={dateRangeRef} className={styles.dateRange}>
                    <strong ref={startDateRef}>{orderedDots[0].dateRange.start}</strong>
                    <strong ref={endDateRef}>{orderedDots[0].dateRange.end}</strong>
                </div>
            </div>
            <div className={styles.middleSliderControlls}>
                <div className={styles.middleSliderControllsIndicator}>
                    {addZeroToNumber(isCalculatedDot(activeDot) ? orderedDots.findIndex(dot => dot.id === activeDot.id) + 1 : 1)} / {addZeroToNumber(orderedDots.length)}
                </div>
                <div className={styles.middleSliderControllsWrapper}>
                    <ArrowButton type='outline' orientation='left' className={styles.sliderPrev} onClick={() => handlePrevDotClick()} />
                    <ArrowButton type='outline' orientation='right' className={styles.sliderNext} onClick={() => handleNextDotClick()} />
                </div>
            </div>
        </>
    )
}

export default HistoricalMiddleSlider