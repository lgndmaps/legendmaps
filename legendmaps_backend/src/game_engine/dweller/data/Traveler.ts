import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import ConditionManager from "../../effect/conditionManager";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import MathUtil from "../../utils/mathUtil";

export class Traveler extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.TRAVELER,
            GlobalConst.DWELLER_ASCII.TRAVELER,
            GlobalConst.DWELLER_PHYLUM.DEEP_ONE,
        );
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["Traveler", "Traveler", "Traveler ", "Traveler", "Traveler", "Traveler"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 1, 2, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.PIERCE];

        this.basic_attack = new DwellerAttackData(this, "shocking grasp");
        this.basic_attack.msg_hit = ["The [name] hits with their shocking claw."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.ELECTRIC;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 30;
        this.special_attack_description = "Stun wand. A peculiar wand that shocks and stuns at a distance.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.1);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1.1);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 1,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.75,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 4)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " raises it's strange wand & fires a bolt of energy!";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else if (pc.traitIds.includes(56)) {
                result = "You are immune (trait: innocent).";
            } else {
                if (RandomUtil.instance.percentChance(10 + dweller.game.dungeon.character.luck)) {
                    result = "Your resist the effect (luck).";
                } else {
                    success = true;
                }
            }

            if (success) {
                let holdfor = MathUtil.clamp(2 + dweller.level, 3, 6);
                result = "You are stunned for " + (holdfor - 1) + " turns.";
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
