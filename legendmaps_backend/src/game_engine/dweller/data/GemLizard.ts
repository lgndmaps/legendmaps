import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import DAMAGE_TYPES = GlobalConst.DAMAGE_TYPES;

export class GemLizard extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.GEM_LIZARD,
            GlobalConst.DWELLER_ASCII.GEM_LIZARD,
            GlobalConst.DWELLER_PHYLUM.BEAST,
        );
        this.rarity = GlobalConst.RARITY.LEGENDARY;
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.HIGH;
        this.speed = GlobalConst.DWELLER_SPEED.FAST;
        this.level_names = [
            "gem lizard, small",
            "gem lizard, small",
            "gem lizard",
            "gem lizard",
            "gem lizard, huge",
            "gem lizard, huge",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.PIERCE, DAMAGE_TYPES.BLADE];
        this.immunities = [GlobalConst.DAMAGE_TYPES.ARCANE, GlobalConst.DAMAGE_TYPES.ELECTRIC];
        this.vulnerabilities = [];

        this.basic_attack = new DwellerAttackData(this, "shocking bite");
        this.basic_attack.msg_hit = ["The [name] bites."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.ELECTRIC;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;

        this.special_attack_cooldown = 0;
        this.special_attack_description = "Fast. Moves very quickly.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.25);
        this.setBaseHp(DwellerData.BASE_HP * 0.75);
        this.setBaseDef(DwellerData.BASE_DEF * 1.1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.7,
            DwellerAttackData.BASE_DAMAGE_MAX * 1.1,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        return false;
    }
}
