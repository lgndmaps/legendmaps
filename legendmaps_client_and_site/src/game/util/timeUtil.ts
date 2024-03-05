export default class TimeUtil {
    static async sleep(ms: number): Promise<void> {
        await new Promise((f) => setTimeout(f, ms));
    }
}
