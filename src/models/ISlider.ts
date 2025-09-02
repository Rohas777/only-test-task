export interface ISlider {
    id: number;
    title: string,
    dateRange: {
        start: number,
        end: number
    },
    slides: {
        title: string,
        description: string
    }[]
}