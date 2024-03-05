import GlobalConst from "../../../types/globalConst";
import ArrayUtil from "../../../util/arrayUtil";
import Dweller from "./Dweller";
import { Entity } from "./Entity";
import { Item } from "./Item";
import { StoryEventTrigger } from "./StoryEventTrigger";
import { MapPortal } from "./MapPortal";
import { Merchant } from "./Merchant";

export default class EntityManager {
    private static _instance: EntityManager;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private _ents: Array<Entity>;

    constructor() {
        this._ents = [];
    }

    RemoveEntity(ent: Entity) {
        console.log("REMOVING ENTITY!");
        ent.RemoveFromTile();
        ArrayUtil.remove(this._ents, ent);
    }

    GetDwellerByID(id: number): Dweller | null {
        let ent: Dweller = this.GetEntityById(id) as Dweller;
        if (ent == null) {
            return null;
        }
        return ent;
    }

    GetOrCreateStoryEventTrig(id: number, kind: string, mapGraphic: string): StoryEventTrigger {
        let ent: StoryEventTrigger = this.GetEntityById(id) as StoryEventTrigger;
        if (ent == null) {
            ent = new StoryEventTrigger(kind);
            this._ents.push(ent);
            ent.id = id;
            ent.mapGraphic = mapGraphic;
        }
        return ent;
    }

    GetOrCreateMerchant(id: number, kind: string, mapGraphic: string): Merchant {
        let ent: Merchant = this.GetEntityById(id) as Merchant;
        if (ent == null) {
            ent = new Merchant(kind);
            this._ents.push(ent);
            ent.id = id;
            ent.mapGraphic = mapGraphic;
        }
        return ent;
    }

    GetOrCreateDweller(id: number, kind: string, name: string): Dweller {
        let ent: Dweller = this.GetEntityById(id) as Dweller;
        if (ent == null) {
            ent = new Dweller(kind, name);
            this._ents.push(ent);
            ent.id = id;
        }
        return ent;
    }

    GetOrCreateItem(id: number, kind: string, rarity: GlobalConst.RARITY): Item {
        let ent: Item = this.GetEntityById(id) as Item;

        if (ent == null) {
            ent = new Item(kind, rarity);
            this._ents.push(ent);
            ent.id = id;
        }
        return ent;
    }

    GetOrCreateMapPortal(id: number, kind: string): MapPortal {
        let ent: MapPortal = this.GetEntityById(id) as MapPortal;

        if (ent == null) {
            ent = new MapPortal(kind);
            ent.kind = kind;
            this._ents.push(ent);
            ent.id = id;
        }
        return ent;
    }

    GetEntityById(id: number): Entity | null {
        for (let i = 0; i < this._ents.length; i++) {
            if (id == this._ents[i].id) {
                return this._ents[i];
            }
        }
        return null;
    }
}
