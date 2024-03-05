import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class GiantBats extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.GIANT_BATS,
            GlobalConst.DWELLER_ASCII.GIANT_BATS,
            GlobalConst.DWELLER_PHYLUM.BEAST,
        );
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "giant bats",
            "giant bats",
            "giant bat flock",
            "giant bat flock",
            "giant bat flock",
            "giant bat swarm",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 2, 2, 3, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.FIRE];

        this.basic_attack = new DwellerAttackData(this, "bite");
        this.basic_attack.msg_hit = ["The [name] bites."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;

        this.special_attack_cooldown = 7;
        this.special_attack_description = "Bleeding Bite. The bite is slow to heal & can cause bleeding.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.25);
        this.setBaseHp(DwellerData.BASE_HP * 0.75);
        this.setBaseDef(DwellerData.BASE_DEF * 0.1);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.2);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.7);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }
        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;

            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "bleeding bite");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;
            special_attack_data.range = 1;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.EPIC;

            special_attack.AddCondition(
                GlobalConst.CONDITION.BLEEDING,
                GlobalConst.EFFECT_TRIGGERS.HIT,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                special_attack.id,
                4 + dweller.level,
                45 + dweller.level * 10,
            );

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, special_attack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
            return true;
        }
        return false;
    }
}
