import MapRect from "../../utils/mapRect";
import MathUtil from "../../utils/mathUtil";
import GameMapGen from "./gameMapGen";
import MapRoom from "../mapRoom";
import ArrayUtil from "../../utils/arrayUtil";
import { MapGenHalls } from "./mapGenHalls";
import { MapGenRoomQuad } from "./mapGenRoomQuad";
import MapPos from "../../utils/mapPos";
import Digger from "../rotjs/map/digger";
import Uniform from "../rotjs/map/uniform";
import Cellular from "../rotjs/map/cellular";
import EnvironmentManager from "../EnvironmentManager";
import RandomUtil from "../../utils/randomUtil";
import MapGenRoomPathfinder from "./mapGenRoomPathfinder";
import GlobalConst from "../../types/globalConst";
import MapTileGen from "./mapTileGen";
import MapRoomGen from "./mapRoomGen";
import UniformImproved from "../rotjs/map/uniformImproved";
import FlagUtil from "../../utils/flagUtil";
import SpecialRoomData from "./data/specialrooms/SpecialRoomData";
import SpecialRoomFactory from "./data/specialrooms/SpecialRoomFactory";

class MapGen {
    static ENTRANCE_NFT_X_START: number = 8;
    static ENTRANCE_X_SHIFT: number = 15;
    static MAP_SIZE_X: number = 72;
    static MAP_SIZE_Y: number = 25;

    curMap: GameMapGen;
    genMap: number[][];

    activeSpecialRoom: GlobalConst.SPECIAL_ROOM = undefined;

    constructor() {}

    //Used for map testing, do not delete
    GenerateMapTestRun(mapMetaData: JSON, mapMetaMetaData: JSON, seed: number): GameMapGen {
        let sizeY: number = MapGen.MAP_SIZE_Y;
        let sizeX: number = MapGen.MAP_SIZE_X;
        let gm: GameMapGen | null = null;

        while (gm == null) {
            //   try {
            this.genMap = new Array(sizeY).fill(1).map(() => new Array(sizeX).fill(1)); //Create blank map for generator
            this.curMap = new GameMapGen();
            this.curMap.InitBlankMap(sizeX, sizeY);
            this.curMap.LoadMetaDataFromJSONTestRun(mapMetaData, mapMetaMetaData);
            let mapData: any = mapMetaData as any; //avoid type complaints.

            let rotMap = new Uniform(MapGen.ENTRANCE_X_SHIFT, sizeX, sizeY, seed);

            if (mapData.special_room != undefined) {
                let specroom: SpecialRoomData = SpecialRoomFactory.GetSpecialRoom(mapData.special_room.room_name);
                this.activeSpecialRoom = specroom.kind;
                let footPrint: MapPos = specroom.GetFootPrint();
                // console.log("SPEC: " + specroom.map[0] + " " + specroom.kind + " FOOT " + footPrint.toStr());
                rotMap.addReservedRoom(specroom, footPrint.x, footPrint.y);
            }

            rotMap.create(this, this.ROTGenCallback); //Creating map with ROT

            this.PlaceWallsAndGenerateTilesFromROT(sizeX, sizeY, rotMap); //Translating ROT into Our Game Map, just rooms for now

            this.DigHalls();
            this.RoomReport();
            this.PlaceEntrance(); //Applying entrance from map metadata
            gm = this.curMap;
            // console.log(this.curMap.GetAscii());
        }
        return this.curMap;
    }

    RoomReport() {
        for (let r = 0; r < this.curMap.rooms.length; r++) {
            this.curMap.rooms[r].debug();
        }
    }

