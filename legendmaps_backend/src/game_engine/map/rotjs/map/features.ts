import RNG from "../rng";
import MapPos from "../../../utils/mapPos";
import { AStarFinder } from "../../astar/finders/astar-finder";

interface RoomOptions {
    roomWidth: [number, number];
    roomHeight: [number, number];
}

interface CorridorOptions {
    corridorLength: [number, number];
}

interface FeatureOptions extends RoomOptions, CorridorOptions {}

export interface FeatureConstructor {
    createRandomAt: (x: number, y: number, dx: number, dy: number, options: FeatureOptions) => Feature;
}

interface DigCallback {
    (x: number, y: number, value: number): void;
}
interface TestPositionCallback {
    (x: number, y: number): boolean;
}

/**
 * @class Dungeon feature; has own .create() method
 */
abstract class Feature {
    abstract isValid(isWallCallback: TestPositionCallback, canBeDugCallback: TestPositionCallback): boolean;
    abstract create(digCallback: DigCallback): void;
    abstract debug(): void;
}

/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
export class Room extends Feature {
    _x1: number;
    _y1: number;
    _x2: number;
    _y2: number;
    _doors: { [key: string]: number };

    constructor(x1: number, y1: number, x2: number, y2: number, doorX?: number, doorY?: number) {
        super();
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        this._doors = {};
        if (doorX !== undefined && doorY !== undefined) {
            this.addDoor(doorX, doorY);
        }
    }

    /**
     * Room of random size, with a given doors and direction
     */
    static createRandomAt(x: number, y: number, dx: number, dy: number, options: RoomOptions) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = RNG.getUniformInt(min, max);

        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = RNG.getUniformInt(min, max);

        if (dx == 1) {
            /* to the right */
            let y2 = y - Math.floor(RNG.getUniform() * height);
            return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
        }

        if (dx == -1) {
            /* to the left */
            let y2 = y - Math.floor(RNG.getUniform() * height);
            return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
        }

        if (dy == 1) {
            /* to the bottom */
            let x2 = x - Math.floor(RNG.getUniform() * width);
            return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
        }

        if (dy == -1) {
            /* to the top */
            let x2 = x - Math.floor(RNG.getUniform() * width);
            return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
        }

        throw new Error("dx or dy must be 1 or -1");
    }

    /**
     * Room of random size, positioned around center coords
     */
    static createRandomCenter(cx: number, cy: number, options: RoomOptions) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = RNG.getUniformInt(min, max);

        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = RNG.getUniformInt(min, max);

        let x1 = cx - Math.floor(RNG.getUniform() * width);
        let y1 = cy - Math.floor(RNG.getUniform() * height);
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;

        return new this(x1, y1, x2, y2);
    }

    /**
     * Room of random size within a given dimensions
     */
    static createRandom(availWidth: number, availHeight: number, options: RoomOptions) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = RNG.getUniformInt(min, max);

        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = RNG.getUniformInt(min, max);

        let left = availWidth - width; //availWidth - width - 1;
        let top = availHeight - height; //availHeight - height - 1;

        let x1 = Math.floor(RNG.getUniform() * left); //1 + Math.floor(RNG.getUniform() * left);
        let y1 = Math.floor(RNG.getUniform() * top); //1 + Math.floor(RNG.getUniform() * top);
        let x2 = x1 + width; //x1 + width - 1;
        let y2 = y1 + height; // y1 + height - 1;

        return new this(x1, y1, x2, y2);
    }

    /**
     * Room of random size within a given dimensions
     */
    static createRandomFixedSize(
        availWidth: number,
        availHeight: number,
        width: number,
        height: number,
        options: RoomOptions,
    ) {
        //console.log("FIXED SIZE IS " + width + "," + height + " IN " + availWidth + "," + availHeight);
        let left = availWidth - width - 1; //availWidth - width - 1;
        let top = availHeight - height - 1; //availHeight - height - 1;

        let x1 = Math.floor(RNG.getUniform() * left); //1 + Math.floor(RNG.getUniform() * left);
        let y1 = Math.floor(RNG.getUniform() * top); //1 + Math.floor(RNG.getUniform() * top);
        let x2 = x1 + width; //x1 + width - 1;
        let y2 = y1 + height; // y1 + height - 1;
        // console.log("getting " + left + "," + top + " RECT IS:--> " + x1 + "," + y1 + " to " + x2 + "," + y2);
        return new this(x1, y1, x2, y2);
    }

    /**
     * PEG: Random room at set location
     */
    static createRandomAtNoDoor(x: number, y: number, availWidth: number, availHeight: number, options: RoomOptions) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = RNG.getUniformInt(min, max);

        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = RNG.getUniformInt(min, max);

        let left = availWidth - width - 1;
        let top = availHeight - height - 1;

        let x1 = 1 + x;
        let y1 = 1 + y;
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;

        //console.log("CREATING ROOM: " + x1 + "," + y1 + " to " + x2 + "," + y2);
        return new this(x1, y1, x2, y2);
    }

    addDoor(x: number, y: number) {
        this._doors[x + "," + y] = 1;
        return this;
    }

    /**
     * @param {function}
     */
    getDoors(cb: (x: number, y: number) => void) {
        for (let key in this._doors) {
            let parts = key.split(",");
            cb(parseInt(parts[0]), parseInt(parts[1]));
        }
        return this;
    }

    clearDoors() {
        this._doors = {};
        return this;
    }

    getDoorCount() {
        return Object.keys(this._doors).length;
    }

    addDoors(isWallCallback: TestPositionCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;

        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x != left && x != right && y != top && y != bottom) {
                    continue;
                }
                if (isWallCallback(x, y)) {
                    continue;
                }

                this.addDoor(x, y);
            }
        }

        return this;
    }

    debug() {
        console.log("room", this._x1, this._y1, this._x2, this._y2);
    }

    getTileSize(): number {
        let dx = this._x2 - this._x1;
        let dy = this._y2 - this._y1;
        return dx * dy;
    }

    isValid(isWallCallback: TestPositionCallback, canBeDugCallback: TestPositionCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;

        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x == left || x == right || y == top || y == bottom) {
                    if (!isWallCallback(x, y)) {
                        return false;
                    }
                } else {
                    if (!canBeDugCallback(x, y)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
     */
    create(digCallback: DigCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;

        let value = 0;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x + "," + y in this._doors) {
                    value = 2;
                } else if (x == left || x == right || y == top || y == bottom) {
                    value = 1;
                } else {
                    value = 0;
                }
                digCallback(x, y, value);
            }
        }
    }

    getCenter() {
        return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
    }

    getLeft() {
        return this._x1;
    }
    getRight() {
        return this._x2;
    }
    getTop() {
        return this._y1;
    }
    getBottom() {
        return this._y2;
    }
}

