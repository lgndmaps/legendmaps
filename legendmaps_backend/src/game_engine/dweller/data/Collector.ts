import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Character from "../../character/character";
import {M_TurnEvent_DwellerSpecial, M_TurnEvent_Names} from "../../types/globalTypes";
import Spells from "../../effect/spells";

export class Collector extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.COLLECTOR,
            GlobalConst.DWELLER_ASCII.COLLECTOR,
            GlobalConst.DWELLER_PHYLUM.DEMON,
        );
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "lil collector",
            "lil collector",
            "collector",
            "collector",
            "high collector",
            "high collector",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.ARCANE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.NECROTIC];

        this.basic_attack = new DwellerAttackData(this, "club");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLUDGEON;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;

        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.5); //do not crit
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.9);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 1.3,
            DwellerAttackData.BASE_DAMAGE_MAX * 1.3,
        );
        //low crit, low hit, high damage

        this.special_attack_cooldown = 40;
        this.special_attack_description = "Thief: steals item and teleports away.";
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }

        if (dweller.carriedItem != null) {
            return false;
        }

        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            let itemToSteal = null;

            //prefers potions
            for (let i = 0; i < dweller.game.dungeon.character.inventory.length; i++) {
                if (dweller.game.dungeon.character.inventory[i].item.baseType == GlobalConst.ITEM_BASE_TYPE.POTION) {
                    itemToSteal = dweller.game.dungeon.character.inventory[i];
                }
            }

            //Failing that, scrolls or food
            if (itemToSteal == null) {
                for (let i = 0; i < dweller.game.dungeon.character.inventory.length; i++) {
                    if (
                        dweller.game.dungeon.character.inventory[i].item.baseType ==
                        GlobalConst.ITEM_BASE_TYPE.SCROLL ||
                        dweller.game.dungeon.character.inventory[i].item.baseType == GlobalConst.ITEM_BASE_TYPE.FOOD
                    ) {
                        itemToSteal = dweller.game.dungeon.character.inventory[i];
                    }
                }
            }

            if (itemToSteal == null) {
                return false;
            }

            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The " + dweller.name + " steals your " + itemToSteal.item.name + ".";
            let success: boolean = true;
            let result: string = "";

            if (success) {
                if (itemToSteal != null) {
                    pc.RemoveItem(itemToSteal);
                    dweller.carriedItem = itemToSteal.item;
                }

                result = "Loot in hand, the " + dweller.name + " teleports away.";
            }
            //hack to prevent teleport from overwriting position too early.
            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_MOVE, {
                id: dweller.id,
                kind: dweller.kind,
                name: dweller.name,
                x: dweller.mapPos.x,
                y: dweller.mapPos.y,
            });

            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                id: dweller.id,
                name: dweller.name,
                kind: "Dweller",
                setupDesc: setup,
                resultDesc: result,
            } as M_TurnEvent_DwellerSpecial);

            Spells.Teleport(dweller.game, dweller);
            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_MOVE, {
                id: dweller.id,
                kind: dweller.kind,
                name: dweller.name,
                x: -1,
                y: -1,
            });
            return true;
        }
        return false;
    }
}
