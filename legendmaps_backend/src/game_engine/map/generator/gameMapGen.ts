import MapPos from "../../utils/mapPos";
import MapRect from "../../utils/mapRect";
import MapRoom from "../mapRoom";
import MapTileGen from "./mapTileGen";
import assert from "assert";
import MathUtil from "../../utils/mathUtil";
import EnvironmentManager from "../EnvironmentManager";
import Environment from "../Environment";
import GlobalConst from "../../types/globalConst";
import MapRoomGen from "./mapRoomGen";
import GameMap from "../gameMap";
import Game from "../../game";
import MapTile from "../mapTile";
import ObjectUtil from "../../utils/objectUtil";
import ArrayUtil from "../../utils/arrayUtil";
import GROUND_TYPES = GlobalConst.GROUND_TYPES;

export default class GameMapGen {
    /**
     * "string" value below should only ever be empty "", using this over
     * an empty object or null as a space saving measure in JSON.
     */
    private map: (MapTileGen | "")[][];
    public $environmentManager: EnvironmentManager; //Not something that needs to be saved, only used for map generation initially

    private _rooms: Array<MapRoomGen>;

    public asciimap: string[];
    public mapname: string;
    public cr: number = 1;
    public biome: Environment;
    public wall: Environment;
    public lineart: string;
    public dwellers: string[]; //strings for now, will parse later
    public items: any[];
    public traps: string[];
    public specialRoom: string;
    public glitch: string;
    entranceTilePosX: number = -1;
    entranceTilePosY: number = -1;

    constructor() {
        this.map = new Array();
        this._rooms = new Array();
        this.$environmentManager = new EnvironmentManager();
    }

    //converts generator map to useful game map
    public SetGameMap(game: Game): GameMap {
        let gameMap: GameMap = game.data.map;

        gameMap.InitBlankMap(this.map[0].length, this.map.length);
        for (let i = 0; i < this.map.length; i++) {
            for (let x = 0; x < this.map[i].length; x++) {
                if (this.map[i][x] != "") {
                    let sourceTile: MapTileGen = this.map[i][x] as MapTileGen;
                    let targetTile: MapTile = new MapTile(gameMap, game);

                    targetTile.pos = new MapPos(sourceTile.pos.x, sourceTile.pos.y);
                    ObjectUtil.copyAllCommonPrimitiveValues(sourceTile, targetTile);
                    gameMap.map[i][x] = targetTile;
                } else {
                    gameMap.map[i][x] = "";
                }
            }
        }

        for (let r = 0; r < this._rooms.length; r++) {
            let oldRoom = this._rooms[r];
            let newRoom: MapRoom = new MapRoom(game, gameMap);
            for (let e = 0; e < oldRoom.exits.length; e++) {
                newRoom.exits.push(new MapPos(oldRoom.exits[e].x, oldRoom.exits[e].y));
            }
            newRoom.rect = new MapRect(
                oldRoom.rect.origin.x,
                oldRoom.rect.origin.y,
                oldRoom.rect.extents.x,
                oldRoom.rect.extents.y,
            );
            ObjectUtil.copyAllCommonPrimitiveValues(oldRoom, newRoom);
            gameMap.rooms.push(newRoom);
        }
        ObjectUtil.copyAllCommonPrimitiveValues(this, gameMap);
        gameMap.biome = this.biome;
        gameMap.wall = this.wall;
        gameMap.dwellers = this.dwellers;
        gameMap.items = this.items;
        gameMap.specialRoom = this.specialRoom;
        gameMap.traps = this.traps;
        gameMap.cr = this.cr;
        gameMap.lineart = this.lineart;
        gameMap.glitch = this.glitch;

        console.log(
            "GLITCH: " +
                gameMap.glitch +
                " TRAPS: " +
                gameMap.traps +
                " LINE ART:" +
                gameMap.lineart +
                " SPEC:" +
                gameMap.specialRoom,
        );
        return gameMap;
    }

    GetAscii(): string {
        let mapstr = "";
        for (let y = 0; y <= this.GetMapHeight(); y++) {
            for (let x = 0; x <= this.GetMapWidth(); x++) {
                let t = this.GetTileIfExists(x, y);
                if (t != undefined) {
                    mapstr += t.ascii;
                } else {
                    mapstr += " ";
                }
            }
            mapstr += "\n";
        }
        return mapstr;
    }

    debugReport() {
        let debug: string = "MAP ";
        debug += "\nROOMS: " + this._rooms.length;
        for (let i = 0; i < this._rooms.length; i++) {
            debug +=
                "\n--room " +
                i +
                " | EXITS: " +
                this._rooms[i].exits.length +
                "  | RECT: " +
                this._rooms[i].rect.ToStr();
        }
        console.log(debug);
    }

