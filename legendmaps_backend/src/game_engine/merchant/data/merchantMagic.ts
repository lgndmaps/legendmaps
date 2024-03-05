import GlobalConst from "../../types/globalConst";
import MerchantData from "./merchantData";

export default class MerchantMagic extends MerchantData {
    constructor() {
        super(GlobalConst.MERCHANT_TYPES.MAGIC);
        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 1;
        this.item_types = [
            GlobalConst.ITEM_BASE_TYPE.POTION,
            GlobalConst.ITEM_BASE_TYPE.SCROLL,
            GlobalConst.ITEM_BASE_TYPE.ROBES,
            GlobalConst.ITEM_BASE_TYPE.RING,
            GlobalConst.ITEM_BASE_TYPE.NECKLACE,
            GlobalConst.ITEM_BASE_TYPE.WRIST,
        ];
        this.image = "merchant_magic";

        this.titleCopy = "Magic Item Merchant";
        this.bodyCopy = "Behind a wooden table stands (floats?) a robed figure, his hood completely obscuring his face. He extends an impossibly pale hand toward the array of items on the table. Oh, gods, it's one of THOSE merchants. Dead silent, deeply creepy, totally unhelpful. What kind of business model is this?"

    }

    // addOption(opt: StoryEventOption) {
    //     let index: number = this.options.length;
    //     this.options.push(opt);
    //     opt.index = index;
    // }
}
