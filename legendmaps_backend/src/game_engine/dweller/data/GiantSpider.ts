import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import ConditionManager from "../../effect/conditionManager";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";

export class GiantSpider extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.GIANT_SPIDER,
            GlobalConst.DWELLER_ASCII.GIANT_SPIDER,
            GlobalConst.DWELLER_PHYLUM.BEAST,
        );
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.rarity = GlobalConst.RARITY.UNCOMMON;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "big spider",
            "big spider",
            "giant spider",
            "giant spider",
            "massive spider",
            "massive spider",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 2, 2, 2, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.POISON];

        this.basic_attack = new DwellerAttackData(this, "poison fangs");
        this.basic_attack.msg_hit = ["The [name] bites."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;

        this.special_attack_cooldown = 12;
        this.special_attack_description = "Web. Spits a web that holds player in place.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1);
        this.setBaseHp(DwellerData.BASE_HP * 0.8);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 1.1,
            DwellerAttackData.BASE_DAMAGE_MAX * 1.1,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 2)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " spits a web at you.";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(30)) {
                result = "You are immune (skill: cockatrice blood).";
            } else if (pc.traitIds.includes(55)) {
                result = "You resist (trait: unstoppable).";
            } else if (RandomUtil.instance.percentChance(20 + GlobalConst.GetGenericBagsBonus(pc.agility) * 2)) {
                result = "Your manage to dodge (agility).";
                success = false;
            } else {
                success = true;
            }

            if (success) {
                let holdfor = 4 + dweller.level;
                result = "You are held by the web! Can not move for " + (holdfor - 1) + " turns.";
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
