import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class GiantSnake extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.GIANT_SNAKE,
            GlobalConst.DWELLER_ASCII.GIANT_SNAKE,
            GlobalConst.DWELLER_PHYLUM.BEAST,
        );
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["big snake", "big snake", "giant snake", "huge snake", "massive snake", "massive snake"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [GlobalConst.DAMAGE_TYPES.POISON];
        this.vulnerabilities = [];

        this.basic_attack = new DwellerAttackData(this, "fangs");
        this.basic_attack.msg_hit = ["The [name] bites."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.POISON;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;

        this.special_attack_cooldown = 25;
        this.special_attack_description = "Venom. Bite can inflict poison.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.2);
        this.setBaseHp(DwellerData.BASE_HP * 0.9);
        this.setBaseDef(DwellerData.BASE_DEF * 0.8);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.2);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.9);
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

            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "poison bite");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;
            special_attack_data.range = 1;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.POISON;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.RARE;

            special_attack.AddCondition(
                GlobalConst.CONDITION.POISONED,
                GlobalConst.EFFECT_TRIGGERS.HIT,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                special_attack.id,
                5 + dweller.level,
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
