import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import RandomUtil from "../../utils/randomUtil";

export class Mirthcreant extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.MIRTHCREANT,
            GlobalConst.DWELLER_ASCII.MIRTHCREANT,
            GlobalConst.DWELLER_PHYLUM.FEY,
        );
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "mirthcreant",
            "mirthcreant jester",
            "mirthcreant joker",
            "mirthcreant fool",
            "mirthcreant",
            "mirthcreant",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.ARCANE];
        this.immunities = [];
        this.vulnerabilities = [];

        this.basic_attack = new DwellerAttackData(this, "sparking blast");
        this.basic_attack.msg_hit = ["The [name] shoots a sparking blast."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 3;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.ELECTRIC;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 25;
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
            //still on cooldown
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " mocks you & laughs with delight, magic powers its words.";
            let success: boolean = false;
            let result: string = "";
            if (pc.isImmune(GlobalConst.DAMAGE_TYPES.ARCANE)) {
                result = "You are immune to arcane effects!";
            } else if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else if (RandomUtil.instance.percentChance(20 + GlobalConst.GetGenericBagsBonus(pc.guile) * 3)) {
                result = "The mirthcreant's insults have no effect (guile).";
                success = false;
            } else {
                success = true;
            }

            if (success) {
                let dur = 50 + dweller.level * 10;
                let guileloss = 2 + dweller.level;
                result = "You feel useless! -" + guileloss + " to all attributes for " + dur + " turns.";
                this.ApplyCurseEffect(dweller.game.dungeon.character, "useless", "all", dur, guileloss);
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
