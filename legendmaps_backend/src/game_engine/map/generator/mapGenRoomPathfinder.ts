import { AStarFinder } from "../astar/astar";
import MapPos from "../../utils/mapPos";
import MapRect from "../../utils/mapRect";
import MapGen from "./mapGen";
import MapGenHallPath from "./mapGenHallPath";
import GlobalConst from "../../types/globalConst";
import MapTileGen from "./mapTileGen";
import GameMapGen from "./gameMapGen";
import MapRoomGen from "./mapRoomGen";

export default class MapGenRoomPathfinder {
    astarMatrix: Array<any> = [];
    mapGen: MapGen;
    map: GameMapGen;

    constructor(gameMap: GameMapGen, parentMapGenerator: MapGen) {
        this.map = gameMap;
        this.mapGen = parentMapGenerator;
    }

    DigRoomHall(startRoom: MapRoomGen, startTile: MapPos, endRoom: MapRoomGen, endTile: MapPos): boolean {
        this.BuildAStarMatrix();
        let path: Array<MapPos> = this.ResolveAStar(startTile, endTile);

        if (path == undefined || path.length == 0) {
            this.map.PlaceTileBase(startTile.x, startTile.y, new MapTileGen(this.map).SetDoor());

            this.map.PlaceTileBase(endTile.x, endTile.y, new MapTileGen(this.map).SetDoor());

            return false;
        }

        for (let i = 0; i < path.length; i++) {
            this.map.PlaceTileBase(
                path[i].x,
                path[i].y,
                new MapTileGen(this.map).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_HALL),
            );
        }

