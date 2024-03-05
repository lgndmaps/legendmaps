import SerializableGameObject from "./serializableGameObject";
import type Game from "../game";
import MapPos from "../utils/mapPos";
import { MapObjectD } from "../types/globalTypes";

/**
 * Abstract object type for anything which appears on the map
 */
export default abstract class MapObject extends SerializableGameObject {
    ascii: string;
    pos: MapPos;

    constructor(game: Game, json: MapObjectD | "" = "") {
        super(game, json);

        if (json) {
            //console.log(json);
            const { ascii, pos } = json;
            this.ascii = ascii;
            this.pos = new MapPos(pos.x, pos.y);
        } else {
            this.ascii = " ";
            this.pos = new MapPos();
        }
    }
}
