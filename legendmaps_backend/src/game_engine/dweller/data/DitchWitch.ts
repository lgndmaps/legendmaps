import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";

export class DitchWitch extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.DITCH_WITCH,
            GlobalConst.DWELLER_ASCII.DITCH_WITCH,
            GlobalConst.DWELLER_PHYLUM.HUMANOID,
        );
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["ditch witch", "ditch witch", "ditch witch", "ditch witch", "ditch witch", "ditch witch"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_number_appearing = [1, 1, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.ARCANE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.DIVINE];

        this.basic_attack = new DwellerAttackData(this, "kris dagger");
        this.basic_attack.msg_hit = ["The [name] stabs.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;
        this.special_attack_cooldown = 55;
        this.special_attack_description = "Curse of Weakness. Lowers target brawn.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.5);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.9,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.9,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        let rangeToPlayer = dweller.game.dungeon.GetTileDistance(dweller.mapPos, dweller.game.dungeon.character.mapPos);
        if (
            rangeToPlayer > 1 &&
            dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 4) &&
            RandomUtil.instance.percentChance(60)
        ) {
            //if at range she uses ranged necrotic attack
            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "ancient rot");
            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;
            special_attack_data.range = 4;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
            special_attack_data.setBaseDamage(
                DwellerAttackData.BASE_DAMAGE_MIN * 0.7,
                DwellerAttackData.BASE_DAMAGE_MAX * 0.7,
            ); //Low damage
            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.EPIC;

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, special_attack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();

            return true;
        }

        if (RandomUtil.instance.percentChance(40)) {
            // only uses it half the time it's available
            return false;
        }

        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldowna
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " chants the words of a foul curse.";
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
                result = "You feel weak! -" + loss + " brawn for " + dur + " turns.";
                this.ApplyCurseEffect(
                    dweller.game.dungeon.character,
                    "curse of weakness",
                    GlobalConst.ATTRIBUTES.BRAWN,
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
