export default class DwellerUtil {
    static MapChallengeValues(baseValue: number, scaleArray: number[], numberAppearing: number[]): number[] {
        if (numberAppearing.length < 6 || scaleArray.length < 6) {
            throw new Error("scale and number appearing arrays need to have 6 levels");
        }
        return scaleArray.map((value, index) => {
            if (numberAppearing[index] > 1 && index > 0) {
                value = scaleArray[index - 1];
            }
            return Math.round(baseValue * value);
        });
    }
}
