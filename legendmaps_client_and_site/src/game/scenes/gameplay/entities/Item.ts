import GlobalConst from "../../../types/globalConst";
import GameUtil from "../../../util/gameUtil";
import { Entity } from "./Entity";
import { EffectD, M_InventoryItem, M_Item, M_ItemMerchant } from "../../../types/globalTypes";

export class Item extends Entity {
    public rarity: GlobalConst.RARITY;

    constructor(kind: string, rarity: GlobalConst.RARITY = GlobalConst.RARITY.NONE) {
        super();
        this.kind = kind;
        this.rarity = rarity;
    }

    GetGraphicName(): string {
        return Item.GraphicFileName(this.kind, this.rarity);
    }

    static GraphicFileName(kind: string, rarity: GlobalConst.RARITY): string {
        let graphic: string = kind.toLowerCase();
        if (rarity != GlobalConst.RARITY.NONE) {
            let rarityNumber: number = GameUtil.GetRarityNumeric(rarity);

            graphic += "_" + rarityNumber;
        }
        graphic += ".png";
        return graphic;
    }

    static GetRange(itemData: M_InventoryItem | M_Item) {
        let primaryEffect: EffectD = itemData.effects[0];
        if (primaryEffect.range > 0) {
            return primaryEffect.range;
        }
        return -1;
    }
}
