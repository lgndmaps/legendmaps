import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";

export class Vodyanoi extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.VODYANOI,
            GlobalConst.DWELLER_ASCII.VODYANOI,
            GlobalConst.DWELLER_PHYLUM.DEEP_ONE,
        );
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.rarity = GlobalConst.RARITY.RARE;
        this.level_names = [
            "vodyanoi",
            "vodyanoi acolyte",
            "vodyanoi cleric",
            "vodyanoi cleric",
            "vodyanoi bishop",
            "vodyanoi bishop",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 2, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.ELECTRIC];
        this.immunities = [];
        this.vulnerabilities = [];

        this.basic_attack = new DwellerAttackData(this, "Icy Spear");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 3;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.COLD;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_PHYSICAL;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "None.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.75);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(15);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.7);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 1,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.91,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        return false;
    }
}
