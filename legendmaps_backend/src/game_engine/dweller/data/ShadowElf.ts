import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names, M_TurnEvent_PlayerMove } from "../../types/globalTypes";
import CombatAttack from "../../combat/combatAttack";

export class ShadowElf extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.SHADOW_ELF,
            GlobalConst.DWELLER_ASCII.SHADOW_ELF,
            GlobalConst.DWELLER_PHYLUM.FEY,
        );
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["Shadow Elf", "Shadow Elf", "Shadow Elf", "Shadow Elf", "Shadow Elf", "Shadow Elf"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.NECROTIC];

        this.basic_attack = new DwellerAttackData(this, "silver sword");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 12;
        this.special_attack_description = "Sapping Poison. The poisoned blade reduces agility.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.5);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1.5);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.5);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.5);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MIN * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }

        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " coats its blade in a strange substance.";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else if (RandomUtil.instance.percentChance(15 + GlobalConst.GetGenericBagsBonus(pc.brawn) * 2)) {
                result = "Your resist the effects (brawn).";
                success = false;
            } else {
                success = true;
            }

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();

            if (attack.$isHit) {
                dweller.turnSpecialLastUsed = dweller.game.data.turn;
                if (success) {
                    let dur = 50 + dweller.level * 10;
                    let loss = 4 + dweller.level;
                    result = "You feel clumsy! -" + loss + " agility for " + dur + " turns.";
                    this.ApplyCurseEffect(
                        dweller.game.dungeon.character,
                        "clumsy curse",
                        GlobalConst.ATTRIBUTES.AGILITY,
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
            } else {
                return true;
            }
        }
        return false;
    }
}
