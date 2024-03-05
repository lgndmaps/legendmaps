import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";

export class NightFather extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.NIGHT_FATHER,
            GlobalConst.DWELLER_ASCII.NIGHT_FATHER,
            GlobalConst.DWELLER_PHYLUM.UNDEAD,
        );
        this.rarity = GlobalConst.RARITY.LEGENDARY;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "night father",
            "night father",
            "night father",
            "night father",
            "night father",
            "night father",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.COLD, GlobalConst.DAMAGE_TYPES.ARCANE];
        this.immunities = [GlobalConst.DAMAGE_TYPES.NECROTIC];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.DIVINE];

        this.basic_attack = new DwellerAttackData(this, "arcane bolt");
        this.basic_attack.msg_hit = ["The [name] fires an arcane bolt."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 3;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.ARCANE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 12;
        this.special_attack_description = "None.";
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
            return false;
        }

        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " chants an ancient curse.";
            let success: boolean = false;
            let result: string = "";
            if (pc.isImmune(GlobalConst.DAMAGE_TYPES.NECROTIC)) {
                result = "You are immune to necrotic effects!";
            } else if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else if (RandomUtil.instance.percentChance(5 + GlobalConst.GetGenericBagsBonus(pc.spirit) * 3)) {
                result = "You manage to resist (spirit).";
                success = false;
            } else {
                success = true;
            }

            if (success) {
                let dur = 100 + dweller.level * 25;
                let loss = 6 + dweller.level;
                result = "You feel weak & clumsy! -" + loss + " to brawn & agility for " + dur + " turns.";
                this.ApplyCurseEffect(
                    dweller.game.dungeon.character,
                    "ancient curse",
                    GlobalConst.ATTRIBUTES.BRAWN,
                    dur,
                    loss,
                );
                this.ApplyCurseEffect(
                    dweller.game.dungeon.character,
                    "ancient curse",
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
        }
        return false;
    }
}
