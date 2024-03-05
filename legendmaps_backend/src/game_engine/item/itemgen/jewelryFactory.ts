import { isValidTimestamp } from "@firebase/util";
import { Console } from "console";
import { Intents } from "discord.js";
import Game from "../../game";
import GlobalConst from "../../types/globalConst";
import ArrayUtil from "../../utils/arrayUtil";
import GameUtil from "../../utils/gameUtil";
import MathUtil from "../../utils/mathUtil";
import RandomUtil from "../../utils/randomUtil";
import Effect from "../../effect/effect";
import Item from "../item";
import ItemGenCommon from "./itemGenCommon";
import { EnhancementD, EnhancementChanceTable, ArmorList } from "../../types/types";

/**
 * Generates jewelry items.
 *
 * Singleton! Shared across all servers,
 * static values only.
 */
export default class JewelryFactory {
    private static _instance: JewelryFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    // ring, bracer (wrist), amulet (necklace)

    enhancement_list_lesser: GlobalConst.ITEM_ENHANCEMENTS[];
    enhancement_list_greater: GlobalConst.ITEM_ENHANCEMENTS[];

    enhancement_chance: EnhancementChanceTable = {
        n: [0, 0],
        c: [5, 0],
        u: [25, 0], // 25% chance of 1 enhancement, 0% chance of 2nd
        r: [50, 0],
        e: [80, 25],
        l: [100, 50],
    };

    constructor() {
        // initialize Enhancements List
        this.InitializeEnhancementList();
    }

    private CreateJewelry(
        game: Game,
        kind: GlobalConst.JEWELRY_BASE_TYPE,
        rarity: GlobalConst.RARITY,
        cr: number,
        ascii?,
    ): Item {
        let item: Item = new Item(game);
        item.slot = Item.GetEquipSlotByType(kind as GlobalConst.ITEM_BASE_TYPE);
        item.cname = "Item";
        item.rarity = rarity;
        item.cr = cr;
        item.kind = kind;
        item.nameBase = "Jewelry";
        item.baseType = kind; //redundancy, probably ok? TBD if we can lose baseType
        item.ascii = ascii || ItemGenCommon.GetASCIIbyType(item.baseType);
        return item;
    }

    public CreateRandomJewelry(
        game: Game,
        rarity: GlobalConst.RARITY,
        cr: number,
        basetype?: GlobalConst.JEWELRY_BASE_TYPE,
    ): Item {
        // if item type is unspecified, chose randomly
        if (basetype === undefined) {
            basetype = RandomUtil.instance.fromEnum(GlobalConst.JEWELRY_BASE_TYPE);
        }

        let item = this.CreateJewelry(game, basetype, rarity, cr);
        switch (basetype) {
            case GlobalConst.JEWELRY_BASE_TYPE.NECKLACE:
                item.nameBase = "Amulet";
                break;
            case GlobalConst.JEWELRY_BASE_TYPE.RING:
                item.nameBase = "Ring";
                break;
            case GlobalConst.JEWELRY_BASE_TYPE.WRIST:
                item.nameBase = "Bracer";
                break;
            default:
                break;
        }
        // add enhancement
        let enhancements_list: GlobalConst.ITEM_ENHANCEMENTS[] =
            GameUtil.GetRarityNumeric(rarity) < 3 ? this.enhancement_list_lesser : this.enhancement_list_greater;
        ItemGenCommon.AddRandomEnhancement(item, enhancements_list);

        return item;
    }

    private InitializeEnhancementList() {
        this.enhancement_list_lesser = [
            GlobalConst.ITEM_ENHANCEMENTS.BRAWN,
            GlobalConst.ITEM_ENHANCEMENTS.AGILITY,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT,
            GlobalConst.ITEM_ENHANCEMENTS.CRIT,
            GlobalConst.ITEM_ENHANCEMENTS.DODGE,
            GlobalConst.ITEM_ENHANCEMENTS.BLOCK,
            GlobalConst.ITEM_ENHANCEMENTS.DEFENSE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_ARCANE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_BLADE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_BLUDGEON,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_COLD,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_DIVINE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_ELECTRIC,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_FIRE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_NECROTIC,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_PIERCE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_POISON,
            GlobalConst.ITEM_ENHANCEMENTS.TOHIT,
            GlobalConst.ITEM_ENHANCEMENTS.COND_LUCKY,
            GlobalConst.ITEM_ENHANCEMENTS.COND_INSIGHT,
        ];
        this.enhancement_list_greater = [
            GlobalConst.ITEM_ENHANCEMENTS.BRAWN,
            GlobalConst.ITEM_ENHANCEMENTS.AGILITY,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT,
            GlobalConst.ITEM_ENHANCEMENTS.CRIT,
            GlobalConst.ITEM_ENHANCEMENTS.DODGE,
            GlobalConst.ITEM_ENHANCEMENTS.BLOCK,
            GlobalConst.ITEM_ENHANCEMENTS.DEFENSE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_ARCANE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_BLADE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_BLUDGEON,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_COLD,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_DIVINE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_ELECTRIC,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_FIRE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_NECROTIC,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_PIERCE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_POISON,
            GlobalConst.ITEM_ENHANCEMENTS.TOHIT,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT_PLUS,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE_PLUS,
        ];
    }
}
