import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import ConditionManager from "../../effect/conditionManager";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import MathUtil from "../../utils/mathUtil";
import GameUtil from "../../utils/gameUtil";

export class GiantWasp extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.GIANT_WASP,
            GlobalConst.DWELLER_ASCII.GIANT_WASP,
            GlobalConst.DWELLER_PHYLUM.BEAST,
        );
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["big wasp", "big wasp", "giant wasp", "giant wasp", "wasp queen", "wasp queen"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 2, 3, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.PIERCE];

        this.basic_attack = new DwellerAttackData(this, "sting");
        this.basic_attack.msg_hit = ["The [name] stings."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 25;
        this.special_attack_description = "Stunning Venom. Venom can leave victims unable to act.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.3);
        this.setBaseHp(DwellerData.BASE_HP * 0.5);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.2);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.2);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.8,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.6,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }

        if (RandomUtil.instance.percentChance(40)) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + "'s stinger drips with venom.";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(30)) {
                result = "You are immune (skill: cockatrice blood).";
            } else if (pc.traitIds.includes(55)) {
                result = "You resist (trait: unstoppable).";
            } else if (RandomUtil.instance.percentChance(20 + GlobalConst.GetGenericBagsBonus(pc.brawn) * 2)) {
                result = "Your manage to resist (brawn).";
                success = false;
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
