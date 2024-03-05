import GlobalConst from "../types/globalConst";
import { EffectD } from "../types/globalTypes";

export default class GameUtil {
    public static GetRarityFromNumber(rarity: number | string): GlobalConst.RARITY {
        if (typeof rarity === "string") {
            rarity = parseInt(rarity);
        }
        if (rarity == 0) {
            return GlobalConst.RARITY.COMMON;
        } else if (rarity == 1) {
            return GlobalConst.RARITY.UNCOMMON;
        } else if (rarity == 2) {
            return GlobalConst.RARITY.RARE;
        } else if (rarity == 3) {
            return GlobalConst.RARITY.EPIC;
        } else if (rarity == 4) {
            return GlobalConst.RARITY.LEGENDARY;
        }

        return GlobalConst.RARITY.NONE;
    }

    public static GetRarityNumeric(rarity: GlobalConst.RARITY): number {
        if (rarity == GlobalConst.RARITY.COMMON) {
            return 0;
        } else if (rarity == GlobalConst.RARITY.UNCOMMON) {
            return 1;
        } else if (rarity == GlobalConst.RARITY.RARE) {
            return 2;
        } else if (rarity == GlobalConst.RARITY.EPIC) {
            return 3;
        } else if (rarity == GlobalConst.RARITY.LEGENDARY) {
            return 4;
        }

        return -1;
    }

    public static GetRarityString(rarity: GlobalConst.RARITY): string {
        if (rarity == GlobalConst.RARITY.COMMON) {
            return "common";
        } else if (rarity == GlobalConst.RARITY.UNCOMMON) {
            return "uncommon";
        } else if (rarity == GlobalConst.RARITY.RARE) {
            return "rare";
        } else if (rarity == GlobalConst.RARITY.EPIC) {
            return "epic";
        } else if (rarity == GlobalConst.RARITY.LEGENDARY) {
            return "legendary";
        }

        return "-";
    }

    public static GetSlotString(slot: GlobalConst.EQUIPMENT_SLOT): string {
        if (slot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
            return "weapon";
        } else {
            return slot;
        }

        return "-";
    }

    public static formatAmount(effect: EffectD): string {
        let desc: string = "";
        if (effect.type != GlobalConst.EFFECT_TYPES.DAMAGE) {
            desc += effect.amount_base >= 0 ? "+" : "";
        }
        desc += effect.amount_base + "";
        if (effect.amount_max > effect.amount_base && effect.amount_max > 0) {
            desc += "-" + effect.amount_max;
        }
        return desc;
    }

    public static formatBonus(bonus: number): string {
        return (bonus >= 0 ? "+" : "") + bonus;
    }
}
