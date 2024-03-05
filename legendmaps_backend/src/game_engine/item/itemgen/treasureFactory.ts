import { isValidTimestamp } from "@firebase/util";
import { max } from "bn.js";
import type Game from "../../game";
import GlobalConst from "../../types/globalConst";
import GameUtil from "../../utils/gameUtil";
import RandomUtil from "../../utils/randomUtil";
import Effect from "../../effect/effect";
import Item from "../item";
import ItemGenCommon from "./itemGenCommon";

/**
 * Generates treasure items.
 *
 * Singleton! Shared across all servers,
 * static values only.
 */
export default class TreasureFactory {
    private static _instance: TreasureFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    static BASE_GOLD_CR_MULT: number = 5;
    static MAX_GOLD_MULT: number = 10;
    static COIN_BAG_MULT: number = 3;
    static GEM_MULT: number = 3; // GEMS get rarity factored in so are higher value than coin sacks despite the multiplier being the same

    static BASE_KEYS_MULT: number = 1;
    static MAX_KEYS_MULT: number = 2;

    private CreateTreasure(
        game: Game,
        kind: GlobalConst.TREASURE_BASE_TYPE,
        name: string,
        amount_base: number,
        amount_max: number,
    ): Item {
        let item: Item = new Item(game);
        item.cname = "Item";
        item.kind = kind;
        item.baseType = kind; //this redundancy ok
        item.ascii = ItemGenCommon.GetASCIIbyType(kind);
        item.nameBase = name;

        if (kind == GlobalConst.ITEM_BASE_TYPE.KEY) {
            item.AddNewEffect(
                GlobalConst.EFFECT_TYPES.KEYS,
                GlobalConst.EFFECT_TRIGGERS.PICKUP,
                amount_base,
                amount_max,
            );
        } else {
            item.AddNewEffect(
                GlobalConst.EFFECT_TYPES.GOLD,
                GlobalConst.EFFECT_TRIGGERS.PICKUP,
                amount_base,
                amount_max,
            );
        }
        return item;
    }

    public CreateRandomTreasure(
        game: Game,
        rarity: GlobalConst.RARITY,
        cr: number,
        kind?: GlobalConst.TREASURE_BASE_TYPE,
    ) {
        let treasure: Item;
        if (!kind) {
            kind = RandomUtil.instance.fromArray([
                GlobalConst.TREASURE_BASE_TYPE.COINBAG,
                GlobalConst.TREASURE_BASE_TYPE.COINS,
                GlobalConst.TREASURE_BASE_TYPE.GEM,
            ]);
        }
        // switch by type
        switch (kind) {
            case GlobalConst.TREASURE_BASE_TYPE.COINBAG:
                treasure = this.CreateCoinBagbyCR(game, cr);
                break;
            case GlobalConst.TREASURE_BASE_TYPE.COINS:
                treasure = this.CreateCoinPilebyCR(game, cr);
                break;
            case GlobalConst.TREASURE_BASE_TYPE.KEY:
                treasure = this.CreateKeysbyRarity(game, rarity, cr);
                break;
            case GlobalConst.TREASURE_BASE_TYPE.GEM:
                treasure = this.CreateGembyCR(game, cr, rarity);
                break;
            default:
                console.log("OOPS -- failed to create a treasure of type " + kind);
                break;
        }
        return treasure;
    }

    CreateCoinPile(game: Game, base_amount: number, max_amount): Item {
        return this.CreateTreasure(game, GlobalConst.ITEM_BASE_TYPE.COINS, "few coins", base_amount, max_amount);
    }

    CreateCoinPilebyCR(game: Game, cr: number): Item {
        let base_amount = cr * TreasureFactory.BASE_GOLD_CR_MULT;
        let max_amount = base_amount * TreasureFactory.MAX_GOLD_MULT;
        return this.CreateCoinPile(game, base_amount, max_amount);
    }

    CreateCoinBag(game: Game, base_amount: number, max_amount): Item {
        return this.CreateTreasure(game, GlobalConst.ITEM_BASE_TYPE.COINBAG, "sack of coins", base_amount, max_amount);
    }

    CreateGem(game: Game, base_amount: number, max_amount): Item {
        return this.CreateTreasure(game, GlobalConst.ITEM_BASE_TYPE.GEM, "sparkling gem", base_amount, max_amount);
    }

    CreateGembyCR(game: Game, cr: number, rarity: GlobalConst.RARITY): Item {
        let base_amount = (cr + GameUtil.GetRarityNumeric(rarity)) * TreasureFactory.BASE_GOLD_CR_MULT;
        let max_amount = base_amount * TreasureFactory.MAX_GOLD_MULT * TreasureFactory.GEM_MULT;
        return this.CreateGem(game, base_amount, max_amount);
    }

    CreateCoinBagbyCR(game: Game, cr: number): Item {
        let base_amount = cr * TreasureFactory.BASE_GOLD_CR_MULT;
        let max_amount = base_amount * TreasureFactory.MAX_GOLD_MULT * TreasureFactory.COIN_BAG_MULT;
        return this.CreateCoinBag(game, base_amount, max_amount);
    }

    CreateKeys(game: Game, base_amount: number, max_amount: number): Item {
        base_amount = 1;
        if (max_amount > 2) max_amount = 2; //never more than 2, key economy already too hard to balance.

        let k: Item = this.CreateTreasure(game, GlobalConst.ITEM_BASE_TYPE.KEY, "key", base_amount, max_amount);

        if (k.GetFirstEffectByType(GlobalConst.EFFECT_TYPES.KEYS).$amount > 1) {
            k.nameBase = "couple keys";
        }
        return k;
    }

    CreateKeysbyRarity(game: Game, rarity: GlobalConst.RARITY, cr: number): Item {
        let base_amount = GameUtil.GetRarityNumeric(rarity) * TreasureFactory.BASE_KEYS_MULT;
        let max_amount = (base_amount + cr) * TreasureFactory.MAX_KEYS_MULT;

        return this.CreateKeys(game, base_amount, max_amount);
    }
}
