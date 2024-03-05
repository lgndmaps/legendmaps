import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class Dramock extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.DRAMOCK, GlobalConst.DWELLER_ASCII.DRAMOCK, GlobalConst.DWELLER_PHYLUM.DEMON);
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.rarity = GlobalConst.RARITY.LEGENDARY;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "minor dramock",
            "minor dramock",
            "dramock",
            "greater dramock",
            "dramock lord",
            "dramock lord",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [GlobalConst.DAMAGE_TYPES.FIRE];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.COLD];

        this.basic_attack = new DwellerAttackData(this, "fire whip");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 2;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.FIRE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 8;
        this.special_attack_description = "Burning Strike.";
        //VARIATIONS
        this.setBaseDodge(0);
        this.setBaseHp(DwellerData.BASE_HP * 2); //very high hp
        this.setBaseDef(DwellerData.BASE_DEF * 0.8); //lower def
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MIN * 1.2); //lower damage
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }

        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }
        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 2)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;

            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "burning strike");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;
            special_attack_data.range = 1;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.FIRE;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.EPIC;

            special_attack.AddCondition(
                GlobalConst.CONDITION.BURNING,
                GlobalConst.EFFECT_TRIGGERS.HIT,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                special_attack.id,
                5 + dweller.level,
                75 + dweller.level * 10,
            );

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, special_attack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
            return true;
        }
        return false;
    }
}
