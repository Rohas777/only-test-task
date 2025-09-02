import { ISlider } from "./ISlider";

export default interface ICalculatedDot extends Pick<ISlider, 'id' | 'title' | 'dateRange'> {
    index: number;
    calculatedAngles: {
        x: number,
        y: number
    }
}
  
export function isCalculatedDot (value: ISlider | ICalculatedDot): value is ICalculatedDot {
    return 'calculatedAngles' in value
}