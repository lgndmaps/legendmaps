import SerializableGameObject from "../base_classes/serializableGameObject";
import MapPos from "../utils/mapPos";
import MapRect from "../utils/mapRect";
import MapRoom from "./mapRoom";
import Game from "../game";
import MapTile from "./mapTile";
import MapObject from "../base_classes/mapObject";
import { GameMapD } from "../types/globalTypes";
import assert from "assert";
import MathUtil from "../utils/mathUtil";
import FlagUtil from "../utils/flagUtil";
import EnvironmentManager from "./EnvironmentManager";
import Environment from "./Environment";
import GlobalConst from "../types/globalConst";
import MapPortal from "./mapPortal";
import ArrayUtil from "../utils/arrayUtil";

export default class GameMap extends SerializableGameObject implements GameMapD {
    /**
     * "string" value below should only ever be empty "", using this over
     * an empty object or null as a space saving measure in JSON.
     */
    public map: (MapTile | "")[][];
    public $environmentManager: EnvironmentManager; //Not something that needs to be saved, only used for map generation initially

    public rooms: Array<MapRoom>;

    public asciimap: string[];
    public mapname: string;
    public cr: number = -1;
    public biome: Environment;
    public wall: Environment;
    public lineart: string;
    public dwellers: string[];
    public items: any[];
    public traps: string[];
    public specialRoom: string;
    public glitch: string;

    public entranceTile: MapPortal;
    public exitTile: MapPortal;

    constructor(game: Game) {
        super(game);
        this.map = new Array();
        this.rooms = new Array();
        this.$environmentManager = new EnvironmentManager();
    }

    InitBlankMap(sizeX: number, sizeY: number) {
        assert.ok(sizeX > 1 && sizeY > 1);
        this.map = new Array(sizeY).fill("").map(() => new Array(sizeX).fill(""));
    }

    LoadMapData(mapData: GameMapD) {
        Object.assign(this, mapData);
        if (mapData.cname == "GameMap") {
            this.InitBlankMap(mapData.map[0].length, mapData.map.length);

            for (let y = 0; y < this.map.length; y++) {
                for (let x = 0; x < this.map[y].length; x++) {
                    const isEmpty = Object.keys(mapData.map[y][x]).length === 0;
                    if (mapData.map[y][x] != "" && !isEmpty) {
                        this.map[y][x] = new MapTile(this, this.game, mapData.map[y][x]);
                    }
                }
            }

            this.rooms = [];
            for (let r = 0; r < mapData.rooms.length; r++) {
                this.rooms.push(new MapRoom(this.game, this, mapData.rooms[r]));
            }
        } else {
            throw new Error("Failed to load map data from " + mapData);
        }
    }

    /**
     * NOTE: Following methods are 1 less than array count
     * because we are use them with placement and dont want
     * to be -1 everywhere. Actual tile count is 1 higher.
     */
    GetMapHeight(): number {
        return this.map.length - 1;
    }

    GetMapWidth(): number {
        return this.map[0].length - 1;
    }

    GetRect(): MapRect {
        return new MapRect(0, 0, this.GetMapWidth(), this.GetMapHeight());
    }

    //Return true if spot is somewhere in map range
    IsInMap(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && y < this.map.length && x < this.map[0].length ? true : false;
    }

    //Return true if spot is void (not wall, floor, etc.) but still in map
    IsVoidSpot(x: number, y: number): boolean {
        if (this.IsInMap(x, y)) {
            return x >= 0 && y >= 0 && y < this.map.length && x < this.map[0].length && this.map[y][x] == ""
                ? true
                : false;
        }
        return false;
    }

    GetCurrentRoom(x: number, y: number): MapRoom | null {
        for (let r = 0; r < this.rooms.length; r++) {
            if (this.rooms[r].ContainsTile(x, y)) {
                return this.rooms[r];
            }
        }

        return null;
    }

