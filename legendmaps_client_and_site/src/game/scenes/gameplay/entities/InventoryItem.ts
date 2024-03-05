import GlobalConst from "../../../types/globalConst";
import {EffectD, M_InventoryItem} from "../../../types/globalTypes";
import GameUtil from "../../../util/gameUtil";

export default class InventoryItem {
    itemData: M_InventoryItem;

    constructor(itemData: M_InventoryItem) {
        this.itemData = itemData;
    }

    public get id(): number {
        return this.itemData.id;
    }

    public get name(): string {
        return this.itemData.name;
    }

    //returns -1 if range is not valid for this item
    getRange(): number {
        let primaryEffect: EffectD = this.itemData.effects[0];
        if (primaryEffect.range > 0) {
            return primaryEffect.range;
        }
        return -1;
    }

    //TODO: This is redudant with GetGraphic in Item, need to separate Entity dependency maybe
    GetGraphicName(): string {
        let graphic: string = this.itemData.kind.toLowerCase();
        if (this.itemData.rarity != GlobalConst.RARITY.NONE) {
            let rarityNumber: number = GameUtil.GetRarityNumeric(this.itemData.rarity);
            if (rarityNumber == 0) {
                //no graphic for common items currently, use uncommon
                // rarityNumber = 1;
            }
            graphic += "_" + rarityNumber;
        }
        graphic += ".png";
        return graphic;
    }

    IsUsable(): boolean {
        for (let e = 0; e < this.itemData.effects.length; e++) {
            if (this.itemData.effects[e].trigger == GlobalConst.EFFECT_TRIGGERS.USE) {
                return true;
            }
        }
        return false;
    }

    GetPrimaryDamageType(): GlobalConst.DAMAGE_TYPES | "" {
        if (this.itemData.slot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
            for (let e = 0; e < this.itemData.effects.length; e++) {
                if (
                    this.itemData.effects[e].type == GlobalConst.EFFECT_TYPES.DAMAGE &&
                    this.itemData.effects[e].damage_type != undefined
                ) {
                    return this.itemData.effects[e].damage_type;
                }
            }
        }

        return "";
    }
}
