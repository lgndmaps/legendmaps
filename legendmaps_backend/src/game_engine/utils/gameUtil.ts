import Dungeon from "../dungeon";
import GlobalConst from "../types/globalConst";
import {CharacterD, SkillD} from "../types/globalTypes";
import {GlobalSkills} from "../types/globalSkills";
import MapPos from "./mapPos";
import ArrayUtil from "./arrayUtil";
import {id} from "ethers/lib/utils";

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

    public static GetRarityFromString(raritystr: string): GlobalConst.RARITY {
        switch (raritystr) {
            case "common":
                return GlobalConst.RARITY.COMMON;
                break;
            case "uncommon":
                return GlobalConst.RARITY.UNCOMMON;
                break;
            case "rare":
                return GlobalConst.RARITY.RARE;
                break;
            case "epic":
                return GlobalConst.RARITY.EPIC;
                break;
            case "legendary":
                return GlobalConst.RARITY.LEGENDARY;
                break;

            default:
                return GlobalConst.RARITY.NONE;
                break;
        }
    }

    public static GetCharacterSkillOptions(
        character: Pick<CharacterD, "brawn" | "agility" | "guile" | "spirit" | "skillIds" | "traitIds">,
        level: number,
    ) {
        const availableSkills = GlobalSkills.filter((s) => {
            if (s.minLevel > level || s.maxLevel < level || (character.skillIds?.includes(s.id))) {
                return false;
            }

            if (s.minStats) {
                let passesStatCheck = true;
                if (s.minStats?.brawn && s.minStats.brawn > character.brawn) {
                    passesStatCheck = false;
                }
                if (s.minStats?.agility && s.minStats.agility > character.agility) {
                    passesStatCheck = false;
                }
                if (s.minStats?.guile && s.minStats.guile > character.guile) {
                    passesStatCheck = false;
                }
                if (s.minStats?.spirit && s.minStats.spirit > character.spirit) {
                    passesStatCheck = false;
                }
                if (!passesStatCheck) {
                    return false;
                }
            }

            if (s.requiredSkill) {
                if (!character.skillIds.includes(s.requiredSkill)) {
                    return false;
                }
            }

            return true;
        });

        const shuffledSkills = ArrayUtil.Shuffle(availableSkills);
        return shuffledSkills.slice(0, Math.min(shuffledSkills.length, 3)).map((s) => s.id);
    }

    static GetSkillById(id: number): SkillD | null {
        // const found = array1.find(element => element > 10);
        return GlobalSkills.find((obj) => {
            return obj.id === id;
        });
    }
}
