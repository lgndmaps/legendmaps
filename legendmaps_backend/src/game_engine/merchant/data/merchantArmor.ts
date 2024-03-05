import GlobalConst from "../../types/globalConst";
import MerchantData from "./merchantData";

export default class MerchantArmor extends MerchantData {
    constructor() {
        super(GlobalConst.MERCHANT_TYPES.ARMOR);
        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 2;
        this.item_types = [
            GlobalConst.ITEM_BASE_TYPE.ARMOR_HEAVY,
            GlobalConst.ITEM_BASE_TYPE.ARMOR_LIGHT,
            GlobalConst.ITEM_BASE_TYPE.BOOTS,
            GlobalConst.ITEM_BASE_TYPE.SHIELD,
            GlobalConst.ITEM_BASE_TYPE.HELM,
        ];
        this.image = "merchant_armor";

        this.titleCopy = "Armor Merchant";
        this.bodyCopy = "The clang of a smith's hammer against the anvil reverberates down the hallway as you draw near. 'If you wish to make fine armor, you must be willing to bear the noise and the heat!' shouts the smith over his own hammer blows. 'Nothing that will save you in battle is made by trembling hands.' The armorer gestures to a selection of defensive gear on a small rack next to his forge...";
    }
}