    GenerateMap(mapMetaData: JSON, mapMetaMetaData: JSON, seed: number): GameMapGen {
        let sizeY: number = MapGen.MAP_SIZE_Y;
        let sizeX: number = MapGen.MAP_SIZE_X;
        let gm: GameMapGen | null = null;
        let sanity = 300;
        while (sanity > 0 && gm == null) {
            sanity--;
            //   try {
            this.genMap = new Array(sizeY).fill(1).map(() => new Array(sizeX).fill(1)); //Create blank map for generator
            this.curMap = new GameMapGen(); //Expects blank map for game
            this.curMap.InitBlankMap(sizeX, sizeY); //Adding space for entrance
            this.curMap.LoadMetaDataFromJSON(mapMetaData, mapMetaMetaData); //loading metadata
            console.log("~~~~~~~~~~~~~~~~MAP SEED" + seed);
            let rotMap = new Uniform(MapGen.ENTRANCE_X_SHIFT, sizeX, sizeY, seed); //ROT Generator ignores entrance area, will be shifted right X tiles

            if (this.curMap.specialRoom != undefined) {
                let specroom: SpecialRoomData = SpecialRoomFactory.GetSpecialRoom(this.curMap.specialRoom);
                this.activeSpecialRoom = specroom.kind;
                let footPrint: MapPos = specroom.GetFootPrint();
                rotMap.addReservedRoom(specroom, footPrint.x, footPrint.y);
            }

            rotMap.create(this, this.ROTGenCallback); //Creating map with ROT
            this.PlaceWallsAndGenerateTilesFromROT(sizeX, sizeY, rotMap); //Tranlating ROT into Our Game Map
            this.DigHalls();
            this.PlaceEntrance(); //Applying entrance from map metadata
            gm = this.curMap;
        }
        if (sanity <= 1) {
            throw new Error("map generation failed");
        }
        // console.log(this.curMap.GetAscii());
        return this.curMap;
    }

    private ROTGenCallback(mapGen: MapGen, x: number, y: number, value: number) {
        mapGen.genMap[y][x] = value;
    }

    DigHalls() {
        let specialRoom: MapRoomGen = null;

        // STEP 1: Step through rooms connect to next closest unconnected room.
        let unconnectedRooms: MapRoomGen[] = [];
        for (let r = 0; r < this.curMap.rooms.length; r++) {
            unconnectedRooms.push(this.curMap.rooms[r]);
            if (this.curMap.rooms[r].specialRoom != undefined) {
                specialRoom = this.curMap.rooms[r];
            }
        }

        let startRoom: MapRoomGen = unconnectedRooms.shift();
        let steps: number = unconnectedRooms.length;
        while (steps > 0) {
            steps--;
            let targetRoom: MapRoomGen;
            let closeRooms: Array<MapRoomGen> = this.curMap.GetSortedClosestRoomsToPoint(
                startRoom.GetCenter(),
                startRoom,
            );
            for (let c = 0; c < closeRooms.length; c++) {
                //only connect to rooms in unconnected rooms list
                if (targetRoom == undefined && unconnectedRooms.includes(closeRooms[c])) {
                    targetRoom = closeRooms[c];
                }
            }

            if (targetRoom != undefined) {
                if (this.ConnectRooms(startRoom, targetRoom)) {
                    unconnectedRooms = ArrayUtil.remove(unconnectedRooms, targetRoom);
                }
                startRoom = targetRoom;
            } else {
                throw new Error("failed to find room to connect to!");
            }
        }

        // STEP 2: Add extra connection to special room if available.
        if (specialRoom != undefined) {
            let closeRooms: Array<MapRoomGen> = this.curMap.GetSortedClosestRoomsToPoint(
                specialRoom.GetCenter(),
                specialRoom,
            );
            this.ConnectRooms(specialRoom, closeRooms[1]);
        }

        //STEP 3: Randomly add few extra connection to random rooms.

        for (let i = 0; i < 1; i++) {
            let rm: MapRoomGen = RandomUtil.instance.fromArray(this.curMap.rooms);
            if (rm != specialRoom) {
                let closeRooms: Array<MapRoomGen> = this.curMap.GetSortedClosestRoomsToPoint(rm.GetCenter(), rm);
                this.ConnectRooms(rm, closeRooms[1]); //connect to second closest
            }
        }
    }

