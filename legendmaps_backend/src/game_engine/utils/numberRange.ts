import RandomUtil from "./randomUtil";

export default class NumberRange {
    min: number = 1;
    max: number = 2;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    roll(): number {
        return RandomUtil.instance.int(this.min, this.max);
    }
}
