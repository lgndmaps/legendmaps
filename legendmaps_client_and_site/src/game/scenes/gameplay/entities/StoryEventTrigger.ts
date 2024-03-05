import { Entity } from "./Entity";
import { EntityLiving } from "./EntityLiving";
import GlobalConst from "../../../types/globalConst";

export class StoryEventTrigger extends Entity {
    mapGraphic: string = "";

    constructor(kind: string) {
        super();
        this.kind = kind;
    }

    GetGraphicName(): string {
        return "" + this.mapGraphic + ".png";
    }
}
