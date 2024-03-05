import {M_Char, M_InventoryItem} from "../../../types/globalTypes";
import {GameMapTile} from "../map/GameMapTile";
import {Effect} from "./Effect";
import InventoryItem from "./InventoryItem";
import {EntityLiving} from "./EntityLiving";
import GlobalConst from "../../../types/globalConst";
import Condition from "./Condition";

export class PlayerCharacter extends EntityLiving implements M_Char {
    static GRAPHIC_NAME = "player.png";
    static ENTITY_NAME = "Character";

    private _inventory: InventoryItem[];
    public receivedFirstUpdate: boolean = false; //failsafe to prevent screens from accessing data early.

    hpmax: number;
    br: number;
    ag: number;
    gu: number;
    sp: number;
    hunger: number;
    gold: number;
    keys: number;
    def: number;
    dodge: number;
    block: number;
    first_name: string;
    last_name: string;
    full_name: string;
    tokenId: number;
    traits: string[];
    skills: string[];
    effects: Effect[];
    conditions: Condition[];
    level: number = 1;

    debugLastInventoryUpdate: M_InventoryItem[];

    GetGraphicName(): string {
        return PlayerCharacter.GRAPHIC_NAME;
    }

    MoveTo(newTile: GameMapTile) {
        if (newTile === undefined) {
            throw new Error("attempt to move player to null tile");
        }
        super.MoveTo(newTile);
    }

    public parseInventoryUpdate(updateInv: M_InventoryItem[]): void {
        this.debugLastInventoryUpdate = updateInv;
        this._inventory = [];

        for (let i = 0; i < updateInv.length; i++) {
            this._inventory.push(new InventoryItem(updateInv[i]));
        }
    }

    public get inventory(): InventoryItem[] {
        return this._inventory;
    }

    public GetInventoryItemById(id: number): InventoryItem {
        for (let i = 0; i < this._inventory.length; i++) {
            if (this._inventory[i].id == id) {
                return this._inventory[i];
            }
        }
        return;
    }

    public GetActiveWeapon(): InventoryItem {
        for (let i = 0; i < this._inventory.length; i++) {
            if (this._inventory[i].itemData.equippedslot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
                return this._inventory[i];
            }
        }
        return;
    }

    public GetActiveWeaponRange(): number {
        for (let i = 0; i < this._inventory.length; i++) {
            if (this._inventory[i].itemData.equippedslot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
                return this._inventory[i].getRange();
            }
        }
        return 1;
    }
}
