import SerializableGameObject from "../base_classes/serializableGameObject";
import type Game from "../game";
import GlobalConst from "../types/globalConst";
import { InventoryItemD, ItemD } from "../types/globalTypes";
import ObjectUtil from "../utils/objectUtil";
import Character from "../character/character";
import Item from "./item";

class InventoryItem extends SerializableGameObject implements InventoryItemD {
    public item: Item;
    public equippedslot: GlobalConst.EQUIPMENT_SLOT = GlobalConst.EQUIPMENT_SLOT.NONE;
    public index: number = -1;

    constructor(game: Game, item: Item = null, json: InventoryItemD | "" = "") {
        super(game, json);

        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            this.item = new Item(this.game, json.item);

            //  console.log("loading existing item " + JSON.stringify(json));
        } else {
            if (item.slot === undefined) throw new Error("SLOT must be set on a new item");
            //console.log("INVENTORY ITEM MADE " + item.slot);
            this.item = item;
        }
    }

    //inventory item should always return its child item id
    public GetId(): number {
        return this.item.GetId();
    }
}

export default InventoryItem;
