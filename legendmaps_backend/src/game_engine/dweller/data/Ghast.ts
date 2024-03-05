import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import RandomUtil from "../../utils/randomUtil";

export class Ghast extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.GHAST, GlobalConst.DWELLER_ASCII.GHAST, GlobalConst.DWELLER_PHYLUM.UNDEAD);
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["lesser ghast", "lesser ghast", "ghast", "elder ghast", "ancient ghast", "ancient ghast"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.NECROTIC];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.DIVINE];

        this.basic_attack = new DwellerAttackData(this, "piercing wail");
        this.basic_attack.msg_hit = ["The [name] wails."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 3;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 25;
        this.special_attack_description = "Ghastly Curse. Greatly reduces spirit for a time.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.8);
        this.setBaseHp(DwellerData.BASE_HP * 0.8);
        this.setBaseDef(DwellerData.BASE_DEF * 1.2);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.8,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.8,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }

        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " releases a woeful moan.";
            let success: boolean = false;
            let result: string = "";
            if (pc.isImmune(GlobalConst.DAMAGE_TYPES.NECROTIC)) {
                result = "You are immune to necrotic effects!";
            } else if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else {
                success = true;
            }

            if (success) {
                let dur = 50 + dweller.level * 10;
                let loss = 6 + dweller.level;
                result = "You feel hopeless! -" + loss + " spirit for " + dur + " turns.";
                this.ApplyCurseEffect(
                    dweller.game.dungeon.character,
                    "ghastly curse",
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
