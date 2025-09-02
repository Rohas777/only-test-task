export const addZeroToNumber = (number: number) => {
    return number < 10 ? `0${number}` : number
}