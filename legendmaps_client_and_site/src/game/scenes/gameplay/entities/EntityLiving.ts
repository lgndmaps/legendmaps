import { Entity } from "./Entity";

export class EntityLiving extends Entity {
    _hp: number = 0;

    public GetCurrentMapGraphic(): Phaser.GameObjects.Sprite | Phaser.GameObjects.Image {
        if (this.tile != undefined && this.tile.currentGraphic != undefined) {
            return this.tile.currentGraphic;
        }
        console.log("No graphic for Entity.");
    }

    public set hp(newhp: number) {
        this._hp = newhp;
        this.dispatchDataChanged();
    }

    public get hp() {
        return this._hp;
    }
}
