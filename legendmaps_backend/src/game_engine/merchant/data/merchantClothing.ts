import GlobalConst from "../../types/globalConst";
import MerchantData from "./merchantData";

export default class MerchantClothing extends MerchantData {
    constructor() {
        super(GlobalConst.MERCHANT_TYPES.CLOTHING);
        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 1;
        this.item_types = [
            GlobalConst.ITEM_BASE_TYPE.HAT,
            GlobalConst.ITEM_BASE_TYPE.ROBES,
            GlobalConst.ITEM_BASE_TYPE.BOOTS,
            GlobalConst.ITEM_BASE_TYPE.ARMOR_LIGHT,
        ];
        this.image = "merchant_clothing";

        this.titleCopy = "A Clothing Merchant, of sorts";
        this.bodyCopy =
            'You turn the corner to find a man, stripped bare, with various items of clothing strewn about his feet. "You! You look to be about my size! I\'ve renounced material possessions and dedicated my life to the goddess Kleuf. Do you want them? For a small offering to Kleuf, they could be yours!"';
    }
}
