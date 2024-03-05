import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class Slime extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.SLIME, GlobalConst.DWELLER_ASCII.SLIME, GlobalConst.DWELLER_PHYLUM.OOZE);
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.LOW;
        this.speed = GlobalConst.DWELLER_SPEED.SLOW;
        this.level_names = ["Small Slime", "Small Slime", "Slime", "Large Slime", "Giant Slime", "Giant Slime"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.BLUDGEON];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.ELECTRIC];

        this.basic_attack = new DwellerAttackData(this, "toxic splash");
        this.basic_attack.msg_hit = ["The [name] flings a piece of itself."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 2;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 0;
        this.special_attack_description = "Attack has a chance to inflict poison.";
        //VARIATIONS
        this.setBaseDodge(0);
        this.setBaseHp(DwellerData.BASE_HP * 1.4);
        this.setBaseDef(DwellerData.BASE_DEF * 1.1);
        this.setBaseBlock(0);
    }

    //always uses this
    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 2)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;

            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "toxic splash");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;
            special_attack_data.range = 2;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.POISON;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.RARE;

            special_attack.AddCondition(
                GlobalConst.CONDITION.POISONED,
                GlobalConst.EFFECT_TRIGGERS.HIT,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                special_attack.id,
                3 + dweller.level,
                15 + dweller.level * 10,
            );

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, special_attack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
            return true;
        }
        return false;
    }
}
