import { CreateCallback } from "./map";
import RotDungeon from "./rotdungeon";
import { Room, Corridor, FeatureConstructor } from "./features";

import RNG from "../rng";
import { DIRS } from "../constants";
import MapGen from "../../generator/mapGen";

type FeatureType = "room" | "corridor";
const FEATURES = {
    room: Room,
    corridor: Corridor,
};

interface Options {
    roomWidth: [number, number];
    roomHeight: [number, number];
    corridorLength: [number, number];
    dugPercentage: number;
    timeLimit: number;
}

/**
 * Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 */
export default class Digger extends RotDungeon {
    _options: Options;
    _featureAttempts: number;
    _map: number[][];
    _walls: { [key: string]: number };
    _dug: number;
    _features: { [key: string]: number };
    _reservedX: number = 0;

    constructor(reservedx: number, width: number, height: number, options: Partial<Options> = {}, seed: number) {
        super(width, height);
        this._reservedX = reservedx;
        this._options = Object.assign(
            {
                roomWidth: [5, 9] /* room minimum and maximum width */,
                roomHeight: [5, 9] /* room minimum and maximum height */,
                corridorLength: [1, 10] /* corridor minimum and maximum length */,
                dugPercentage: 0.7 /* we stop after this percentage of level area has been dug out */,
                timeLimit: 5000 /* we stop after this much time has passed (msec) */,
            },
            options,
        );

        this._features = {
            room: 4,
            corridor: 4,
        };
        this._map = [];
        this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
        this._walls = {}; /* these are available for digging */
        this._dug = 0;

        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
        this._priorityWallCallback = this._priorityWallCallback.bind(this);
        if (seed != null && seed > -1) {
            RNG.setSeed(seed);
        }
    }

    create(mapgen: MapGen, callback?: CreateCallback) {
        this.mapGen = mapgen;
        this._rooms = [];
        this._corridors = [];
        this._map = this._fillMap(1);
        this._walls = {};
        this._dug = 0;
        let area = (this._width - 2) * (this._height - 2);

        this._firstRoom();

        let t1 = Date.now();

        let priorityWalls;
        do {
            priorityWalls = 0;
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                break;
            }

            /* find a good wall */
            let wall = this._findWall();
            if (!wall) {
                break;
            } /* no more walls */

            let parts = wall.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            let dir = this._getDiggingDirection(x, y);
            if (!dir) {
                continue;
            } /* this wall is not suitable */

            //		console.log("wall", x, y);

            /* try adding a feature */
            let featureAttempts = 0;
            do {
                featureAttempts++;
                if (this._tryFeature(x, y, dir[0], dir[1])) {
                    /* feature added */
                    //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
                    this._removeSurroundingWalls(x, y);
                    this._removeSurroundingWalls(x - dir[0], y - dir[1]);
                    break;
                }
            } while (featureAttempts < this._featureAttempts);

            for (let id in this._walls) {
                if (this._walls[id] > 1) {
                    priorityWalls++;
                }
            }
        } while (this._dug / area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */

        this._addDoors();

        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(this.mapGen, i, j, this._map[i][j]);
                }
            }
        }

        this._walls = {};
        this._map = [];

        return this;
    }

    _digCallback(x: number, y: number, value: number) {
        if (value == 0 || value == 2) {
            /* empty */
            this._map[x][y] = 0;
            this._dug++;
        } else {
            /* wall */
            this._walls[x + "," + y] = 1;
        }
    }

    _isWallCallback(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return this._map[x][y] == 1;
    }

    _canBeDugCallback(x: number, y: number) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return this._map[x][y] == 1;
    }

    _priorityWallCallback(x: number, y: number) {
        this._walls[x + "," + y] = 2;
    }

    _firstRoom() {
        let cx = Math.floor(this._width / 2);
        let cy = Math.floor(this._height / 2);
        let room = Room.createRandomCenter(cx, cy, this._options);
        this._rooms.push(room);
        room.create(this._digCallback);
    }

    /**
     * Get a suitable wall
     */
    _findWall() {
        let prio1: string[] = [];
        let prio2: string[] = [];
        for (let id in this._walls) {
            let prio = this._walls[id];
            if (prio == 2) {
                prio2.push(id);
            } else {
                prio1.push(id);
            }
        }

        let arr = prio2.length ? prio2 : prio1;
        if (!arr.length) {
            return null;
        } /* no walls :/ */

        let id = RNG.getItem(arr.sort()); // sort to make the order deterministic
        if (id != null) {
            delete this._walls[id];
        }

        return id;
    }

    /**
     * Tries adding a feature
     * @returns {bool} was this a successful try?
     */
    _tryFeature(x: number, y: number, dx: number, dy: number) {
        let featureName = RNG.getWeightedValue(this._features) as FeatureType;
        let ctor = FEATURES[featureName] as FeatureConstructor;
        let feature = ctor.createRandomAt(x, y, dx, dy, this._options);

        if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
            //		console.log("not valid");
            //		feature.debug();
            return false;
        }

        feature.create(this._digCallback);
        //	feature.debug();

        if (feature instanceof Room) {
            this._rooms.push(feature);
        }
        if (feature instanceof Corridor) {
            feature.createPriorityWalls(this._priorityWallCallback);
            this._corridors.push(feature);
        }

        return true;
    }

    _removeSurroundingWalls(cx: number, cy: number) {
        let deltas = DIRS[4];

        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];
            delete this._walls[x + "," + y];
            x = cx + 2 * delta[0];
            y = cy + 2 * delta[1];
            delete this._walls[x + "," + y];
        }
    }

    /**
     * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
     */
    _getDiggingDirection(cx: number, cy: number) {
        if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
            return null;
        }

        let result: number[] | null = null;
        let deltas = DIRS[4];

        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];

            if (!this._map[x][y]) {
                /* there already is another empty neighbor! */
                if (result) {
                    return null;
                }
                result = delta;
            }
        }

        /* no empty neighbor */
        if (!result) {
            return null;
        }

        return [-result[0], -result[1]];
    }

    /**
     * Find empty spaces surrounding rooms, and apply doors.
     */
    _addDoors() {
        let data = this._map;
        function isWallCallback(x: number, y: number) {
            return data[x][y] == 1;
        }
        for (let i = 0; i < this._rooms.length; i++) {
            let room = this._rooms[i];
            room.clearDoors();
            room.addDoors(isWallCallback);
        }
    }
}
