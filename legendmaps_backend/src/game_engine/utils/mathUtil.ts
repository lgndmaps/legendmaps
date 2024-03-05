export default class MathUtil {
    static numberInRange(n: number, min: number, max: number): boolean {
        if (n < min || n > max) {
            return false;
        } else {
            return true;
        }
    }

    static clamp(n: number, min: number, max: number): number {
        if (n < min) {
            n = min;
        } else if (n > max) {
            n = max;
        }
        return n;
    }
}
