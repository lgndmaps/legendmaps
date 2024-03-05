import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import ConditionManager from "../../effect/conditionManager";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";

export class BubbleEyes extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.BUBBLE_EYES,
            GlobalConst.DWELLER_ASCII.BUBBLE_EYES,
            GlobalConst.DWELLER_PHYLUM.FEY,
        );
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.rarity = GlobalConst.RARITY.EPIC;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["bubble eyes", "bubble eyes", "bubble eyes", "bubble eyes", "elder eyes", "elder eyes"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.ELECTRIC];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.PIERCE];

        this.basic_attack = new DwellerAttackData(this, "weapon");
        this.basic_attack.msg_hit = ["The [name] releases a blast of arcane energy."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 3;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.ARCANE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.5); //LOW CRIT
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.6,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.6,
        ); //LOW DAMAGE

        this.special_attack_cooldown = 25;
        this.special_attack_description = "Gaze of Madness: inflicts confusion";
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " gazes at you, your mind begins to slip...";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else if (pc.traitIds.includes(53)) {
                result = "You are immune (trait: focused).";
            } else {
                if (RandomUtil.instance.percentChance(10 + dweller.game.dungeon.character.luck)) {
                    result = "Your resist the effect (luck).";
                } else {
                    success = true;
                }
            }

            if (success) {
                let holdfor = 5 + dweller.level;
                result = "You are confused for " + (holdfor - 1) + " turns.";
                ConditionManager.instance.GiveCondition(
                    pc,
                    GlobalConst.CONDITION.CONFUSED,
                    GlobalConst.SOURCE_TYPE.TEMPORARY,
                    dweller.id,
                    holdfor,
                );
            }
            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                id: dweller.id,
                name: dweller.name,
                kind: "Dweller",
                setupDesc: setup,
                resultDesc: result,
            } as M_TurnEvent_DwellerSpecial);

            return true;
        }
        return false;
    }
}