    //Used for Map Tests do not delete, requires NFT metadata, not database metadata
    LoadMetaDataFromJSONTestRun(mapMetaData: any, mapMetaMetaData: any) {
        // console.log("MAP META" + JSON.stringify(mapMetaData));
        this.asciimap = mapMetaData.map;
        this.mapname = mapMetaData.name;
        this.biome = this.$environmentManager.GetBiome(mapMetaData.biome.biome);

        this.wall = this.$environmentManager.GetWall(mapMetaData.entrance.material_type);
        this.lineart = mapMetaData.lineart.art;
    }

    LoadMetaDataFromJSON(mapMetaData: any, mapMetaMetaData: any) {
        this.asciimap = mapMetaData.asciiMap;
        this.mapname = mapMetaData.name;

        this.biome = this.$environmentManager.GetBiome(mapMetaData.biome);
        this.wall = this.$environmentManager.GetWall(mapMetaData.wallMaterial);
        this.cr = Math.round(mapMetaData.challengeRating / 2);
        this.items = mapMetaMetaData.items;
        this.dwellers = mapMetaMetaData.dwellers;
        this.lineart = mapMetaData.lineart;
        this.glitch = mapMetaData.glitch;
        this.traps = mapMetaData.traps;
        this.specialRoom = mapMetaData.specialRoom;
    }

    InitBlankMap(sizeX: number, sizeY: number) {
        assert.ok(sizeX > 1 && sizeY > 1);
        this.map = new Array(sizeY).fill("").map(() => new Array(sizeX).fill(""));
    }

    AddRoom(): MapRoomGen {
        let rm: MapRoomGen = new MapRoomGen(this);
        this._rooms.push(rm);
        return rm;
    }

    get rooms(): Array<MapRoomGen> {
        return this._rooms;
    }

    //Assumes maps are square, does not -1 like width/height fxs so number is 1 more than actual count
    GetTileSize(): number {
        return this.map.length;
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

    //A little crude as it uses center.
    GetSortedClosestRoomsToPoint(pt: MapPos, excludingRoom?: MapRoomGen): Array<MapRoomGen> {
        let roomslist: Array<MapRoomGen> = [];
        for (let r = 0; r < this.rooms.length; r++) {
            roomslist.push(this.rooms[r]);
        }
        roomslist = roomslist.sort((a: MapRoomGen, b: MapRoomGen) => {
            if (pt.distCardinal(a.GetCenter()) < pt.distCardinal(b.GetCenter())) {
                return -1;
            } else {
                return 1;
            }
        });

        if (excludingRoom !== undefined) {
            roomslist = ArrayUtil.remove(roomslist, excludingRoom);
        }

        return roomslist;
    }

    //Return true if spot is somewhere in map range
    IsInMap(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.map[0].length && y < this.map.length ? true : false;
    }

    //Return true if spot is void (not wall, floor, etc.) but still in map
    IsVoidSpot(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.map[0].length && y < this.map.length && this.map[y][x] == "" ? true : false;
    }

    static placertest = 0;

    ClearTileBase(x: number, y: number) {
        //assert.ok(MathUtil.numberInRange(x, 0, this.GetMapWidth()));
        //assert.ok(MathUtil.numberInRange(y, 0, this.GetMapHeight()));
        if (y > this.GetMapHeight()) return;
        if (x > this.GetMapWidth()) return;
        this.map[y][x] = "";
    }

    PlaceTileBase(x: number, y: number, tile: MapTileGen) {
        assert.ok(MathUtil.numberInRange(x, 0, this.GetMapWidth()));
        assert.ok(MathUtil.numberInRange(y, 0, this.GetMapHeight()));

        tile.pos.x = x;
        tile.pos.y = y;
        this.map[y][x] = tile;
    }

    GetTileBase(x: number, y: number): MapTileGen {
        assert.ok(MathUtil.numberInRange(x, 0, this.GetMapWidth()));
        assert.ok(MathUtil.numberInRange(y, 0, this.GetMapHeight()));

        if (this.map[y][x] instanceof MapTileGen) {
            return this.map[y][x] as MapTileGen;
        } else {
            throw new Error("No Base Tile Found at " + x + "," + y + " CHeck void first or use GetTileIfExists");
        }
    }

    SetTileHall(x, y) {
        this.map[y][x] = new MapTileGen(this);
        let tile: MapTileGen = this.map[y][x] as MapTileGen;
        tile.pos.x = x;
        tile.pos.y = y;
        tile.SetGround(GROUND_TYPES.DUNGEON_HALL);
    }

    GetTileIfExists(x: number, y: number): MapTileGen | null {
        if (!MathUtil.numberInRange(x, 0, this.GetMapWidth()) || !MathUtil.numberInRange(y, 0, this.GetMapHeight())) {
            return null;
        }
        if (this.map[y][x] instanceof MapTileGen) {
            return this.map[y][x] as MapTileGen;
        } else {
            return null;
        }
    }
}
