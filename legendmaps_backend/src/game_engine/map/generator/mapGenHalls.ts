import type Game from "../../game";
//import { AStarFinder } from "astar-typescript";
import MapPos from "../../utils/mapPos";
import MapRect from "../../utils/mapRect";
import MapTile from "../mapTile";
import MapGen from "./mapGen";
import MapGenHallPath from "./mapGenHallPath";
import MapRoom from "../mapRoom";
import assert from "assert";

export class MapGenHalls {
    astarMatrix: Array<any> = [];
    mapGen: MapGen;
    game: Game;

    constructor(game: Game, parentMapGenerator: MapGen) {
        this.game = game;
        this.mapGen = parentMapGenerator;
    }
    /*
        DigHalls() {
            
           // console.log("room count " + this.mapGen.curMap.rooms.length);
            for (let i = 0; i < this.mapGen.curMap.rooms.length; i++) {
                let rm: MapRoom = this.mapGen.curMap.rooms[i];
                let otherMapGenRoom: MapRoom|null= this.GetClosestRoom(rm, 3);
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
    
        GetClosestRoom(rm:MapRoom, maxExitCount:number=10):MapRoom|null {
            let targetRoom:MapRoom|null = null;
            let lastDist:number = 500;
            for (let i = 0; i < this.mapGen.curMap.rooms.length - 1; i++) {
                let r2:MapRoom = this.mapGen.curMap.rooms[i];
                let d:number = r2.GetCenter().distCardinal(rm.GetCenter());
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
            assert.ok(bestPath!=null, "PATH IS NULL");
            return bestPath;
        }
    
    
        PlaceHall(hall: MapGenHallPath, endOnHall: boolean = false) {
            for (let s: number = 0; s < hall.steps.length; s++) {
                let step: MapPos = hall.steps[s];
                // console.log(step.toStr() + " D from end " + hall.endPt.toStr() + " is " + step.dist(hall.endPt));
                if (s == 0) {
                    //probably door
                    this.mapGen.curMap.PlaceTileBase(step.x, step.y, new MapTile(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR));
                } else if (!endOnHall && s == hall.steps.length - 1) {
                    //probably door
                    this.mapGen.curMap.PlaceTileBase(step.x, step.y, new MapTile(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_FLOOR));
                } else {
                    this.mapGen.curMap.PlaceTileBase(step.x, step.y, new MapTile(this.game).SetGround(GlobalConst.GROUND_TYPES.DUNGEON_HALL));
                }
            }
        }
    
        BuildAStarMatrix() {
            this.astarMatrix = [];
            let rect:MapRect = this.mapGen.curMap.GetRect();
            
            for (let ry = rect.origin.y; ry < rect.bottomRight.y; ry++) {
                let innerrow: number[] = [];
                for (let rx = rect.origin.x; rx < rect.bottomRight.x; rx++) {
                    let passableValue = 1; //impassable by default
                    if (this.mapGen.curMap.IsVoidSpot(rx, ry)) {
                        passableValue = 0;
                    } else {
                        let tile:MapTile = this.mapGen.curMap.GetTileBase(rx,ry);
                        if (tile.IsWalkable() && tile.kind == GlobalConst.GROUND_TYPES.DUNGEON_HALL) {
                            //only dig thru other halls, not floors.
                            passableValue = 0;
                        } 
                    }
                    innerrow.push(passableValue);
                }
                this.astarMatrix.push(innerrow);
            }
        }
    
        ResolveAStar(startPt: MapPos, endPt: MapPos): Array<MapPos> {
            this.astarMatrix[startPt.y][startPt.x] = 0;
            this.astarMatrix[endPt.y][endPt.x] = 0;
            let aStarInstance: AStarFinder = new AStarFinder({
                grid: {
                    matrix: this.astarMatrix
                },
                diagonalAllowed: false,
                weight: .3,
                includeEndNode: true,
                includeStartNode: true
            });
    
            let foundPath = aStarInstance.findPath({ x: startPt.x, y: startPt.y }, { x: endPt.x, y: endPt.y });
            let foundPathGridPoints: Array<MapPos> = new Array();
            for (let p = 0; p < foundPath.length; p++) {
                let gp: MapPos = new MapPos(foundPath[p][0], foundPath[p][1]);
                foundPathGridPoints.push(gp);
            }
            return foundPathGridPoints;
        }
    */
}
