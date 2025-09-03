import { FC, useEffect, useRef, useState } from 'react'
import styles from './HistoricalSwiper.module.scss'
import classNames from 'classnames'
import {Swiper, SwiperClass, SwiperSlide} from 'swiper/react';
import {  A11y, FreeMode, Navigation } from 'swiper/modules';
import { ISlider } from '../../models/ISlider';
import ArrowButton from '../UI/ArrowButton/ArrowButton';
import useSmoothHeightResize from '../../hooks/useSmoothHeightResize';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import useDebounce from '../../hooks/useDebounce';

interface HistoricalSwiperProps{
    slides: ISlider["slides"],
    sliderTitle?: string
}

const HistoricalSwiper:FC<HistoricalSwiperProps> = ({slides, sliderTitle = ""}) => {
    const isInitialMount = useRef(true);
    const [slidesToRender, setSlidesToRender] = useState<ISlider["slides"]>(slides)
    const [titleToRender, setTitleToRender] = useState<string>(sliderTitle)
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const [swiper, setSwiper] = useState<SwiperClass>()

    const wrapperRef = useRef<HTMLDivElement>(null)
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

    useDebounce(() => {
        if (!isVisible) {
            swiper?.slideTo(0, 0)
            setSlidesToRender(slides)
            setTitleToRender(sliderTitle)
            setIsVisible(true)
        }
    }, 1000, [isVisible])

    const swiperID = Date.now();

    return (
        <>
            <h3 className={styles.historicalSwiperTitle}>{titleToRender}</h3>
            <div ref={wrapperRef} className={classNames(styles.historicalSwiperWrapper, {[styles.hidden]: !isVisible}, `historical-swiper-${swiperID}`)}>
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation, FreeMode, A11y]}
                    slidesPerView="auto"
                    navigation={{
                        nextEl: `.historical-swiper-${swiperID} .historical-swiper-button-next`,
                        prevEl: `.historical-swiper-${swiperID} .historical-swiper-button-prev`,
                        disabledClass: `${styles.disabled}`
                    }}
                    className={styles.historicalSwiper}
                    freeMode={{
                        sticky: false
                    }}
                    onSwiper={(swiper: SwiperClass) => setSwiper(swiper)}
                >
                    {slidesToRender.map((slide) => (
                        <SwiperSlide key={Date.now() + slide.title} className={styles.slide}>
                        <h3 className={styles.slideTitle}>{slide.title}</h3>
                        <p className={styles.slideDescription}>{slide.description}</p>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <ArrowButton 
                    type='fill'
                    orientation='left'
                    color='#3877EE'
                    className={classNames(styles.sliderPrev, "historical-swiper-button-prev")}  />
                <ArrowButton type='fill'
                    orientation='right'
                    color='#3877EE'
                    className={classNames(styles.sliderNext, "historical-swiper-button-next")} />
            </div>
        </>
    )
}

export default HistoricalSwiper