        this.map.PlaceTileBase(
            startTile.x,
            startTile.y,
            new MapTileGen(this.map).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR),
        );

        this.map.PlaceTileBase(
            endTile.x,
            endTile.y,
            new MapTileGen(this.map).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR),
        );
        startRoom.$connectedRooms.push(endRoom);
        startRoom.AddExit(startTile);
        endRoom.AddExit(endTile);
        endRoom.$connectedRooms.push(startRoom);
        return true;
    }

    DigHallFromTileToNearestRoom(startTile: MapTileGen) {
        this.BuildAStarMatrix();
        let rooms: Array<MapRoomGen> = this.map.GetSortedClosestRoomsToPoint(startTile.pos);
        let foundPath: boolean = false;
        let targetTile: MapTileGen | null = null;
        let path: Array<MapPos> | null = null;
        let selectedRoom: MapRoomGen | null = null;

        //we check up to the first 3 rooms for closest path

        for (let r: number = 0; r < rooms.length; r++) {
            if (!foundPath) {
                let exits: Array<MapPos> = rooms[r].GetAllPossibleExits(startTile.pos);

                let testTargetTile: MapTileGen | null;
                //if existing exit is too far away, we're gonna dig a new one
                if (exits != undefined && exits.length > 0) {
                    testTargetTile = this.map.GetTileIfExists(exits[0].x, exits[0].y);
                }

                if (testTargetTile != null) {
                    let newpath: Array<MapPos> = this.ResolveAStar(
                        new MapPos(startTile.pos.x, startTile.pos.y),
                        new MapPos(testTargetTile.pos.x, testTargetTile.pos.y),
                    );

                    if (newpath.length > 0) {
                        if (path == null || newpath.length < path.length) {
                            selectedRoom = rooms[r];
                            path = newpath;
                            targetTile = testTargetTile;
                        }
                    }
                }

                if (r > 5) {
                    foundPath = true;
                }
            }
        }

        if (path != undefined && path.length > 0 && targetTile != undefined && selectedRoom != undefined) {
            for (let i = 0; i < path.length; i++) {
                this.map.PlaceTileBase(
                    path[i].x,
                    path[i].y,
                    new MapTileGen(this.map).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_HALL),
                );
            }

            this.map.PlaceTileBase(
                targetTile.pos.x,
                targetTile.pos.y,
                new MapTileGen(this.map).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR),
            );

            selectedRoom.AddExit(targetTile.pos);
        } else {
            console.log(
                "could not connect entrance " +
                    startTile.pos.x +
                    "," +
                    startTile.pos.y +
                    " " +
                    path +
                    " " +
                    targetTile +
                    " " +
                    selectedRoom,
            );
        }
    }

    BuildAStarMatrix() {
        this.astarMatrix = [];
        let rect: MapRect = this.mapGen.curMap.GetRect();
        for (let ry = rect.origin.y; ry < rect.bottomRight.y; ry++) {
            let innerrow: number[] = [];
            for (let rx = rect.origin.x; rx < rect.bottomRight.x; rx++) {
                let passableValue = 9; //impassable by default
                if (this.mapGen.curMap.IsVoidSpot(rx, ry)) {
                    passableValue = 2;
                } else {
                    let tile = this.mapGen.curMap.GetTileIfExists(rx, ry);
                    if (tile != null && tile.IsWalkable() && tile.kind == GlobalConst.GROUND_TYPES.DUNGEON_HALL) {
                        //only dig thru other halls, not floors.
                        passableValue = 0;
                    }
                }
                innerrow.push(passableValue);
            }
            this.astarMatrix.push(innerrow);
        }
        /*
        let debug: string = "";
        for (let ry = rect.origin.y; ry < rect.bottomRight.y; ry++) {
            for (let rx = rect.origin.x; rx < rect.bottomRight.x; rx++) {
                debug += this.astarMatrix[ry][rx];
            }
            debug += "\n";
        }
        console.log(debug);
        */
    }

    ResolveAStar(startPt: MapPos, endPt: MapPos): Array<MapPos> {
        this.astarMatrix[startPt.y][startPt.x] = 0;
        this.astarMatrix[endPt.y][endPt.x] = 0;
        let aStarInstance: AStarFinder = new AStarFinder({
            grid: {
                matrix: this.astarMatrix,
                maxCost: 3,
            },
            diagonalAllowed: false,

            //weight: .3,
            includeEndNode: false,
            includeStartNode: true,
        });

        let foundPath = aStarInstance.findPath({ x: startPt.x, y: startPt.y }, { x: endPt.x, y: endPt.y });
        let foundPathGridPoints: Array<MapPos> = new Array();
        for (let p = 0; p < foundPath.length; p++) {
            let gp: MapPos = new MapPos(foundPath[p][0], foundPath[p][1]);
            foundPathGridPoints.push(gp);
        }
        return foundPathGridPoints;
    }

    /*


        DigHalls() {
            // console.log("room count " + this.mapGen.curMap.rooms.length);
            for (let i = 0; i < this.mapGen.curMap.rooms.length; i++) {
                let rm: MapRoom = this.mapGen.curMap.rooms[i];
                let otherMapGenRoom: MapRoom | null = this.GetClosestRoom(rm, 3);
                // console.log("found closest room");
                if (otherMapGenRoom != null) {
                    // console.log("connecting " + rm.GetId() + " with " + otherMapGenRoom.GetId());
                    let hall: MapGenHallPath = this.GetMapGenHallPath(rm, otherMapGenRoom);
                    // console.log("running from " + hall.startPt.toStr() + " to " + hall.endPt.toStr());
                    rm.ExitPointUsed(hall.startPt);
                    otherMapGenRoom.ExitPointUsed(hall.endPt);
                    otherMapGenRoom.$connectedRooms.push(rm);
                    rm.$connectedRooms.push(otherMapGenRoom);
                    this.PlaceHall(hall);
                }

                //Below were used by special rooms, will likely be needed again
                // rm.ExitPointUsed(hall.startPt);
                // otherMapGenRoom.ExitPointUsed(hall.endPt);
                // console.log("digging hall  " + hall.steps.length);

            }
        }

        GetClosestRoom(rm: MapRoom, maxExitCount: number = 10): MapRoom | null {
            let targetRoom: MapRoom | null = null;
            let lastDist: number = 500;
            for (let i = 0; i < this.mapGen.curMap.rooms.length - 1; i++) {
                let r2: MapRoom = this.mapGen.curMap.rooms[i];
                let d: number = r2.GetCenter().distCardinal(rm.GetCenter());
                if (r2 != rm && !r2.$connectedRooms.includes(rm) && r2.exits.length < maxExitCount && (targetRoom == null || d < lastDist)) {
                    targetRoom = r2;
                    lastDist = d;
                }
            }
            return targetRoom;
        }

        GetMapGenHallPath(startMapGenRoom: MapRoom, endMapGenRoom: MapRoom): MapGenHallPath {
            this.BuildAStarMatrix();
            let bestPath: MapGenHallPath = new MapGenHallPath(new MapPos(), new MapPos());
            bestPath.score = -1000;
            bestPath.isDeadEnd = true;

            //TODO: Need to make this more elaborate at some point, results in very same-y connections
            let s1 = startMapGenRoom.GetClosestExitToPoint(endMapGenRoom.GetCenter());
            let startPts: Array<MapPos> = new Array();
            if (s1 != null) {
                startPts.push(s1);
            }

            let e1 = endMapGenRoom.GetClosestExitToPoint(startMapGenRoom.GetCenter());
            let endPts: Array<MapPos> = new Array();
            if (e1 != null) {
                endPts.push(e1);
            }

            // = startMapGenRoom.GetPossibleExits(this.mapGen.curMap);

            //endMapGenRoom.GetPossibleExits(this.mapGen.curMap);

            // ArrayUtil.shuffleInPlace(startPts);
            // ArrayUtil.shuffleInPlace(endPts);

            for (let s = 0; s < startPts.length; s++) {
                for (let e = 0; e < endPts.length; e++) {
                    let p: MapGenHallPath = new MapGenHallPath(startPts[s], endPts[e]);
                    p.buildPath(this);

                    if (p.isComplete() && !p.isDeadEnd) {
                        if (!bestPath.isComplete()) {
                            bestPath = p;
                        } else {
                            if (p.score > bestPath.score) {
                                bestPath = p;
                            }
                        }
                    }

                }
            }
            assert.ok(bestPath != null, "PATH IS NULL");
            return bestPath;
        }


        PlaceHall(hall: MapGenHallPath, endOnHall: boolean = false) {
            for (let s: number = 0; s < hall.steps.length; s++) {
                let step: MapPos = hall.steps[s];
                // console.log(step.toStr() + " D from end " + hall.endPt.toStr() + " is " + step.dist(hall.endPt));
                if (s == 0) {
                    //probably door
                    this.mapGen.curMap.PlaceTileBase(step.x, step.y, new MapTileGen(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR));
                } else if (!endOnHall && s == hall.steps.length - 1) {
                    //probably door
                    this.mapGen.curMap.PlaceTileBase(step.x, step.y, new MapTileGen(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR));
                } else {
                    this.mapGen.curMap.PlaceTileBase(step.x, step.y, new MapTileGen(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_HALL));
                }
            }
        }
    
      
    */
}
