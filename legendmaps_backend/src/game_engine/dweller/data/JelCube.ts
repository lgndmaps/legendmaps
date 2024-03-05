import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import Character from "../../character/character";
import MathUtil from "../../utils/mathUtil";
import ConditionManager from "../../effect/conditionManager";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";

export class JelCube extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.JELCUBE, GlobalConst.DWELLER_ASCII.JELCUBE, GlobalConst.DWELLER_PHYLUM.OOZE);
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "jel cube",
            "jel cube",
            "big jel cube",
            "huge jel cube",
            "giant jel cube",
            "giant jel cube",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [GlobalConst.DAMAGE_TYPES.ELECTRIC, GlobalConst.DAMAGE_TYPES.BLUDGEON];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.BLADE];

        this.basic_attack = new DwellerAttackData(this, "absorb");
        this.basic_attack.msg_hit = ["The [name] smashes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;

        this.special_attack_cooldown = 10;
        this.special_attack_description = "Stunning Slime. The strange slime on the cube will stun victims.";
        //VARIATIONS
        this.setBaseDodge(0);
        this.setBaseHp(DwellerData.BASE_HP * 1.4);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.8,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.8,
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
            let setup: string = "The " + dweller.name + " excretes a glowing slime from its surface.";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(30)) {
                result = "You are immune (skill: cockatrice blood).";
            } else if (pc.traitIds.includes(55)) {
                result = "You resist (trait: unstoppable).";
            } else if (RandomUtil.instance.percentChance(20 + GlobalConst.GetGenericBagsBonus(pc.agility) * 2)) {
                result = "Your manage to avoid it touching you (agility).";
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
