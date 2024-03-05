import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import Spells from "../../effect/spells";
import RandomUtil from "../../utils/randomUtil";

export class GiantRat extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.GIANT_RAT,
            GlobalConst.DWELLER_ASCII.GIANT_RAT,
            GlobalConst.DWELLER_PHYLUM.BEAST,
        );
        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.LOW;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["rat", "rat", "giant rat", "rat captain", "rat champion", "rat king"];

        this.level_number_appearing = [2, 4, 2, 4, 6, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.POISON];

        this.basic_attack = new DwellerAttackData(this, "bite");
        this.basic_attack.msg_hit = ["The [name] rapidly bites.", "The [name] sharpens its teeth on your bone."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;

        this.special_attack_cooldown = 20;
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

        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            let itemToSteal = null;

            for (let i = 0; i < dweller.game.dungeon.character.inventory.length; i++) {
                if (dweller.game.dungeon.character.inventory[i].item.baseType == GlobalConst.ITEM_BASE_TYPE.FOOD) {
                    itemToSteal = dweller.game.dungeon.character.inventory[i];
                }
            }

            if (itemToSteal == null) {
                return false;
            }
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " tries to steal your " + itemToSteal.item.name + ". ";
            let success: boolean = true;
            let result: string = "";

            if (RandomUtil.instance.percentChance(75)) {
                result = "The " + dweller.name + " eats your " + itemToSteal.item.name + "!";
                pc.RemoveItem(itemToSteal);
            } else {
                result = "You manage to hold on to your food!";
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
