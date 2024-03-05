import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import ConditionManager from "../../effect/conditionManager";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";

export class GainsGoblin extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.GAINS_GOBLIN,
            GlobalConst.DWELLER_ASCII.GAINS_GOBLIN,
            GlobalConst.DWELLER_PHYLUM.HUMANOID,
        );
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "gains goblin",
            "gains goblin",
            "gains goblin raider",
            "gains goblin raider",
            "gains goblin king",
            "gains goblin king",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 2, 2, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.POISON];

        this.basic_attack = new DwellerAttackData(this, "bite");
        this.basic_attack.msg_hit = ["The [name] bites.", "The [name] chomps."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;

        this.special_attack_cooldown = 8;
        this.special_attack_description = "Gold Consumption. The goblin will consume your gold and heal itself.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(10);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.7,
            DwellerAttackData.BASE_DAMAGE_MAX * 1.2,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }

        if (dweller.hp >= dweller.hpmax) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            let pc = dweller.game.dungeon.character;
            if (pc.gold <= 0) {
                return false;
            }
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let setup: string = "The " + dweller.name + " opens its mouth, your coinpurse begins to shake";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else {
                success = true;
            }

            if (success) {
                let g = dweller.level * 25 + RandomUtil.instance.int(250, 350);
                if (g > pc.gold) {
                    g = pc.gold;
                }

                result = "The " + dweller.name + " swallows " + g + " of your gold coins! It looks healthier!";

                dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                    id: dweller.id,
                    name: dweller.name,
                    kind: "Dweller",
                    setupDesc: setup,
                    resultDesc: result,
                } as M_TurnEvent_DwellerSpecial);

                dweller.doHeal(Math.floor(dweller.hpmax * 0.2));
            } else {
                dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                    id: dweller.id,
                    name: dweller.name,
                    kind: "Dweller",
                    setupDesc: setup,
                    resultDesc: result,
                } as M_TurnEvent_DwellerSpecial);
            }

            return true;
        }
    }
}
