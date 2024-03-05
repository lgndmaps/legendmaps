import GlobalConst from "../../../types/globalConst";

export default class EffectUtil {
    static GetTint(damType: GlobalConst.DAMAGE_TYPES): number[] {
        if (damType == GlobalConst.DAMAGE_TYPES.FIRE) {
            return [0xffe400, 0xffb311, 0xff570d];
        } else if (damType == GlobalConst.DAMAGE_TYPES.COLD) {
            return [0xffffff, 0xefefff, 0xeeeeff];
        } else if (damType == GlobalConst.DAMAGE_TYPES.ARCANE) {
            return [0xd200ff, 0xe118ff];
        } else if (damType == GlobalConst.DAMAGE_TYPES.POISON) {
            return [0x12ff00, 0x21e512];
        } else if (damType == GlobalConst.DAMAGE_TYPES.DIVINE) {
            return [0x59eaff, 0x95f0fe];
        } else if (damType == GlobalConst.DAMAGE_TYPES.ELECTRIC) {
            return [0xfcff0f, 0xfcff00];
        } else if (damType == GlobalConst.DAMAGE_TYPES.NECROTIC) {
            return [0x796649, 0x92973c, 0x6a6f16, 0x9b9778];
        } else {
            return [0xcccccc];
        }
    }

    static GetParticle(damType: GlobalConst.DAMAGE_TYPES): string {
        if (damType == GlobalConst.DAMAGE_TYPES.FIRE) {
            return "px_4point_10";
        } else if (damType == GlobalConst.DAMAGE_TYPES.COLD) {
            return "px_star_10";
        } else if (damType == GlobalConst.DAMAGE_TYPES.ARCANE) {
            return "px_star_10";
        } else if (damType == GlobalConst.DAMAGE_TYPES.POISON) {
            return "px_round_12";
        } else if (damType == GlobalConst.DAMAGE_TYPES.DIVINE) {
            return "px_diamond_15";
        } else if (damType == GlobalConst.DAMAGE_TYPES.ELECTRIC) {
            return "px_star_10";
        } else if (damType == GlobalConst.DAMAGE_TYPES.NECROTIC) {
            return "px_4point_10";
        } else {
            return "px_star_10";
        }
    }

    static IsMagicType(damType: GlobalConst.DAMAGE_TYPES): boolean {
        if (damType == GlobalConst.DAMAGE_TYPES.PIERCE) {
            return false;
        } else if (damType == GlobalConst.DAMAGE_TYPES.BLADE) {
            return false;
        } else if (damType == GlobalConst.DAMAGE_TYPES.BLUDGEON) {
            return false;
        }
        return true;
    }
}
