import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";
import ConditionManager from "../../effect/conditionManager";

export class DevilBones extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.DEVIL_BONES,
            GlobalConst.DWELLER_ASCII.DEVIL_BONES,
            GlobalConst.DWELLER_PHYLUM.UNDEAD,
        );
        this.rarity = GlobalConst.RARITY.EPIC;
        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["devil bones", "devil bones", "devil bones", "devil bones", "devil bones", "devil bones"];

        this.level_number_appearing = [1, 1, 2, 3, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.POISON];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.BLUDGEON];

        this.basic_attack = new DwellerAttackData(this, "freezing bone");
        this.basic_attack.msg_hit = [
            "The [name] bashes you with its freezing bone.",
            "The [name] bludgeons you with its freezing bone.",
        ];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.COLD;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;

        this.special_attack_cooldown = 6;
        this.special_attack_description = "Regenerates.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.25);
        this.setBaseHp(DwellerData.BASE_HP * 1.25);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(5);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.75,
            DwellerAttackData.BASE_DAMAGE_MAX * 1,
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
