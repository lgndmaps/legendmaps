import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import ConditionManager from "../../effect/conditionManager";

export class ToothTube extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.TOOTH_TUBE,
            GlobalConst.DWELLER_ASCII.TOOTH_TUBE,
            GlobalConst.DWELLER_PHYLUM.DEEP_ONE,
        );
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "Toothtube larva",
            "Toothtube larva",
            "Toothtube",
            "Toothtube hunter",
            "Toothtube elder",
            "Toothtube ancient",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.PIERCE];

        this.basic_attack = new DwellerAttackData(this, "Swallowing Bite");
        this.basic_attack.msg_hit = ["The [name] bites."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLUDGEON;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "Deadly bite. High critical hit chance. Regenerates health.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.25);
        this.setBaseHp(DwellerData.BASE_HP * 1.6);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 2);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.7);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MAX * 0.9,
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
