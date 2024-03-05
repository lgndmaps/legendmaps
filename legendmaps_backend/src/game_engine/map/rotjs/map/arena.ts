import MapGen from "../../generator/mapGen";
import Map, { CreateCallback } from "./map";

/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
export default class Arena extends Map {
    create(mapGen: MapGen, callback: CreateCallback) {
        let w = this._width - 1;
        let h = this._height - 1;
        for (let i = 0; i <= w; i++) {
            for (let j = 0; j <= h; j++) {
                let empty = i && j && i < w && j < h;
                callback(mapGen, i, j, empty ? 0 : 1);
            }
        }
        return this;
    }
}
