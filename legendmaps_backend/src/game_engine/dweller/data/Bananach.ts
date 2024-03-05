import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import ConditionManager from "../../effect/conditionManager";

export class Bananach extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.BANANACH, GlobalConst.DWELLER_ASCII.BANANACH, GlobalConst.DWELLER_PHYLUM.DEMON);
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.rarity = GlobalConst.RARITY.LEGENDARY;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_names = [
            "least bananach",
            "lesser bananach",
            "bananach",
            "massive bananach",
            "bananach overlord",
            "bananach overlord",
        ];
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();
        this.setBaseDef(DwellerData.BASE_DEF * 1.1); //high def
        this.setBaseHp(DwellerData.BASE_HP * 0.9); //low hp
        this.resistances = [GlobalConst.DAMAGE_TYPES.NECROTIC];
        this.immunities = [GlobalConst.DAMAGE_TYPES.COLD];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.BLUDGEON];

        this.basic_attack = new DwellerAttackData(this, "cold snap");
        this.basic_attack.msg_hit = ["The [name] expels an instant cold snap.", "The [name] conjures up a cold snap."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 2;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.COLD;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;
        this.special_attack_cooldown = 6;
        this.special_attack_description = "Freezing Touch: holds the player in place.";
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " grips you with its icy claws";
            let success: boolean = false;
            let result: string = "";
            if (pc.isImmune(GlobalConst.DAMAGE_TYPES.COLD)) {
                result = "You are immune to cold effects!";
            } else if (pc.skillIds.includes(30)) {
                result = "You are immune (skill: cockatrice blood).";
            } else if (pc.traitIds.includes(55)) {
                result = "You resist (trait: unstoppable).";
            } else if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else if (pc.isResistant(GlobalConst.DAMAGE_TYPES.COLD)) {
                if (RandomUtil.instance.percentChance(50)) {
                    result = "Your cold resistance holds off the effect.";
                } else {
                    success = true;
                }
            } else {
                success = true;
            }

            if (success) {
                let holdfor = 3 + dweller.level;
                result = "You are frozen in place! Can not move for " + holdfor + " turns.";
                ConditionManager.instance.GiveCondition(
                    pc,
                    GlobalConst.CONDITION.HELD,
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
