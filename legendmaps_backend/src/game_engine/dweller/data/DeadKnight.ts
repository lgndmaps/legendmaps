import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class DeadKnight extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.DEAD_KNIGHT,
            GlobalConst.DWELLER_ASCII.DEAD_KNIGHT,
            GlobalConst.DWELLER_PHYLUM.UNDEAD,
        );
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "dead squire",
            "dead squire",
            "dead knight",
            "dead knight",
            "dead champion",
            "dead champion",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.PIERCE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.DIVINE];

        this.basic_attack = new DwellerAttackData(this, "ancient sword");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] slices."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "Bleeding Strike: The knight's blade is unnaturally sharp.";

        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.5);
        this.setBaseHp(DwellerData.BASE_HP * 1.1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(15);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.9);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1.1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }
        if (RandomUtil.instance.percentChance(60)) {
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;

            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "bleeding strike");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;
            special_attack_data.range = 1;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.EPIC;

            special_attack.AddCondition(
                GlobalConst.CONDITION.BLEEDING,
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
