import MapRect from "../utils/mapRect";
import GameMap from "./gameMap";
import MapPos from "../utils/mapPos";
import ArrayUtil from "../utils/arrayUtil";
import mapTile from "./mapTile";
import SerializableGameObject from "../base_classes/serializableGameObject";
import Game from "../game";
import RandomUtil from "../utils/randomUtil";
import GlobalConst from "../types/globalConst";
import { MapRoomD } from "../types/globalTypes";

/**
 * Rooms
 */
export class MapRoom extends SerializableGameObject {
    rect: MapRect;
    exits: Array<MapPos>; //established exit positions
    $parentMap: GameMap;
    specialRoom: GlobalConst.SPECIAL_ROOM = undefined;
    visited: number = 0;

    constructor(game: Game, parentMap: GameMap, json: MapRoomD | "" = "") {
        super(game);
        this.$parentMap = parentMap;
        this.rect = new MapRect();
        this.exits = new Array();
        if (json != "") {
            this.specialRoom =
                json.specialRoom == undefined || json.specialRoom == "" || json.specialRoom == "undefined"
                    ? undefined
                    : (json.specialRoom as GlobalConst.SPECIAL_ROOM);
            this.rect = new MapRect(json.rect.origin.x, json.rect.origin.y, json.rect.extents.x, json.rect.extents.y);
            for (let e = 0; e < json.exits.length; e++) {
                this.exits.push(new MapPos(json.exits[e].x, json.exits[e].y));
            }
        }
    }

    public GetCenter(): MapPos {
        return new MapPos(
            Math.round(this.rect.origin.x + this.rect.extents.x / 2),
            Math.round(this.rect.origin.y + this.rect.extents.y / 2),
        );
    }

    //gets a list of all tiles in the room meeting one of the two possible conditions
    protected GetTileList(condition: "walkable" | "empty floor") {
        const g = this.$parentMap.GetParentGame();
        let tiles: MapPos[] = [];
        for (let y = this.rect.origin.y; y < this.rect.bottomRight.y; y++) {
            for (let x = this.rect.origin.x; x < this.rect.bottomRight.x; x++) {
                if (
                    condition == "empty floor" &&
                    g.dungeon.TileIsWalkable(x, y) &&
                    g.dungeon.GetEntitiesInTile(x, y).length == 0 &&
                    g.data.map.GetTileBase(x, y).IsRoomFloor() &&
                    !g.data.map.GetTileBase(x, y).$event
                ) {
                    tiles.push(new MapPos(x, y));
                } else if (
                    condition == "walkable" &&
                    g.dungeon.TileIsWalkable(x, y) &&
                    g.dungeon.GetEntitiesInTile(x, y, 0, GlobalConst.ENTITY_FLAGS.IS_WALKABLE).length == 0 &&
                    g.data.map.GetTileBase(x, y).IsRoomFloor() &&
                    !g.data.map.GetTileBase(x, y).$event
                ) {
                    tiles.push(new MapPos(x, y));
                }
            }
        }
        return ArrayUtil.Shuffle(tiles);
    }

    public ContainsTile(x: number, y: number): boolean {
        const g = this.$parentMap.GetParentGame();
        const t = g.data.map.GetTileIfExists(x, y);
        if (t == undefined) {
            return false;
        }
        if (
            t.pos.x >= this.rect.origin.x &&
            t.pos.x <= this.rect.bottomRight.x &&
            t.pos.y >= this.rect.origin.y &&
            t.pos.y <= this.rect.bottomRight.y &&
            g.data.map.GetTileBase(x, y).IsRoomFloor()
        ) {
            return true;
        }
        return false;
    }

    public GetRandomEmptyTileInside(): MapPos | null {
        let tiles = this.GetTileList("empty floor");

        if (tiles.length > 0) {
            return tiles[0];
        } else {
            return null;
        }
    }

    public GetRandomTileWalkable(): MapPos | null {
        let tiles = this.GetTileList("walkable");

        if (tiles.length > 0) {
            return tiles[0];
        } else {
            return null;
        }
    }

    //Get a walkable tile that player can walk around.
    public GetRandomTileWalkableAndNonBlocking(): MapPos | null {
        let tiles = this.GetTileList("walkable");

        if (tiles.length > 0) {
            for (let t = 0; t < tiles.length; t++) {
                let tileClear: boolean = true;
                let nbs = tiles[t].getCardinalNeighbors();
                for (let n = 0; n < nbs.length; n++) {
                    //all 4 cardinal nbrs must be clear to allow player free move around
                    let tile = this.game.data.map.GetTileIfExists(nbs[n].x, nbs[n].y);
                    if (tile == undefined || !tile.IsWalkable()) {
                        tileClear = false;
                    }
                }
                if (tileClear) {
                    return tiles[t];
                }
            }
            return null;
        } else {
            return null;
        }
    }

    public GetEmptyEastWall(): MapPos {
        let new_pos: MapPos;
        let open_tile: boolean = false;
        // convenience
        const g = this.$parentMap.GetParentGame();

        let sanity = 500;
        while (sanity > 0 && !open_tile) {
            sanity--;
            new_pos = new MapPos(
                this.rect.bottomRight.x,
                RandomUtil.instance.int(this.rect.origin.y + 1, this.rect.bottomRight.y - 1),
            );
            let t: mapTile = g.data.map.GetTileBase(new_pos.x, new_pos.y);
            if (t.IsFlatWall()) {
                open_tile = true;
            }
        }
        if (sanity <= 1) {
            throw new Error("failed to find exit");
        }
        return new_pos;
    }
}

export default MapRoom;
