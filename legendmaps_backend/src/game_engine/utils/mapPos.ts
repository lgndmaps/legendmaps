import { MapPosD } from "../types/globalTypes";
import MathUtil from "./mathUtil";

export default class MapPos implements MapPosD {
    x: number;
    y: number;

    constructor(x: number = -1, y: number = -1) {
        this.x = x;
        this.y = y;
    }

    public toString = (): string => {
        return "(" + this.x + ", " + this.y + ")";
    };

    AddMapPos(posToAdd: MapPos): MapPos {
        return new MapPos(this.x + posToAdd.x, this.y + posToAdd.y);
    }

    isPlaced(): boolean {
        return this.x >= 0 && this.y >= 0;
    }

    equalsPos(gridPos: MapPos): boolean {
        return this.x == gridPos.x && this.y == gridPos.y;
    }

    equals(x: number, y: number): boolean {
        return this.x == x && this.y == y;
    }

    isOnLinePathTo(targetPos: MapPos): boolean {
        let xdiff: number = targetPos.x - this.x;
        let ydiff: number = targetPos.y - this.y;
        if (xdiff == 0) {
            return true;
        } else if (ydiff == 0) {
            return true;
        } else if (Math.abs(xdiff) == Math.abs(ydiff)) {
            //diagonals
            return true;
        }
        return false;
    }

    /*
    Returns path including targetPos if target is on straight line in one of 8 main directions, 
    does not check for collisions/visibility,
    returns empty if path not straight line
    */
    GetLinePathTo(targetPos: MapPos): Array<MapPos> {
        let linepath: Array<MapPos> = [];
        let stepPos: MapPos = new MapPos(0, 0);
        let xdiff: number = targetPos.x - this.x;
        let ydiff: number = targetPos.y - this.y;
        if (xdiff == 0) {
            stepPos.y = MathUtil.clamp(ydiff, -1, 1);
        } else if (ydiff == 0) {
            stepPos.x = MathUtil.clamp(xdiff, -1, 1);
        } else if (Math.abs(xdiff) == Math.abs(ydiff)) {
            //diagonals
            stepPos.x = MathUtil.clamp(xdiff, -1, 1);
            stepPos.y = MathUtil.clamp(ydiff, -1, 1);
        }
        let cx: number = this.x;
        let cy: number = this.y;
        while (!targetPos.equals(cx, cy)) {
            cx += stepPos.x;
            cy += stepPos.y;
            linepath.push(new MapPos(cx, cy));
        }
        return linepath;
    }

    distCardinal(gridPos: MapPos): number {
        let d: number = Math.abs(gridPos.x - this.x) + Math.abs(gridPos.y - this.y);
        return d;
    }

    getCardinalNeighbors(): Array<MapPos> {
        let nb: Array<MapPos> = new Array();
        nb.push(new MapPos(this.x + 1, this.y));
        nb.push(new MapPos(this.x - 1, this.y));
        nb.push(new MapPos(this.x, this.y + 1));
        nb.push(new MapPos(this.x, this.y - 1));
        return nb;
    }

    getDiagNeighbors(): Array<MapPos> {
        let nb: Array<MapPos> = new Array();
        nb.push(new MapPos(this.x + 1, this.y + 1));
        nb.push(new MapPos(this.x - 1, this.y - 1));
        nb.push(new MapPos(this.x - 1, this.y + 1));
        nb.push(new MapPos(this.x + 1, this.y - 1));
        return nb;
    }

    getAllNeighbors(): Array<MapPos> {
        return this.getCardinalNeighbors().concat(this.getDiagNeighbors());
    }

    toStr(): string {
        return "x:" + this.x + ",y:" + this.y;
    }
}
