import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class Paralisk extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.PARALISK, GlobalConst.DWELLER_ASCII.PARALISK, GlobalConst.DWELLER_PHYLUM.DEMON);
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "Minor Paralisk",
            "Minor Paralisk",
            "Paralisk",
            "Greater Paralisk",
            "Paralisk Lord",
            "Paralisk Lord",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 2, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [GlobalConst.DAMAGE_TYPES.FIRE];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.COLD];

        this.basic_attack = new DwellerAttackData(this, "fire spit");
        this.basic_attack.msg_hit = ["The [name] spits flames."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.FIRE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 8;
        this.special_attack_description = "Burning Breath. Victims can be set on fire.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.1);
        this.setBaseHp(DwellerData.BASE_HP * 1.1);
        this.setBaseDef(DwellerData.BASE_DEF * 0.8);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.9);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
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

            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "burning breath");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;
            special_attack_data.range = 1;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.FIRE;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.RARE;

            special_attack.AddCondition(
                GlobalConst.CONDITION.BURNING,
                GlobalConst.EFFECT_TRIGGERS.HIT,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                special_attack.id,
                4 + dweller.level,
                35 + dweller.level * 10,
            );

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, special_attack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
            return true;
        }
        return false;
    }
}
