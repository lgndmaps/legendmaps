export default class GameCharacterUtil {
    static CalculateBaseHP(brawn: number): number {
        if (!brawn) {
            console.log("brawn is null");
        }

        let hp = 50;

        if (brawn <= 13) {
            hp += brawn - 10;
        } else {
            hp += (brawn - 10) * 2 - 3;
        }

        return hp;
    }

    static CalculateLevelUpHP(brawn: number): number {
        if (!brawn) {
            console.log("brawn is null");
        }
        let hp = 25;
        hp += brawn - 10;

        return hp;
    }
}
