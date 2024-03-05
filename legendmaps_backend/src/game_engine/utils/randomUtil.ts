import seedrandom from "seedrandom";
import { arrayBuffer } from "stream/consumers";

export default class RandomUtil {
    private static _instance: RandomUtil;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }
    private _rng;
    public seed: number = -1;

    setSeed(n: number) {
        RandomUtil.instance.seed = n;
        this._rng = seedrandom(n.toString());
    }

    random(): number {
        if (!this._rng) {
            this.setSeed(Math.random() * 100);
        }
        return this._rng();
    }

    //Note: Inclusive of Max, so 1-6 will give 1 to 6 not 1 to 5.
    int(min: number, max: number): number {
        if (max <= min) {
            return min;
        }
        return Math.floor(this._rng() * (max - min + 1)) + min;
    }

    percentChance(chance: number): boolean {
        return chance >= this.int(1, 100);
    }

    fromArray(ary: Array<any>): any {
        if (ary == null || ary.length < 1) {
            throw new Error("attempt to get random value from empty/null array!");
            return "";
        }
        return ary[Math.floor(this._rng() * ary.length)];
    }

    fromEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
        const randomIndex = Math.floor(this._rng() * enumValues.length);
        return enumValues[randomIndex];
    }

    shuffleArray<T>(array: T[]): T[] {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(this._rng() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
}