    GetTileBase(x: number, y: number): MapTile {
        //  console.log("CHECKING BASE TILE " + x + "," + y + " IN MAP: " + this.map[0].length + "," + this.map.length);
        assert.ok(MathUtil.numberInRange(x, 0, this.GetMapWidth()));
        assert.ok(MathUtil.numberInRange(y, 0, this.GetMapHeight()));

        if (this.map[y][x] instanceof MapTile) {
            return this.map[y][x] as MapTile;
        } else {
            throw new Error("No Base Tile Found at " + x + "," + y + " CHeck void first or use GetTileIfExists");
        }
    }

    GetTileIfExists(x: number, y: number): MapTile | null {
        if (!MathUtil.numberInRange(x, 0, this.GetMapWidth()) || !MathUtil.numberInRange(y, 0, this.GetMapHeight())) {
            return null;
        }
        if (this.map[y][x] instanceof MapTile) {
            return this.map[y][x] as MapTile;
        } else {
            return null;
        }
    }

    //if true Automatically sets revealed if not previously set
    SetTileVisible(x: number, y: number, isVisible: boolean) {
        let tile: MapTile | null = this.GetTileIfExists(x, y);
        if (tile != null) {
            if (isVisible) {
                tile.flags = FlagUtil.Set(tile.flags, GlobalConst.TILE_FLAGS.IS_VISIBLE);
                this.SetTileRevealed(x, y, true);
            } else {
                let bf = tile.flags;
                tile.flags = FlagUtil.UnSet(tile.flags, GlobalConst.TILE_FLAGS.IS_VISIBLE);
            }
        }
    }

    SetTileRevealed(x: number, y: number, isRevealed: boolean) {
        let tile: MapTile | null = this.GetTileIfExists(x, y);
        if (tile != null && isRevealed && FlagUtil.IsNotSet(tile.flags, GlobalConst.TILE_FLAGS.IS_REVEALED)) {
            tile.flags = FlagUtil.Set(tile.flags, GlobalConst.TILE_FLAGS.IS_REVEALED);
        }
    }

    SetAllTilesRevealed() {
        let x: number;
        let y: number;
        for (y = 0; y < this.GetMapHeight() + 1; y++) {
            for (x = 0; x < this.GetMapWidth() + 1; x++) {
                this.SetTileRevealed(x, y, true);
            }
        }
    }



    GetRandomEmptyTileInAnyRoom(excludeSpecialRoom: boolean = true): MapPos {
        this.rooms = ArrayUtil.Shuffle(this.rooms);
        for (let r = 0; r < this.rooms.length; r++) {
            if (excludeSpecialRoom && this.rooms[r].specialRoom != undefined) {
                //skipping special room
            } else {
                let mp: MapPos = this.rooms[r].GetRandomEmptyTileInside();
                if (mp != null) {
                    return mp;
                }
            }
        }
        throw new Error("No Rooms Have Empty Tiles!");
    }

    GetRandomWalkableAndNonBlockingTileInAnyRoom(excludeSpecialRoom: boolean = true): MapPos {
        this.rooms = ArrayUtil.Shuffle(this.rooms);
        for (let r = 0; r < this.rooms.length; r++) {
            if (excludeSpecialRoom && this.rooms[r].specialRoom != undefined) {
                //skipping special room
            } else {
                let mp: MapPos = this.rooms[r].GetRandomTileWalkableAndNonBlocking();
                if (mp != null) {
                    return mp;
                }
            }
        }
        throw new Error("No Rooms Have Empty Non Blocking Tiles!");
    }

    GetRandomWalkableTileInAnyRoom(excludeSpecialRoom: boolean = true): MapPos {
        this.rooms = ArrayUtil.Shuffle(this.rooms);
        for (let r = 0; r < this.rooms.length; r++) {
            if (excludeSpecialRoom && this.rooms[r].specialRoom != undefined) {
                //skipping special room
            } else {
                let mp: MapPos = this.rooms[r].GetRandomTileWalkable();
                if (mp != null) {
                    return mp;
                }
            }
        }
        throw new Error("No Rooms Have Empty Tiles!");
    }
    //Used by entities which need to override underlying tile
    CreateMapTileAtPos(x: number, y: number): MapTile {
        this.map[y][x] = new MapTile(this, this.game);
        return this.map[y][x] as MapTile;
    }
}
