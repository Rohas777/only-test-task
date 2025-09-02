import { FC, useEffect, useRef, useState } from 'react'
import styles from './HistoricalSwiper.module.scss'
import classNames from 'classnames'
import {Swiper, SwiperSlide} from 'swiper/react';
import {  A11y, FreeMode, Navigation } from 'swiper/modules';
import { ISlider } from '../../models/ISlider';
import ArrowButton from '../UI/arrowButton';
import useSmoothHeightResize from '../../hooks/useSmoothHeightResize';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface HistoricalSwiperProps{
    slides: ISlider["slides"]
}

const HistoricalSwiper:FC<HistoricalSwiperProps> = ({slides}) => {
    const isInitialMount = useRef(true);
    const [slidesToRender, setSlidesToRender] = useState<ISlider["slides"]>(slides)
    const [isVisible, setIsVisible] = useState<boolean>(true)

    const wrapperRef = useRef(null)
    const swiperRef = useRef(null)

    const {updateContainerHeight} = useSmoothHeightResize(wrapperRef, swiperRef)

    
    useEffect(() => {
        if (isInitialMount.current) {
            updateContainerHeight();
            isInitialMount.current = false;
        } else {
            setIsVisible(false)
        }
    }, [slides])

    useEffect(() => {
        if (!isVisible) {
            const sliderAnimating = setTimeout(() => {
                setSlidesToRender(slides)
                setIsVisible(true)
            }, 1000)

            return () => clearTimeout(sliderAnimating);
        }
    }, [isVisible])

    return (
        <div ref={wrapperRef} className={classNames(styles.historicalSwiperWrapper, {[styles.hidden]: !isVisible})}>
            <Swiper
                ref={swiperRef}
                modules={[Navigation, FreeMode, A11y]}
                slidesPerView="auto"
                navigation={{
                    nextEl: ".historical-swiper-button-next",
                    prevEl: ".historical-swiper-button-prev"
                }}
                className={styles.historicalSwiper}
                freeMode={{
                    sticky: false
                }}
            >
                {slidesToRender.map((slide) => (
                    <SwiperSlide key={Date.now() + slide.title} className={styles.slide}>
                    <h3 className={styles.slideTitle}>{slide.title}</h3>
                    <p className={styles.slideDescription}>{slide.description}</p>
                    </SwiperSlide>
                ))}
            </Swiper>
            <ArrowButton type='fill'
                orientation='left'
                color='#3877EE'
                className={classNames(styles.sliderPrev, "historical-swiper-button-prev")}  />
            <ArrowButton type='fill'
                orientation='right'
                color='#3877EE'
                className={classNames(styles.sliderNext, "historical-swiper-button-next")} />
        </div>
    )
}

export default HistoricalSwiper