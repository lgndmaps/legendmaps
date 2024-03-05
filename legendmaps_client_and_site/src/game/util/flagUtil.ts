export default class FlagUtil {
    /**
     * Bitwise reminders:
     * Set a flag: |= flag
     * Set two flags: |= flag1 | flag2
     * Unset a flag: &= ~flag
     * Unset 2 flags: &= ~(flag1|flag2);
     * Check flag: flags & flag1
     */

    static Set(flagHolder: number, flagToSet: number): number {
        return (flagHolder |= flagToSet);
    }

    static UnSet(flagHolder: number, flagToUnSet: number): number {
        return (flagHolder &= ~flagToUnSet);
    }

    static IsSet(flagHolder: number, flagToCheck: number): boolean {
        return (flagHolder & flagToCheck) != 0;
    }

    static IsNotSet(flagHolder: number, flagToCheck: number): boolean {
        return (flagHolder & flagToCheck) == 0;
    }
}