    ConnectRooms(startRoom: MapRoomGen, targetRoom: MapRoomGen) {
        let mgpf: MapGenRoomPathfinder = new MapGenRoomPathfinder(this.curMap, this);
        let startPoints: Array<MapPos> = startRoom.GetAllPossibleExits(targetRoom.GetCenter());
        let endPoints: Array<MapPos> = targetRoom.GetAllPossibleExits(startPoints[0]);

        let s = 0;
        let e = 0;
        let count: number = 0;
        let sanity = 500;
        let pathFound: boolean = false;
        while (sanity > 0 && !pathFound && s < startPoints.length && e < endPoints.length) {
            sanity--;
            let pathCheck: boolean = mgpf.DigRoomHall(startRoom, startPoints[s], targetRoom, endPoints[e]);
            if (pathCheck) {
                pathFound = true;
                startRoom = targetRoom;
                return true;
            } else {
                count++;
                if (count % 2 == 0) {
                    s++;
                } else {
                    e++;
                }
            }
        }
        if (!pathFound) {
            throw new Error("failed to connect rooms!");
        }
    }

    PlaceEntrance() {
        let connectPoint: MapPos = new MapPos();
        let rightmostHallway: MapPos = new MapPos();
        let maxy = this.curMap.GetMapHeight();
        if (this.curMap.asciimap.length - 1 < maxy) {
            maxy = this.curMap.asciimap.length - 1;
        }

        for (let y = 0; y < this.curMap.GetMapHeight(); y++) {
            for (let x = 0; x < MapGen.ENTRANCE_NFT_X_START; x++) {
                let mapTile: MapTileGen = new MapTileGen(this.curMap);
                let groundtype: EnvironmentManager.ENV_TILE_TYPES = this.curMap.biome.GetRandomTileType();

                mapTile.flags = groundtype.flags;
                mapTile.ascii = groundtype.ascii;

                if (groundtype.altgraphics != null && groundtype.altgraphics.length > 0) {
                    let r: number = RandomUtil.instance.int(0, groundtype.altgraphics.length);
                    if (r >= groundtype.altgraphics.length) {
                        mapTile.kind = groundtype.graphic;
                    } else {
                        mapTile.kind = groundtype.altgraphics[r];
                    }
                } else {
                    mapTile.kind = groundtype.graphic;
                }

                this.curMap.PlaceTileBase(x, y, mapTile);
            }
        }

        for (let y = 0; y < maxy; y++) {
            let tiles: string[] = this.curMap.asciimap[y].split("");
            let stopChecking: boolean = false;
            let hitWall: boolean = false;
            for (let t = MapGen.ENTRANCE_NFT_X_START; t < MapGen.ENTRANCE_NFT_X_START + 7; t++) {
                let loadedX: number = t - MapGen.ENTRANCE_NFT_X_START;
                if (
                    t > 4 + MapGen.ENTRANCE_NFT_X_START &&
                    hitWall &&
                    (tiles[loadedX] == "" || tiles[loadedX] == " " || tiles[loadedX] == "#")
                ) {
                    stopChecking = true;
                }
                if (tiles[loadedX] != "" && tiles[loadedX] != " " && tiles[loadedX] != "+" && !stopChecking) {
                    let mapTile: MapTileGen = new MapTileGen(this.curMap);

                    let type: EnvironmentManager.ENV_TILE_TYPES | null = this.curMap.wall.GetTileType(tiles[loadedX]);
                    if (type == null) {
                        type = this.curMap.biome.GetTileType(tiles[loadedX]);
                    } else {
                        hitWall = true;
                    }

                    //can only ever be one of these
                    if (tiles[loadedX] == "∩") {
                        //if (hitWall && tiles[t] == "∩" && !connectPoint.isPlaced()) {
                        hitWall = true;
                        this.curMap.entranceTilePosX = t;
                        this.curMap.entranceTilePosY = y;

                        //always force hallway to right of entrance.
                        this.curMap.SetTileHall(t + 1, y);
                        connectPoint.x = t + 1;
                        connectPoint.y = y;
                        rightmostHallway.x = connectPoint.x;
                        rightmostHallway.y = connectPoint.y;
                    }

                    if (tiles[loadedX] == "#" && t > rightmostHallway.x) {
                        rightmostHallway.x = t;
                        rightmostHallway.y = y;
                    }

                    if (type != null) {
                        mapTile.flags = type.flags;

                        mapTile.ascii = type.ascii;
                        if (type.altgraphics != null && type.altgraphics.length > 0) {
                            let r: number = RandomUtil.instance.int(0, type.altgraphics.length);
                            if (r >= type.altgraphics.length) {
                                mapTile.kind = type.graphic;
                            } else {
                                mapTile.kind = type.altgraphics[r];
                            }
                        } else {
                            mapTile.kind = type.graphic;
                        }
                    } else {
                        mapTile.flags = 0;
                        mapTile.kind = "";
                        mapTile.ascii = " ";
                    }

                    this.curMap.PlaceTileBase(t, y, mapTile);
                }
            }
        }

        if (rightmostHallway.x > connectPoint.x) {
            connectPoint.x = rightmostHallway.x;
            connectPoint.y = rightmostHallway.y;
        }
        this.DigHallToMap(connectPoint);
    }

