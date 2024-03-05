import path from "path";
import * as fs from "fs";
import RandomUtil from "./randomUtil";

export default class ArrayUtil {
    static remove<T>(array: T[], key: any): T[] {
        const i: number = array.indexOf(key, 0);
        if (i > -1) {
            array.splice(i, 1);
        }
        return array;
    }

    static TextFileToArray(filename: string, skip_first_line: boolean = false): Array<string> {
        let assetsDir = path.join(__dirname, "../");
        // let assetsDir = '/assets/data';
        let f = fs.readFileSync(path.join(assetsDir, filename), "utf8");
        let a = f.split("\n").map((item) => item.trim());
        if (skip_first_line) {
            a.shift();
        }

        return a;
    }

    static Shuffle<T>(array: T[]): T[] {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(RandomUtil.instance.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}
