import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class Crawler extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.CRAWLER, GlobalConst.DWELLER_ASCII.CRAWLER, GlobalConst.DWELLER_PHYLUM.DEEP_ONE);
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "crawler larva",
            "crawler larva",
            "crawler",
            "crawler",
            "greater crawler",
            "greater crawler",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.BLADE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.ARCANE];

        this.basic_attack = new DwellerAttackData(this, "tentacle");
        this.basic_attack.msg_hit = ["The [name] strikes with its tentacles."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLUDGEON;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;

        this.special_attack_cooldown = 6;
        this.special_attack_description = "Poison Bite.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldowna
            return false;
        }
        if (RandomUtil.instance.percentChance(50)) {
            // only uses it half the time it's available
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            /*
            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                id: dweller.id,
                name: dweller.name,
                kind: "Dweller",
                setupDesc: "The " + dweller.name + " bites with its poison fangs!",
                resultDesc: " ",
            } as M_TurnEvent_DwellerSpecial);
*/
            // do poison attack
            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "poison bite");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;
            special_attack_data.range = 1;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.POISON;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.EPIC;

            // add chance to give poisoned condition
            // ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.COND_POISON, special_attack);
            let level_poisoned_chance: number[] = [25, 25, 30, 40, 50, 60]; // by dweller level
            special_attack.AddCondition(
                GlobalConst.CONDITION.POISONED,
                GlobalConst.EFFECT_TRIGGERS.HIT,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                special_attack.id,
                4 + dweller.level,
                level_poisoned_chance[dweller.level],
            );

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, special_attack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
            return true;
        }
        return false;
    }
}
