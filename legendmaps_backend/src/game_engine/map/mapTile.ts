import Game from "../game";
import MapObject from "../base_classes/mapObject";
import { MapTileD } from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import GlobalConst from "../types/globalConst";
import GameMap from "./gameMap";

/**
 * Base tile object placed as first layer in map
 * tile space -- always a floor or wall.
 */
class MapTile extends MapObject {
    flags: number = 0;
    $parentMap: GameMap; //used by map generation, not saved.
    $forceUpdate: boolean = false;
    $event:boolean = false; //used by generator to prevent event overlap

    constructor(map: GameMap, game: Game, json: MapTileD | "" = "") {
        super(game, json);
        this.$parentMap = map;
        if (json && json.cname == "MapTile") {
            this.flags = json.flags;
        }
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

    IsRoomFloor(): boolean {
        return this.kind == GlobalConst.GROUND_TYPES.DUNGEON_FLOOR ? true : false;
    }

    IsHall(): boolean {
        return this.kind == GlobalConst.GROUND_TYPES.DUNGEON_HALL ? true : false;
    }

    IsWall(): boolean {
        return this.IsCorner() || this.IsFlatWall() ? true : false;
    }

    private AddToArrayIfExists(tileArray: Array<MapTile>, x: number, y: number): Array<MapTile> {
        let map: GameMap = this.$parentMap != null ? this.$parentMap : this.game.data.map;
        let t: MapTile = map.GetTileIfExists(x, y);
        if (t != null) {
            tileArray.push(t);
        }
        return tileArray;
    }

    getCardinalNeighbors(): Array<MapTile> {
        let nb: Array<MapTile> = new Array();
        this.AddToArrayIfExists(nb, this.pos.x + 1, this.pos.y);
        this.AddToArrayIfExists(nb, this.pos.x - 1, this.pos.y);
        this.AddToArrayIfExists(nb, this.pos.x, this.pos.y + 1);
        this.AddToArrayIfExists(nb, this.pos.x, this.pos.y - 1);
        return nb;
    }

    getDiagNeighbors(): Array<MapTile> {
        let nb: Array<MapTile> = new Array();
        this.AddToArrayIfExists(nb, this.pos.x + 1, this.pos.y + 1);
        this.AddToArrayIfExists(nb, this.pos.x - 1, this.pos.y - 1);
        this.AddToArrayIfExists(nb, this.pos.x - 1, this.pos.y + 1);
        this.AddToArrayIfExists(nb, this.pos.x + 1, this.pos.y - 1);
        return nb;
    }

    getAllNeighbors(): Array<MapTile> {
        return this.getCardinalNeighbors().concat(this.getDiagNeighbors());
    }

    BlocksVision(): boolean {
        if (FlagUtil.IsSet(this.flags, GlobalConst.TILE_FLAGS.BLOCKS_VISION)) {
            return true;
        } else {
            return false;
        }
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

export default MapTile;
