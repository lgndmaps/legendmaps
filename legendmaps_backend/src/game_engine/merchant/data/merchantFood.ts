import GlobalConst from "../../types/globalConst";
import MerchantData from "./merchantData";

export default class MerchantFood extends MerchantData {
    constructor() {
        super(GlobalConst.MERCHANT_TYPES.FOOD);
        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 2;
        this.item_types = [GlobalConst.ITEM_BASE_TYPE.FOOD];
        this.image = "merchant_food";
        this.titleCopy = "Food Merchant";
        this.bodyCopy = "The aroma of freshly baked doughtwists wafts towards you from a warmly lit food stall. You are surprised to see a genial baker plying his trade in the depths of this dungeon, but he smiles broadly at you as you approach. \"Welcome, my friend! Will you not warm yourself from the inside with one of my finest creations? They were only just pulled from the oven!\"";
    }
}
