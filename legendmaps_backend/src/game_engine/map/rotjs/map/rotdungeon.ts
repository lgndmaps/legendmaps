import Map from "./map";
import { Room, Corridor, Hallway } from "./features";

/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
export default abstract class RotDungeon extends Map {
    _rooms: Room[];
    _corridors: Corridor[];
    _hallways: Hallway[]; //replacement for corridors

    constructor(width: number, height: number) {
        super(width, height);
        this._rooms = [];
        this._corridors = [];
        this._hallways = [];
    }

    /**
     * Get all generated rooms
     * @returns {ROT.Map.Feature.Room[]}
     */
    getRooms() {
        return this._rooms;
    }

    /**
     * Get all generated corridors
     * @returns {ROT.Map.Feature.Corridor[]}
     */
    getCorridors() {
        return this._corridors;
    }

    /**
     */
    getHallways() {
        return this._hallways;
    }
}
