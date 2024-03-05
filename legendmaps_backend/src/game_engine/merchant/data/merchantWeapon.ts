import GlobalConst from "../../types/globalConst";
import MerchantData from "./merchantData";

export default class MerchantWeapon extends MerchantData {
    constructor() {
        super(GlobalConst.MERCHANT_TYPES.WEAPON);
        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 2;
        this.item_types = [
            GlobalConst.ITEM_BASE_TYPE.SWORD,
            GlobalConst.ITEM_BASE_TYPE.AXE,
            GlobalConst.ITEM_BASE_TYPE.BOW,
            GlobalConst.ITEM_BASE_TYPE.DAGGER,
            GlobalConst.ITEM_BASE_TYPE.HAMMER,
            GlobalConst.ITEM_BASE_TYPE.SPEAR,
            GlobalConst.ITEM_BASE_TYPE.STAFF,
            GlobalConst.ITEM_BASE_TYPE.WAND,
        ];
        this.image = "merchant_weapon";

        this.titleCopy = "Weapon Merchant";
        this.bodyCopy = 'You come across a short, slender old woman with a leather apron inspecting a greatsword nearly as tall as herself. On the floor in front of her is a canvas roll displaying a number of well-crafted weapons. "In need of a new weapon, adventurer?" She rasps. "I think you will find my selection enticing and my prices fair."';
    }
}
