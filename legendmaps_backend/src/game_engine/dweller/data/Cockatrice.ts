import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import ConditionManager from "../../effect/conditionManager";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import MathUtil from "../../utils/mathUtil";

export class Cockatrice extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.COCKATRICE,
            GlobalConst.DWELLER_ASCII.COCKATRICE,
            GlobalConst.DWELLER_PHYLUM.MYTHIC,
        );
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.rarity = GlobalConst.RARITY.EPIC;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "cockatrice chick",
            "cockatrice chick",
            "cockatrice",
            "cockatrice",
            "cockatrice hen",
            "cockatrice hen",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 2, 1, 1];
        this.setDefaultBaseValues();
        this.setBaseHp(DwellerData.BASE_HP * 0.7); //low hp
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.2); //high dodge

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.PIERCE];

        this.basic_attack = new DwellerAttackData(this, "bite");
        this.basic_attack.msg_hit = ["The [name] bites."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0); //do not crit
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.2);

        this.special_attack_cooldown = 20;
        this.special_attack_description = "Petrification: gaze causes stun.";
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " gazes directly at you.";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(30)) {
                result = "You are immune (skill: cockatrice blood).";
            } else if (pc.traitIds.includes(55)) {
                result = "You resist (trait: unstoppable).";
            } else if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else {
                success = true;
            }

            if (success) {
                let holdfor = MathUtil.clamp(2 + dweller.level, 3, 6);
                result = "You are stunned! Can not act for " + (holdfor - 1) + " turns.";
                ConditionManager.instance.GiveCondition(
                    pc,
                    GlobalConst.CONDITION.STUNNED,
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
