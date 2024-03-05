import MapObject from "../base_classes/mapObject";
import Entity from "../base_classes/entity";
import Game from "../game";
import { MapEntityD } from "../types/globalTypes";
import MapPos from "../utils/mapPos";
import ObjectUtil from "../utils/objectUtil";

export default class MapEntity extends MapObject implements MapEntityD {
    flags: number = 0;

    constructor(game: Game, json: MapEntityD | "" = "") {
        super(game, json);
        this.cname = "MapEntity";
        if (json && json.cname == "MapEntity") {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            this.pos = new MapPos(json.pos.x, json.pos.y);
        }
    }

    Move(new_pos: MapPos) {
        this.pos = new_pos;
    }

    isPlaced(): boolean {
        return this.pos.isPlaced() ? true : false;
    }
}
