import GlobalConst from "../../types/globalConst";

export default class MerchantData {
    allowRandomSpawns: boolean = false;
    randomSpawnWeight: number = 0; //higher is more frequent
    kind: GlobalConst.MERCHANT_TYPES; //unique key name for each
    ascii: string = "@";
    mapGraphic: string = "npc";
    image: string;
    titleCopy: string;
    bodyCopy: string;
    inventory_count: number = 4;
    item_types: GlobalConst.ITEM_BASE_TYPE[]; // todo probability table?

    constructor(kind: GlobalConst.MERCHANT_TYPES) {
        this.kind = kind;
    }
}