/**
 * @class Hallway -- PEG improved Corridor connecting two rooms dug with A star
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 *
 */
export class Hallway extends Feature {
    _startX: number;
    _startY: number;
    _endX: number;
    _endY: number;
    _endsWithAWall: boolean;
    _tiles: MapPos[];
    _matrix: number[][];

    constructor(map: number[][], startX: number, startY: number, endX: number, endY: number) {
        super();
        this._startX = startX;
        this._startY = startY;
        this._endX = endX;
        this._endY = endY;
        this._endsWithAWall = true;
        this._tiles = [];
        this._matrix = [];
        for (let y = 0; y < map.length; y++) {
            this._matrix[y] = [];
            for (let x = 0; x < map.length; x++) {
                //inverting states since our A Star expects walkables

                if (x == startX && y == startY) {
                    this._matrix[y][x] = 0;
                } else if (x == endX && y == endY) {
                    this._matrix[y][x] = 0;
                } else if (map[y][x] == 0) {
                    this._matrix[y][x] = 1;
                } else {
                    this._matrix[y][x] = 0;
                }
            }
        }
    }

    debug() {
        console.log("hallway", this._startX, this._startY, this._endX, this._endY);
    }

    isValid(isWallCallback: TestPositionCallback, canBeDugCallback: TestPositionCallback) {
        console.log("no test yet.");
        return true;
    }

    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */
    create(digCallback: DigCallback) {
        let aStarInstance: AStarFinder = new AStarFinder({
            grid: {
                matrix: this._matrix,
            },
            diagonalAllowed: false,

            //weight: .3,
            includeEndNode: true,
            includeStartNode: true,
        });

        let foundPath = aStarInstance.findPath({ x: this._startX, y: this._startY }, { x: this._endX, y: this._endY });
        this._tiles = new Array();
        //console.log("PATH IS " + foundPath.length);
        if (foundPath.length == 0) {
            console.log(
                "COULD NOT MAKE PATH FROM " + this._startX + "," + this._startY + "  " + this._endX + "," + this._endY,
            );
        }
        for (let p = 0; p < foundPath.length; p++) {
            let gp: MapPos = new MapPos(foundPath[p][0], foundPath[p][1]);

            this._tiles.push(gp);
            digCallback(gp.x, gp.y, 0);
        }

        return true;
    }
}

/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
export class Corridor extends Feature {
    _startX: number;
    _startY: number;
    _endX: number;
    _endY: number;
    _endsWithAWall: boolean;

    constructor(startX: number, startY: number, endX: number, endY: number) {
        super();
        this._startX = startX;
        this._startY = startY;
        this._endX = endX;
        this._endY = endY;
        this._endsWithAWall = true;
    }

    static createRandomAt(x: number, y: number, dx: number, dy: number, options: CorridorOptions) {
        let min = options.corridorLength[0];
        let max = options.corridorLength[1];
        let length = RNG.getUniformInt(min, max);

        return new this(x, y, x + dx * length, y + dy * length);
    }

    debug() {
        console.log("corridor", this._startX, this._startY, this._endX, this._endY);
    }

    isValid(isWallCallback: TestPositionCallback, canBeDugCallback: TestPositionCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;

        let ok = true;
        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;

            if (!canBeDugCallback(x, y)) {
                ok = false;
            }
            if (!isWallCallback(x + nx, y + ny)) {
                ok = false;
            }
            if (!isWallCallback(x - nx, y - ny)) {
                ok = false;
            }

            if (!ok) {
                length = i;
                this._endX = x - dx;
                this._endY = y - dy;
                break;
            }
        }

        /**
         * If the length degenerated, this corridor might be invalid
         */

        /* not supported */
        if (length == 0) {
            return false;
        }

        /* length 1 allowed only if the next space is empty */
        if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
            return false;
        }

        /**
         * We do not want the corridor to crash into a corner of a room;
         * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
         *
         * Situation:
         * #######1
         * .......?
         * #######2
         *
         * The corridor was dug from left to right.
         * 1, 2 - problematic corners, ? = N+1th cell (not dug)
         */
        let firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
        let secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
        this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
        if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
            return false;
        }

        return true;
    }

    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */
    create(digCallback: DigCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }

        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;
            digCallback(x, y, 0);
        }

        return true;
    }

    createPriorityWalls(priorityWallCallback: (x: number, y: number) => void) {
        if (!this._endsWithAWall) {
            return;
        }

        let sx = this._startX;
        let sy = this._startY;

        let dx = this._endX - sx;
        let dy = this._endY - sy;
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;

        priorityWallCallback(this._endX + dx, this._endY + dy);
        priorityWallCallback(this._endX + nx, this._endY + ny);
        priorityWallCallback(this._endX - nx, this._endY - ny);
    }
}
