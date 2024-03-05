import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import ConditionManager from "../../effect/conditionManager";

export class Troll extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.TROLL, GlobalConst.DWELLER_ASCII.TROLL, GlobalConst.DWELLER_PHYLUM.MYTHIC);
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.rarity = GlobalConst.RARITY.EPIC;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "Young Troll",
            "Troll Wanderer",
            "Troll Warrior",
            "Troll Bridgeguard",
            "Troll Warlord",
            "Troll Warlord",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.PIERCE];

        this.basic_attack = new DwellerAttackData(this, "fists");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLUDGEON;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "Regenerates.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1);
        this.setBaseHp(DwellerData.BASE_HP * 1.2);
        this.setBaseDef(DwellerData.BASE_DEF * 1.2);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.5);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.9);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 1.2,
            DwellerAttackData.BASE_DAMAGE_MAX * 1.2,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (ConditionManager.instance.HasCondition(dweller, GlobalConst.CONDITION.REGEN)) {
            return false;
        }

        ConditionManager.instance.GiveCondition(dweller, GlobalConst.CONDITION.REGEN, GlobalConst.SOURCE_TYPE.INNATE);
        return false;
    }
}
