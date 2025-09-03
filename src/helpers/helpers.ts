import { SwiperRef } from "swiper/react"

export const addZeroToNumber = (number: number) => {
    return number < 10 ? `0${number}` : number
}


export function isSwiper (value: HTMLElement | SwiperRef): value is SwiperRef {
    return 'swiper' in value
}