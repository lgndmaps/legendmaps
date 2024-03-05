import { Entity } from "./Entity";
import { EntityLiving } from "./EntityLiving";

export class MapPortal extends Entity {
    mapGraphic: string = "";

    constructor(kind: string) {
        super();
        this.kind = kind;
    }

    override GetGraphicName(): string {
        return "" + this.kind + ".png";
    }
}
