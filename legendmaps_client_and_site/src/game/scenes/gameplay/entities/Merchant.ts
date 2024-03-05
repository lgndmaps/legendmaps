import { Entity } from "./Entity";
import { EntityLiving } from "./EntityLiving";

export class Merchant extends Entity {
    mapGraphic: string = "";

    constructor(kind: string) {
        super();
        this.kind = kind;
    }

    GetGraphicName(): string {
        return "" + this.mapGraphic + ".png";
    }
}
