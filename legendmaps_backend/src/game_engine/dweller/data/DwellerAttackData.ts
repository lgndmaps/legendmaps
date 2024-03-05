import NumberRange from "../../utils/numberRange";
import GlobalConst from "../../types/globalConst";
import Dweller from "../dweller";
import DWELLER_LOOT_TYPE = GlobalConst.DWELLER_LOOT_TYPE;
import DwellerUtil from "./DwellerUtil";
import DwellerData from "./DwellerData";

/**
 * Generate virtual items on the fly from attack data
 * //TODO: Need support for addition effect besides base damage.
 */
export default class DwellerAttackData {
    parentData: DwellerData;
    name: string = "";
    baseType: GlobalConst.DWELLER_ATTACK_TYPE; //USED ONLY FOR IDENTIFYING TYPE OF ATTACK FOR CLIENT FX
    msg_hit: string[] = [];
    msg_miss: string[] = [];
    range: number = 1;
    damage_type: GlobalConst.DAMAGE_TYPES;
    level_to_hit: number[] = [];
    level_damage: NumberRange[] = [];
    level_crit: number[] = [];

    cooldown: number = 0;

    static BASE_DAMAGE_MIN: number = 4;
    static BASE_DAMAGE_MAX: number = 7;
    static BASE_HIT_BONUS: number = 8;
    static BASE_CRIT: number = 5;

    constructor(parentDweller: DwellerData, name: string) {
        this.name = name;
        this.parentData = parentDweller;
        this.setDefaultBaseValues();
    }

    private setDefaultBaseValues(): void {
        // CAUTION: These parameters change the default base values for ALL Dweller Basic Attacks
        this.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN, DwellerAttackData.BASE_DAMAGE_MAX);
        this.setBaseHit(DwellerAttackData.BASE_HIT_BONUS);
        this.setBaseCrit(DwellerAttackData.BASE_CRIT);
    }

    public setBaseDamage(
        min: number = DwellerAttackData.BASE_DAMAGE_MIN,
        max: number = DwellerAttackData.BASE_DAMAGE_MAX,
    ): void {
        if (max < min) {
            max = min;
        }
        const crScales = [1, 1.25, 1.5, 1.75, 2, 2.3];
        let mins = DwellerUtil.MapChallengeValues(min, crScales, this.parentData.level_number_appearing);
        let maxs = DwellerUtil.MapChallengeValues(max, crScales, this.parentData.level_number_appearing);

        this.level_damage = [];
        for (let i = 0; i < mins.length; i++) {
            this.level_damage.push(new NumberRange(mins[i], maxs[i]));
        }
        // console.log("LEVEL DAMAGE: " + this.level_damage.length);
    }

    public setBaseHit(baseHit: number = DwellerAttackData.BASE_HIT_BONUS): void {
        this.level_to_hit = DwellerUtil.MapChallengeValues(
            baseHit,
            [1, 1.2, 1.4, 1.6, 1.8, 2.1],
            this.parentData.level_number_appearing,
        );
    }

    public setBaseCrit(baseCrit: number = DwellerAttackData.BASE_CRIT, numberAppearing: number[] = []): void {
        this.level_crit = DwellerUtil.MapChallengeValues(
            baseCrit,
            [1, 1.2, 1.4, 1.6, 1.8, 2],
            this.parentData.level_number_appearing,
        );
    }
}
