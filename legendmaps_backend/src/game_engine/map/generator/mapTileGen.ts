import Game from "../../game";
import MapObject from "../../base_classes/mapObject";
import { MapTileD } from "../../types/globalTypes";
import FlagUtil from "../../utils/flagUtil";
import GlobalConst from "../../types/globalConst";
import GameMap from "../gameMap";
import GameMapGen from "./gameMapGen";
import MapPos from "../../utils/mapPos";

/**
 * Base tile object placed as first layer in map
 * tile space -- always a floor or wall.
 */
export default class MapTileGen {
    flags: number = 0;
    ascii: string;
    kind: string;
    pos: MapPos;
    map: GameMapGen; //used by map generation, not saved.

    constructor(map: GameMapGen) {
        this.map = map;
        this.pos = new MapPos();
    }

    SetDoor(): MapTileGen {
        this.flags = FlagUtil.Set(this.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE);

        this.kind = GlobalConst.WALL_TYPES.DOOR;
        this.ascii = "+";
        return this;
    }

    SetWall(type: GlobalConst.WALL_TYPES): MapTileGen {
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.Set(this.flags, GlobalConst.TILE_FLAGS.BLOCKS_VISION);
        // console.log("this flags is " + this.flags);
        this.kind = type;

        if (type == GlobalConst.WALL_TYPES.NW) {
            this.ascii = "┌";
        } else if (type == GlobalConst.WALL_TYPES.SW) {
            this.ascii = "└";
        } else if (type == GlobalConst.WALL_TYPES.SE) {
            this.ascii = "┘";
        } else if (type == GlobalConst.WALL_TYPES.NE) {
            this.ascii = "┐";
        } else if (type == GlobalConst.WALL_TYPES.H) {
            this.ascii = "─";
        } else if (type == GlobalConst.WALL_TYPES.V) {
            this.ascii = "│";
        } else {
            throw new Error("unknown wall type");
        }
        //  console.log("made wall at " + this.ascii);
        return this;
    }

    SetFluid(type: GlobalConst.SPECIAL_TILE_TYPE) {
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE);

        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.TILE_FLAGS.BLOCKS_VISION);

        this.kind = type;
        if (type == GlobalConst.SPECIAL_TILE_TYPE.WATER) {
            this.ascii = "~";
        } else if (type == GlobalConst.SPECIAL_TILE_TYPE.LAVA) {
            this.ascii = "~";
        } else {
            throw new Error("unknown fluid type");
        }
        return this;
    }

    IsFlatWall(): boolean {
        return this.kind == GlobalConst.WALL_TYPES.H || this.kind == GlobalConst.WALL_TYPES.V ? true : false;
    }

    IsCorner(): boolean {
        return this.kind == GlobalConst.WALL_TYPES.NW ||
            this.kind == GlobalConst.WALL_TYPES.NE ||
            this.kind == GlobalConst.WALL_TYPES.SW ||
            this.kind == GlobalConst.WALL_TYPES.SE
            ? true
            : false;
    }

    IsHall(): boolean {
        return this.kind == GlobalConst.GROUND_TYPES.DUNGEON_HALL ? true : false;
    }

    IsWall(): boolean {
        return this.IsCorner() || this.IsFlatWall() ? true : false;
    }

    private AddToArrayIfExists(tileArray: Array<MapTileGen>, x: number, y: number): Array<MapTileGen> {
        let t: MapTileGen | null = this.map.GetTileIfExists(x, y);
        if (t != null) {
            tileArray.push(t);
        }
        return tileArray;
    }

    getCardinalNeighbors(): Array<MapTileGen> {
        let nb: Array<MapTileGen> = new Array();
        this.AddToArrayIfExists(nb, this.pos.x + 1, this.pos.y);
        this.AddToArrayIfExists(nb, this.pos.x - 1, this.pos.y);
        this.AddToArrayIfExists(nb, this.pos.x, this.pos.y + 1);
        this.AddToArrayIfExists(nb, this.pos.x, this.pos.y - 1);
        return nb;
    }

    getDiagNeighbors(): Array<MapTileGen> {
        let nb: Array<MapTileGen> = new Array();
        this.AddToArrayIfExists(nb, this.pos.x + 1, this.pos.y + 1);
        this.AddToArrayIfExists(nb, this.pos.x - 1, this.pos.y - 1);
        this.AddToArrayIfExists(nb, this.pos.x - 1, this.pos.y + 1);
        this.AddToArrayIfExists(nb, this.pos.x + 1, this.pos.y - 1);
        return nb;
    }

    getAllNeighbors(): Array<MapTileGen> {
        return this.getCardinalNeighbors().concat(this.getDiagNeighbors());
    }

    SetGround(type: GlobalConst.GROUND_TYPES): MapTileGen {
        this.flags = FlagUtil.Set(this.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE);
        // console.log("set ground this flags is " + this.flags);
        this.kind = type;

        if (type == GlobalConst.GROUND_TYPES.DUNGEON_FLOOR) {
            this.ascii = ".";
        } else if (type == GlobalConst.GROUND_TYPES.DUNGEON_HALL) {
            this.ascii = "#";
        } else {
            throw new Error("unknown ground type");
        }
        return this;
    }

    IsWalkable(): boolean {
        if (FlagUtil.IsSet(this.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE)) {
            return true;
        } else {
            return false;
        }
    }

    IsVisible(): boolean {
        if (FlagUtil.IsSet(this.flags, GlobalConst.TILE_FLAGS.IS_VISIBLE)) {
            return true;
        } else {
            return false;
        }
    }

    IsRevealed(): boolean {
        if (FlagUtil.IsSet(this.flags, GlobalConst.TILE_FLAGS.IS_REVEALED)) {
            return true;
        } else {
            return false;
        }
    }
}
