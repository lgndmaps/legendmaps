export default class ArrayUtil {
    static cloneArray<T>(array: T[]): T[] {
        let myClonedArray: T[] = [];
        array.forEach((val) => myClonedArray.push(Object.assign({}, val)));
        return myClonedArray;
    }

    static remove<T>(array: T[], key: any): T[] {
        const i: number = array.indexOf(key, 0);
        if (i > -1) {
            array.splice(i, 1);
        }
        return array;
    }
}
