import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";

export class Brownie extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.BROWNIE, GlobalConst.DWELLER_ASCII.BROWNIE, GlobalConst.DWELLER_PHYLUM.FEY);
        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["brownie", "brownie", "brownie rogue", "brownie rogue", "brownie king", "brownie king"];

        this.level_number_appearing = [1, 2, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        //high dodge, high def, low hp
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.2);
        this.setBaseHp(DwellerData.BASE_HP * 0.7);
        this.setBaseDef(DwellerData.BASE_DEF * 1.2);

        this.resistances = [GlobalConst.DAMAGE_TYPES.ARCANE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.BLADE];

        this.basic_attack = new DwellerAttackData(this, "stiletto");
        this.basic_attack.msg_hit = ["The [name] stabs.", "The [name] jabs with its stiletto."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;

        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;
        //high to hit and crit, lower damage
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 2);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.2);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.75,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.75,
        );
        this.special_attack_cooldown = 25;
        this.special_attack_description = "Curse of the Fool: lowers guile by a significant amount for the duration";
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " winks at you and cackles, swirling magic fills the air.";
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
                let guileloss = 4 + dweller.level;
                result = "You feel clueless! -" + guileloss + " guile for " + dur + " turns.";
                this.ApplyCurseEffect(
                    dweller.game.dungeon.character,
                    "fool's curse",
                    GlobalConst.ATTRIBUTES.GUILE,
                    dur,
                    guileloss,
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