    DigHallToMap(startPoint: MapPos) {
        let mgpf: MapGenRoomPathfinder = new MapGenRoomPathfinder(this.curMap, this);
        let t = this.curMap.GetTileIfExists(startPoint.x, startPoint.y);
        if (t == null) {
            throw new Error("Can not dig hall from startPoint, is null " + JSON.stringify(startPoint));
        }
        mgpf.DigHallFromTileToNearestRoom(t);
    }

    PlaceWallsAndGenerateTilesFromROT(sizeX, sizeY, rotMap) {
        for (let y = 0; y < sizeY; y++) {
            for (let x = 0; x < sizeX; x++) {
                if (this.genMap[y][x] == 0) {
                    this.curMap.PlaceTileBase(
                        x,
                        y,
                        new MapTileGen(this.curMap).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_HALL),
                    );
                }
            }
        }

        for (let i = 0; i < rotMap._rooms.length; i++) {
            let room: MapRoomGen = this.curMap.AddRoom();
            let rotRoom = rotMap._rooms[i];
            let roomRect: MapRect = new MapRect(
                rotRoom._x1,
                rotRoom._y1,
                rotRoom._x2 - rotRoom._x1,
                rotRoom._y2 - rotRoom._y1,
            );
            room.rect = roomRect;

            if (rotMap._rooms[i] == rotMap._reservedRoom) {
                room.specialRoom = this.activeSpecialRoom;
                rotMap._reservedRoom.clearDoors();
                rotMap._rooms[i].exits = [];
                let bx: number = rotMap._reservedRoom._x1;
                let by: number = rotMap._reservedRoom._y1;

                for (let y = 0; y < rotMap.specialRoomData.map.length; y++) {
                    let row: string[] = rotMap.specialRoomData.map[y].split("");
                    for (let x = 0; x < row.length; x++) {
                        let tx = bx + x;
                        let ty = by + y;
                        if (row[x] == " " || row[x] == "") {
                            this.curMap.ClearTileBase(tx, ty);
                        } else if (row[x] == "┌") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.NW),
                            );
                        } else if (row[x] == "~") {
                            let water = rotMap.specialRoomData.tildeIsLava
                                ? GlobalConst.SPECIAL_TILE_TYPE.LAVA
                                : GlobalConst.SPECIAL_TILE_TYPE.WATER;
                            this.curMap.PlaceTileBase(tx, ty, new MapTileGen(this.curMap).SetFluid(water));
                        } else if (row[x] == "≈") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetFluid(GlobalConst.SPECIAL_TILE_TYPE.LAVA),
                            );
                        } else if (row[x] == "┐") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.NE),
                            );
                        } else if (row[x] == "└") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.SW),
                            );
                        } else if (row[x] == "┘") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.SE),
                            );
                        } else if (row[x] == "│") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.V),
                            );
                        } else if (row[x] == "─") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.H),
                            );
                        } else if (row[x] == "+") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.V),
                            );

                            room.reservedExits.push(new MapPos(tx, ty));
                        } else if (row[x] == "-") {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.H),
                            );
                            room.reservedExits.push(new MapPos(tx, ty));
                        } else {
                            this.curMap.PlaceTileBase(
                                tx,
                                ty,
                                new MapTileGen(this.curMap).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR),
                            );
                        }
                    }
                }

                continue;
            }

            for (let y = rotRoom._y1; y <= rotRoom._y2; y++) {
                for (let x = rotRoom._x1; x <= rotRoom._x2; x++) {
                    if (y != rotRoom._y1 && x != rotRoom._x1 && y != rotRoom._y2 && x != rotRoom._x2) {
                        this.curMap.PlaceTileBase(
                            x,
                            y,
                            new MapTileGen(this.curMap).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR),
                        );
                    } else if (y == rotRoom._y1 && x == rotRoom._x1) {
                        this.curMap.PlaceTileBase(x, y, new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.NW));
                    } else if (y == rotRoom._y1 && x == rotRoom._x2) {
                        this.curMap.PlaceTileBase(x, y, new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.NE));
                    } else if (y == rotRoom._y2 && x == rotRoom._x1) {
                        this.curMap.PlaceTileBase(x, y, new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.SW));
                    } else if (y == rotRoom._y2 && x == rotRoom._x2) {
                        this.curMap.PlaceTileBase(x, y, new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.SE));
                    } else if (y == rotRoom._y1 || y == rotRoom._y2) {
                        this.curMap.PlaceTileBase(x, y, new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.H));
                    } else if (x == rotRoom._x1 || x == rotRoom._x2) {
                        this.curMap.PlaceTileBase(x, y, new MapTileGen(this.curMap).SetWall(GlobalConst.WALL_TYPES.V));
                    }
                }
            }
        }
    }

    /*
    GenerateMap_Caves(size: number): GameMap {

        this.curMap = new GameMap(this.game);
        this.curMap.InitBlankMap(size);
        //@ts-ignore
        let rotMap = new Cellular(size, size, { connected: true });


        rotMap.randomize(.5);
        for (var i = 0; i < 4; i++) rotMap.create(this, this.ROTGenCallback);

        rotMap.connect(this.ROTGenCallback, 0);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (this.genMap[y][x] == 0) {
                    this.curMap.PlaceTileBase(x, y, new MapTileGen(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR));
                } else {
                    if (this.CheckAllNeighborValues(x, y, 0)) {
                        this.curMap.PlaceTileBase(x, y, new MapTileGen(this.game).SetWall(GlobalConst.WALL_TYPES.CAVEBLOCK));
                    } else {
                        this.curMap.ClearTileBase(x, y);
                    }

                }
            }
        }
        return this.curMap;
    }

    private CheckAllNeighborValues(x, y, valueToCheck: number): boolean {
        let ary: Array<MapPos> = this.getCardinalNeighbors(x, y);
        // ary.concat(this.getDiagNeighbors(x, y));
        let anyhits: boolean = false;
        for (let i = 0; i < ary.length; i++) {
            if (ary[i].y < this.genMap.length && this.genMap[ary[i].y] != null && ary[i].x < this.genMap[ary[i].y].length && this.genMap[ary[i].y][ary[i].x] == valueToCheck) {
                anyhits = true;
            }
        }
        return anyhits;
    }


   
        GenerateMap_Uniform(size: number): GameMap {
    
            this.curMap = new GameMap(this.game);
            this.curMap.InitBlankMap(size);
            let rotMap = new Uniform(size, size);
            rotMap.create(this, this.ROTGenCallback);
            return this.GenerateMap_Rot_stepTwo(size, rotMap);
    
        }
    */

    /**
     * Necessary error checker to make ROT generated rooms work with wall tiles.
     */
    private DoCornerHallRepairCheck(x, y) {
        let dns: Array<MapPos> = new MapPos(x, y).getDiagNeighbors();
        for (let i = 0; i < dns.length; i++) {
            // console.log("Checking diag nbr at " + dns[i].x + "," + dns[i].y);
            let t: MapTileGen | null = this.curMap.GetTileIfExists(dns[i].x, dns[i].y);
            if (t != null && t.IsHall()) {
                let t1 = this.curMap.GetTileIfExists(x, dns[i].y);
                let t2 = this.curMap.GetTileIfExists(dns[i].x, y);

                if ((t2 != null && t2.IsHall()) || (t1 != null && t1.IsHall())) {
                    //we're good, our corner hall is connected up
                } else {
                    //uh, need to dig.
                    if (t1 == null) {
                        this.curMap.PlaceTileBase(
                            x,
                            dns[i].y,
                            new MapTileGen(this.curMap).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_HALL),
                        );
                    } else if (t2 == null) {
                        this.curMap.PlaceTileBase(
                            dns[i].x,
                            y,
                            new MapTileGen(this.curMap).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_HALL),
                        );
                    } else {
                        //COULDNT RECONNECT MY BROKEN CORNER, MAP BROKEN
                        console.log("ORPH");
                        throw new Error("Map Gen Failed, orphaned corner");
                    }
                }
            }
        }
    }

    /*
        //single size, maps all square for now
        GenerateMap_Crude(size: number): GameMap {
            console.log("gen map");
            let genSuccess: boolean = false;
            let genCount: number = 0;
    
            while (!genSuccess) {
                genCount++;
                this.curMap = new GameMap(this.game);
                this.curMap.InitBlankMap(size);
    
                let errorFound: boolean = false;
    
                try {
                    //BEGIN ROOM GENERATION
    
                    //Since we want this to be faster we are losing the heavy randomization, instead
                    //we slice the space up into a bigger great which randomly partition into
                    //spaces for rooms. Not totally happy with this approach, but ok for now, probably
                    //need to go back to something more truly random
                    let quadCount: number = Math.ceil(size / MapGen.ROOM_QUAD_SIZE);
                    let quadGrid: any[][] = new Array(quadCount).fill("").map(() => new Array(quadCount).fill(""));
                    let placementQuads: Array<MapGenRoomQuad> = new Array();
    
                    //Create a grid of bigger squares
                    for (let qy: number = 0; qy < quadCount; qy++) {
                        quadGrid[qy] = new Array();
                        for (let qx: number = 0; qx < quadCount; qx++) {
    
                            quadGrid[qy][qx] = new MapGenRoomQuad(qx * MapGen.ROOM_QUAD_SIZE, qy * MapGen.ROOM_QUAD_SIZE, MapGen.ROOM_QUAD_SIZE - 1, MapGen.ROOM_QUAD_SIZE - 1);
                            if (quadGrid[qy][qx].bottomRight.x >= this.curMap.GetMapWidth()) {
                                quadGrid[qy][qx].UpdateBottomRight(this.curMap.GetMapWidth(), quadGrid[qy][qx].bottomRight.y);
                            }
                            if (quadGrid[qy][qx].bottomRight.y >= this.curMap.GetMapHeight()) {
                                quadGrid[qy][qx].UpdateBottomRight(quadGrid[qy][qx].bottomRight.x, this.curMap.GetMapHeight());
                            }
    
                        }
                    }
    
                    let bigQuadMaxCount: number = 3;
                    //Merge grids randomly into bigger boxes
                    for (let qy: number = 0; qy < quadCount; qy++) {
                        for (let qx: number = 0; qx < quadCount; qx++) {
                            let q: MapGenRoomQuad = quadGrid[qy][qx];
    
                            if (!q.merged) {
                                let r: number = this.game.rng.int(1, 100);
                                let rO: number = this.game.rng.int(1, 100);
                                if (r < 20) {
                                    if (rO < 50 && qx < quadCount - 1 && !quadGrid[qy][qx + 1].merged) {
                                        quadGrid[qy][qx + 1].mergeWith(quadGrid[qy][qx]);
                                    } else if (qy < quadCount - 1 && !quadGrid[qy + 1][qx].merged) {
                                        quadGrid[qy + 1][qx].mergeWith(quadGrid[qy][qx]);
                                    }
                                } else if (r < 70 || bigQuadMaxCount <= 0) {
                                    if (qx < quadCount - 1 && qy < quadCount - 1 && !quadGrid[qy][qx + 1].merged && !quadGrid[qy + 1][qx].merged && !quadGrid[qy + 1][qx + 1].merged) {
                                        quadGrid[qy][qx + 1].mergeWith(q);
                                        quadGrid[qy + 1][qx].mergeWith(q);
                                        quadGrid[qy + 1][qx + 1].mergeWith(q);
                                    }
                                } else if (bigQuadMaxCount > 0) {
    
                                    if (rO < 50 && qx < quadCount - 2 && qy < quadCount - 1 && !quadGrid[qy][qx + 1].merged && !quadGrid[qy][qx + 2].merged && !quadGrid[qy + 1][qx].merged && !quadGrid[qy + 1][qx + 1].merged && !quadGrid[qy + 1][qx + 2].merged) {
                                        quadGrid[qy][qx + 1].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy + 1][qx + 1].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy + 1][bigQuadMaxCount].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy][qx + 2].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy + 1][qx + 2].mergeWith(quadGrid[qy][qx]);
                                        bigQuadMaxCount--;
                                    } else if (qx < quadCount - 1 && qy < quadCount - 2 && !quadGrid[qy][qx + 1].merged && !quadGrid[qy + 1][qx].merged && !quadGrid[qy + 1][qx + 1].merged && !quadGrid[qy + 2][qx].merged && !quadGrid[qy + 2][qx + 1].merged) {
                                        quadGrid[qy][qx + 1].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy + 1][qx + 1].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy + 1][qx].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy + 2][qx].mergeWith(quadGrid[qy][qx]);
                                        quadGrid[qy + 2][qx + 1].mergeWith(quadGrid[qy][qx]);
                                        bigQuadMaxCount--;
                                    }
                                }
                            }
                        }
                    }
    
                    //Build final quads list
                    for (let qy: number = 0; qy < quadCount; qy++) {
                        for (let qx: number = 0; qx < quadCount; qx++) {
                            let q: MapGenRoomQuad = quadGrid[qy][qx];
    
                            if (!q.merged && q.tilecount > 1) {
                                placementQuads.push(q);
                            }
                        }
                    }
    */

    /*
    for (let i = 0; i < placementQuads.length; i++) {
        //console.log("Q SIZE " + placementQuads[i].tilecount + " str: " + placementQuads[i].ToStr());
        //let newRoom: MapRoom = new MapRoom(this.curMap);
        this.PlaceRoomInRect(placementQuads[i]);
    }
*/

    /*
                    this.game.rng.shuffleArray(placementQuads);
                    let minRooms = MathUtil.clampInt(placementQuads.length / 2, 3, placementQuads.length - 1);
                    let maxRooms = MathUtil.clampInt(placementQuads.length / 2 + 4, 1, placementQuads.length - 1);
    
                    let roomCount: number = this.game.rng.int(minRooms, maxRooms);
                    let roomsPlaced: number = 0;
                    let qidx: number = 0;
                    while (roomsPlaced < roomCount) {
                        let newRoom: MapRoom | null = this.TryPlaceRoom(placementQuads[qidx]);
    
                        if (newRoom != null) {
                            this.curMap.rooms.push(newRoom);
                            roomsPlaced++;
                        }
                        qidx++;
    
    
                    }
    
    
                    let hallgen: MapGenHalls = new MapGenHalls(this.game, this);
                    hallgen.DigHalls();
    
    
                    // console.log("rooms placed " + roomsPlaced);
                } catch (e) {
                    console.log("room gen failed " + e);
                    errorFound = true;
                } finally {
                    if (!errorFound) {
                        genSuccess = true;
                    }
                }
    
    
                return this.curMap;
            }
    
            throw new Error("Map Generator Failed");
        }
    
        //Places a room in this.curMapGen
        TryPlaceRoom(placementArea: MapRect): MapRoom | null {
            let mapRoom: MapRoom | null = null;
            let minW: number = MathUtil.clampInt(placementArea.extents.x - 8, 6, placementArea.extents.x - 1);
            let minH: number = MathUtil.clampInt(placementArea.extents.y - 8, 6, placementArea.extents.y - 1);
            let maxW: number = MathUtil.clampInt(placementArea.extents.x - 1, 5, 13);
            let maxH: number = MathUtil.clampInt(placementArea.extents.y - 1, 5, 13);
    
            let targetHeight: number = this.game.rng.int(minH, maxH);
            let targetWidth: number = this.game.rng.int(minW, maxW);
            try {
                let loc: MapRect = this.GetSpotForRoom(placementArea, targetWidth, targetHeight);
                if (loc != null && loc.IsSet()) {
                    mapRoom = this.PlaceRoomInRect(loc);
                    return mapRoom;
                } else {
                    return mapRoom;
                }
    
            } catch (e) {
                console.log("failed to place room" + e);
                return mapRoom;
            }
        }
    
    
        //Places a room in this.curMapGen
        PlaceRoomInRect(loc: MapRect): MapRoom {
            try {
                let mapRoom = new MapRoom(this.game);
                mapRoom.rect = loc;
                for (let ry = loc.origin.y; ry <= loc.bottomRight.y; ry++) {
                    for (let rx = loc.origin.x; rx <= loc.bottomRight.x; rx++) {
                        let tile: MapTileGen| null = null;
    
                        if (rx == loc.origin.x && ry == loc.origin.y) {
                            tile = new MapTileGen(this.game).SetWall(GlobalConst.WALL_TYPES.NW);
                        } else if (rx == loc.bottomRight.x && ry == loc.origin.y) {
                            tile = new MapTileGen(this.game).SetWall(GlobalConst.WALL_TYPES.NE);
                        } else if (rx == loc.bottomRight.x && ry == loc.bottomRight.y) {
                            tile = new MapTileGen(this.game).SetWall(GlobalConst.WALL_TYPES.SE);
                        } else if (rx == loc.origin.x && ry == loc.bottomRight.y) {
                            tile = new MapTileGen(this.game).SetWall(GlobalConst.WALL_TYPES.SW);
                        } else if (rx == loc.origin.x || rx == loc.bottomRight.x) {
                            tile = new MapTileGen(this.game).SetWall(GlobalConst.WALL_TYPES.V);
                            mapRoom.$possibleExits.push(new MapPos(rx, ry));
                        } else if (ry == loc.origin.y || ry == loc.bottomRight.y) {
                            tile = new MapTileGen(this.game).SetWall(GlobalConst.WALL_TYPES.H);
                            mapRoom.$possibleExits.push(new MapPos(rx, ry));
                        } else {
                            tile = new MapTileGen(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR);
                        }
    
                        if (tile != null) {
                            this.curMap.PlaceTileBase(rx, ry, tile);
                        } else {
                            throw new Error("failed to place room tile at " + rx + "," + ry);
                        }
                    }
                }
    
                return mapRoom;
            } catch (e) {
                console.log("failed" + e);
                throw new Error("room place failed");
            }
        }
    
        //Returns a rect with spot for room
        //TODO: if spot doesnt work keep shifting/shrinking til it does?
        //TODO: maybe have this work in quadrants?
        private GetSpotForRoom(searchRect: MapRect, targetSizeX: number, targetSizeY: number): MapRect {
            let spot: MapRect = new MapRect();
            let sanity: number = 200;
            let shrinkCheck: number = 3;
            while (!spot.IsSet() && sanity > 0) {
                sanity--;
                shrinkCheck--;
                if (shrinkCheck <= 0) {
                    shrinkCheck = 5;
    
                    if (targetSizeX > targetSizeY && targetSizeX > 4) {
                        targetSizeX--;
                    } else if (targetSizeY > 4) {
                        targetSizeY--;
                    }
                }
                let xr = this.game.rng.int(searchRect.origin.x, searchRect.bottomRight.x - targetSizeX - 1);
                let yr = this.game.rng.int(searchRect.origin.y, searchRect.bottomRight.y - targetSizeY - 1);
                let checkSpot: MapRect = new MapRect(xr, yr, targetSizeX, targetSizeY);
                if (searchRect.SpotIsEmpty(this.curMap, checkSpot, MapGen.MIN_SPACE_BETWEEN_ROOMS)) {
                    return checkSpot;
                }
            }
            throw new Error("no spot found in " + searchRect.ToStr() + " for " + targetSizeX + "," + targetSizeY);
        }
    */
}

namespace MapGen2 {
    export enum GEN_METHOD {
        CRUDE,
        DIGGER,
        UNIFORM,
        ROGUE,
        CAVES,
    }
}

export default MapGen;
