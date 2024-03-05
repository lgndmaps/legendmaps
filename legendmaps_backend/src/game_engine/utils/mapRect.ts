import GameMap from "../map/gameMap";
import { MapRectD } from "../types/globalTypes";
import MapPos from "./mapPos";
import MathUtil from "./mathUtil";

export default class MapRect implements MapRectD {
    static EMPTY: MapRect = new MapRect();
    origin: MapPos;
    extents: MapPos;
    bottomRight: MapPos;

    constructor(originX: number = -1, originY: number = -1, extentsX: number = -1, extentsY: number = -1) {
        this.origin = new MapPos(originX, originY);
        this.extents = new MapPos(extentsX, extentsY);
        this.bottomRight = new MapPos(this.origin.x + this.extents.x, this.origin.y + this.extents.y);
    }

    TileIsPartOfRect(x: number, y: number): boolean {
        if (x >= this.origin.x && x <= this.bottomRight.x && y >= this.origin.y && y <= this.bottomRight.y) {
            return true;
        } else {
            return false;
        }
    }

    FitsInside(outerGrid: MapRect): boolean {
        if (
            this.origin.x >= outerGrid.origin.x &&
            this.origin.y >= outerGrid.origin.y &&
            this.bottomRight.x <= outerGrid.bottomRight.x &&
            this.bottomRight.y <= outerGrid.bottomRight.y
        ) {
            return true;
        } else {
            return false;
        }
    }

    SpotIsEmpty(gameMap: GameMap, searchRect: MapRect, padding: number = 1): boolean {
        try {
            let minY = MathUtil.clamp(searchRect.origin.y - padding, 0, gameMap.GetMapHeight());
            let maxY = MathUtil.clamp(searchRect.bottomRight.y + padding, 0, gameMap.GetMapHeight());

            let minX = MathUtil.clamp(searchRect.origin.x - padding, 0, gameMap.GetMapWidth());
            let maxX = MathUtil.clamp(searchRect.bottomRight.x + padding, 0, gameMap.GetMapWidth());

            for (let y = minY; y <= maxY; y++) {
                for (let x = minX; x <= maxX; x++) {
                    if (!gameMap.IsVoidSpot(x, y)) {
                        return false;
                    }
                }
            }
        } catch (e) {
            console.log("space check failed, but was not caught");
            return false;
        }
        return true;
    }

    UpdateOrigin(x: number, y: number) {
        this.origin.x = x;
        this.origin.y = y;
        this.bottomRight.x = this.origin.x + this.extents.x;
        this.bottomRight.y = this.origin.y + this.extents.y;
    }

    UpdateExtents(x: number, y: number) {
        this.extents.x = x;
        this.extents.y = y;
        this.bottomRight = new MapPos(this.origin.x + this.extents.x, this.origin.y + this.extents.y);
    }

    UpdateBottomRight(x: number, y: number) {
        this.bottomRight.x = x;
        this.bottomRight.y = y;
        this.extents = new MapPos(this.bottomRight.x - this.origin.x, this.bottomRight.y - this.origin.y);
    }

    IsSet(): boolean {
        return this.origin.x >= 0 && this.origin.y >= 0 && this.extents.x >= 0 && this.extents.y >= 0;
    }

    HasOrigin(): boolean {
        return this.origin.x >= 0 && this.origin.y >= 0;
    }

    UnSet(): void {
        this.origin.x = -1;
        this.origin.y = -1;
        this.extents.x = -1;
        this.extents.y = -1;
    }

    ToStr(): string {
        return "RECT OR:" + this.origin.toStr() + " EXT:" + this.extents.toStr() + " BR:" + this.bottomRight.toStr();
    }
}
