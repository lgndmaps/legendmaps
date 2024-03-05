import GlobalConst from "../../types/globalConst";
import MerchantData from "./merchantData";

export default class MerchantPotion extends MerchantData {
    constructor() {
        super(GlobalConst.MERCHANT_TYPES.POTION);
        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 2;
        this.item_types = [GlobalConst.ITEM_BASE_TYPE.POTION];
        this.image = "merchant_potion";
        this.titleCopy = "Potion Merchant";
        this.bodyCopy =
            "The brewer is standing in front of large and elaborate alchemy equipment. In front of him, he has set up a small table where he is selling his potions to the adventurers who are passing through the dungeon. He is holding a small vial of a glowing, green liquid in his hand, and as you approach begins passionately describing its effects with a determined expression on his face.";
    }
}
