import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";

export class Skell extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.SKELL, GlobalConst.DWELLER_ASCII.SKELL, GlobalConst.DWELLER_PHYLUM.UNDEAD);
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["Skell", "Skell", "Skell Warrior", "Skell Warrior", "Skell Captain", "Skell Captain"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [2, 2, 2, 2, 2, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.COLD, GlobalConst.DAMAGE_TYPES.NECROTIC];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.BLUDGEON];

        this.basic_attack = new DwellerAttackData(this, "rusted spear");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] stabs."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "None.";
        //VARIATIONS
        this.setBaseDodge(0);
        this.setBaseHp(DwellerData.BASE_HP * 1.1);
        this.setBaseDef(DwellerData.BASE_DEF * 1.1);
        this.setBaseBlock(10);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.5);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        return false;
    }
}
