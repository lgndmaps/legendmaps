import MapGen from "../../generator/mapGen";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../constants";

export interface CreateCallback {
    (mapGen: MapGen, x: number, y: number, contents: number): any;
}

export default abstract class Map {
    mapGen: MapGen;
    _width: number;
    _height: number;

    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
        this._width = width;
        this._height = height;
    }

    abstract create(mapGen?: MapGen, callback?: CreateCallback): void;

    _fillMap(value: number) {
        let map: number[][] = [];
        for (let i = 0; i < this._width; i++) {
            map.push([]);
            for (let j = 0; j < this._height; j++) {
                map[i].push(value);
            }
        }
        return map;
    }
}
