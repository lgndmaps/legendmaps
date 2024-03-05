import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";

export class WyrdenCat extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.WYRDEN_CAT,
            GlobalConst.DWELLER_ASCII.WYRDEN_CAT,
            GlobalConst.DWELLER_PHYLUM.FEY,
        );
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.HIGH;
        this.speed = GlobalConst.DWELLER_SPEED.FAST;
        this.level_names = [
            "wyrden kitten",
            "small wyrden cat",
            "wyrden cat",
            "wyrden cat",
            "elder wyrden cat",
            "wyrden cat king",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.POISON];

        this.basic_attack = new DwellerAttackData(this, "claws");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "Fast Movement.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.5);
        this.setBaseHp(DwellerData.BASE_HP * 0.85);
        this.setBaseDef(DwellerData.BASE_DEF * 1.1);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.2);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        return false;
    }
}
