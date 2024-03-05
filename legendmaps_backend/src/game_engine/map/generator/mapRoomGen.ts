import MapRect from "../../utils/mapRect";
import MathUtil from "../../utils/mathUtil";
import MapPos from "../../utils/mapPos";
import ArrayUtil from "../../utils/arrayUtil";
import MapObjectStatic from "../mapTile";
import RandomUtil from "../../utils/randomUtil";
import GameMapGen from "./gameMapGen";
import MapTileGen from "./mapTileGen";
import GlobalConst from "../../types/globalConst";

/**
 * Rooms
 */
export default class MapRoomGen {
    rect: MapRect;
    exits: Array<MapPos>; //established exit positions
    $possibleExits: Array<MapPos>; //used in map generation, dont need to save
    $connectedRooms: Array<MapRoomGen>; //used in map generation, dont need to save
    map: GameMapGen; //use in map generation
    reservedExits: Array<MapPos> = [];
    specialRoom: GlobalConst.SPECIAL_ROOM = undefined;

    constructor(parentMap: GameMapGen) {
        this.map = parentMap;
        this.rect = new MapRect();
        this.exits = new Array();
        this.$connectedRooms = new Array();
        this.$possibleExits = new Array();
        this.reservedExits = [];
    }

    debug() {
        console.log("~" + this.rect.ToStr() + " " + this.exits.length + " " + this.specialRoom);
    }

    AddExit(pos: MapPos) {
        let found: boolean = false;
        for (let p = 0; p < this.exits.length; p++) {
            if (this.exits[p].x == pos.x && this.exits[p].y == pos.y) {
                found = true;
            }
        }
        if (!found) {
            this.exits.push(pos);
        }
    }

    GetCenter(): MapPos {
        return new MapPos(
            Math.round(this.rect.origin.x + this.rect.extents.x / 2),
            Math.round(this.rect.origin.y + this.rect.extents.y / 2),
        );
    }

    GetAllPossibleExits(sortedByDistanceTo?: MapPos): Array<MapPos> {
        this.$possibleExits = new Array<MapPos>();

        if (this.reservedExits.length > 0) {
            this.$possibleExits = this.reservedExits;
        } else {
            for (let y = this.rect.origin.y; y <= this.rect.bottomRight.y; y++) {
                for (let x = this.rect.origin.x; x <= this.rect.bottomRight.x; x++) {
                    let mt = this.map.GetTileIfExists(x, y);
                    if (mt != null && mt.IsFlatWall()) {
                        let nbrs: Array<MapTileGen> = mt.getCardinalNeighbors();
                        //must have walls on 2 sides to be a valid door location
                        let wallcnt: number = 0;
                        for (let i = 0; i < nbrs.length; i++) {
                            if (nbrs[i].IsWall()) {
                                wallcnt++;
                            }
                        }
                        if (wallcnt >= 2) {
                            this.$possibleExits.push(mt.pos);
                        }
                    }
                }
            }

            this.$possibleExits.concat(this.exits); //adding existing exits
        }

        if (sortedByDistanceTo != null) {
            this.$possibleExits = this.$possibleExits.sort((a: MapPos, b: MapPos) => {
                if (sortedByDistanceTo.distCardinal(a) < sortedByDistanceTo.distCardinal(b)) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }

        return this.$possibleExits;
    }

    GetExistingExits(sortedByDistanceTo?: MapPos): Array<MapPos> {
        if (sortedByDistanceTo != null) {
            this.exits = this.exits.sort((a: MapPos, b: MapPos) => {
                if (sortedByDistanceTo.distCardinal(a) < sortedByDistanceTo.distCardinal(b)) {
                    return -1;
                } else {
                    return 1;
                }
            });

            return this.exits;
        } else {
            return this.exits;
        }
    }

    ExitPointUsed(g: MapPos) {
        this.exits.push(g);
    }
}
