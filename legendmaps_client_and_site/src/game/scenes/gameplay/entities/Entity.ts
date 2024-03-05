import { GameMapTile } from "../map/GameMapTile";
import { SimpleEventDispatcher } from "ste-simple-events";

export class Entity {
    protected _onDataChanged = new SimpleEventDispatcher();

    public tile: GameMapTile;
    public id: number;
    public kind: string;

    GetGraphicName(): string {
        console.log("GETTING BASE GRAPHIC " + this.kind + ".png");
        return this.kind + ".png";
    }

    GetCurrentTile(): GameMapTile {
        if (this.tile != null) {
            return this.tile;
        } else {
            return;
        }
    }

    MoveTo(newTile: GameMapTile) {
        if (newTile == null) {
            throw new Error("Attempt to move entity to null tile");
        }
        if (this.tile != null) {
            this.tile.RemoveEntity(this);
            this.tile = null;
        }
        this.tile = newTile;
        this.tile.AddEntity(this);
        this.dispatchDataChanged();
    }

    RemoveFromTile() {
        if (this.tile != null) {
            this.tile.RemoveEntity(this);
            this.tile = null;
        }
    }

    IsOnMap(): boolean {
        return this.tile == null ? false : true;
    }

    protected dispatchDataChanged() {
        this._onDataChanged.dispatch(null);
    }

    //Subscribe with onDataChanged.subscribe(() => {})
    public get onDataChanged() {
        return this._onDataChanged.asEvent();
    }
}
