import MapPos from "./mapPos";

class MapUtil {
    static GetVectorFromDir(dir: MapUtil.DIR): MapPos {
        //console.log("DIR" + dir);
        if (dir == MapUtil.DIR.NORTH) {
            return new MapPos(0, -1);
        } else if (dir == MapUtil.DIR.EAST) {
            return new MapPos(1, 0);
        } else if (dir == MapUtil.DIR.SOUTH) {
            return new MapPos(0, 1);
        } else if (dir == MapUtil.DIR.WEST) {
            return new MapPos(-1, 0);
        } else if (dir == MapUtil.DIR.NORTHEAST) {
            return new MapPos(1, -1);
        } else if (dir == MapUtil.DIR.NORTHWEST) {
            return new MapPos(-1, -1);
        } else if (dir == MapUtil.DIR.SOUTHEAST) {
            return new MapPos(1, 1);
        } else if (dir == MapUtil.DIR.SOUTHWEST) {
            return new MapPos(-1, 1);
        }
        return new MapPos(0, 0);
    }

    //if cardinal only is set, only counts steps N,S,E,W
    static DistBetween(pos1: MapPos, pos2: MapPos, cardinalOnly: boolean = false) {
        if (cardinalOnly) {
            return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
        } else {
            if (Math.abs(pos1.x - pos2.x) > Math.abs(pos1.y - pos2.y)) {
                return Math.abs(pos1.x - pos2.x);
            } else {
                return Math.abs(pos1.y - pos2.y);
            }
        }
    }
}

namespace MapUtil {
    export enum DIR {
        NORTH = "N",
        NORTHEAST = "NE",
        EAST = "E",
        SOUTHEAST = "SE",
        SOUTH = "S",
        SOUTHWEST = "SW",
        WEST = "W",
        NORTHWEST = "NW",
    }
}

export default MapUtil;
