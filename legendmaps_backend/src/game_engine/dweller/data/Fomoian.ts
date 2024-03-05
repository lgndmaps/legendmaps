import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import RandomUtil from "../../utils/randomUtil";

export class Fomoian extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.FOMOIAN, GlobalConst.DWELLER_ASCII.FOMOIAN, GlobalConst.DWELLER_PHYLUM.DEMON);
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.rarity = GlobalConst.RARITY.RARE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "minor fomoian",
            "minor fomoian",
            "fomoian",
            "greater fomoian",
            "high fomoian",
            "high fomoian",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 2, 1, 1, 2, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.NECROTIC];
        this.immunities = [];
        this.vulnerabilities = [];

        this.basic_attack = new DwellerAttackData(this, "deadly hook");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 25;
        this.special_attack_description = "Lose Hope. Curses spirit.";
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
            //still on cooldown
            return false;
        }

        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " moans about all it has missed.";
            let success: boolean = false;
            let result: string = "";
            if (pc.isImmune(GlobalConst.DAMAGE_TYPES.ARCANE)) {
                result = "You are immune to arcane effects!";
            } else if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else {
                success = true;
            }

            if (success) {
                let dur = 50 + dweller.level * 10;
                let loss = 4 + dweller.level;
                result = "You feel hopeless! -" + loss + " spirit for " + dur + " turns.";
                this.ApplyCurseEffect(
                    dweller.game.dungeon.character,
                    "hopeless curse",
                    GlobalConst.ATTRIBUTES.SPIRIT,
                    dur,
                    loss,
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
