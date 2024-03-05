import { CreateCallback } from "./map";
import RotDungeon from "./rotdungeon";
import { Room, Corridor } from "./features";
import RNG from "../rng";
import GameMap from "../../gameMap";
import MapGen from "../../generator/mapGen";
import SpecialRoomData from "../../generator/data/specialrooms/SpecialRoomData";

interface Options {
    roomWidth: [number, number] /* room minimum and maximum width */;
    roomHeight: [number, number] /* room minimum and maximum height */;
    roomDugPercentage: number /* we stop after this percentage of level area has been dug out by rooms */;
    timeLimit: number /* we stop after this much time has passed (msec) */;
}

type Point = [number, number];

/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
export default class Uniform extends RotDungeon {
    _options: Options;
    _roomAttempts: number;
    _corridorAttempts: number;
    _connected: Room[];
    _unconnected: Room[];
    _map: number[][];
    _dug: number;
    _reservedx: number = 0;
    _reservedRoom: Room;
    _reservedRoomSizer: Room;
    specialRoomData: SpecialRoomData;

    constructor(reservedX: number, width: number, height: number, seed?: number, options?: Partial<Options>) {
        super(width, height);

        this._reservedx = reservedX;
        this._options = {
            roomWidth: [3, 11] /* room minimum and maximum width */,
            roomHeight: [3, 7] /* room minimum and maximum height */,
            roomDugPercentage: 0.6 /* we stop after this percentage of level area has been dug out by rooms */,
            timeLimit: 5000 /* we stop after this much time has passed (msec) */,
        };
        //Object.assign(this._options, options);

        this._map = [];
        this._dug = 0;
        this._roomAttempts = 120; /* new room is created N-times until is considered as impossible to generate */
        this._corridorAttempts = 120; /* corridors are tried N-times until the level is considered as impossible to connect */

        this._connected = []; /* list of already connected rooms */
        this._unconnected = []; /* list of remaining unconnected rooms */

        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
        if (seed != null && seed > -1) {
            RNG.setSeed(seed);
        }
    }

    addReservedRoom(specialRoomData: SpecialRoomData, x2: number, y2: number) {
        this._reservedRoomSizer = new Room(0, 0, x2, y2);
        this._reservedRoom = this._reservedRoomSizer;
        this.specialRoomData = specialRoomData;
    }

    /**
     * Create a map. If the time limit has been hit, returns null.
     * @see ROT.Map#create
     */
    create(mapGen: MapGen, callback?: CreateCallback) {
        this.mapGen = mapGen;
        let t1 = Date.now();
        let cx = 6;
        let cy = 0;

        let w = this._width - 2;
        let h = this._height - 2;

        while (1) {
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                return null;
            } /* time limit! */

            this._map = this._fillMap(1);
            this._dug = 0;
            this._rooms = [];
            this._unconnected = [];

            if (this._reservedRoom != null) {
                let spec = this._generateSpecialRoomHolder(this._reservedRoomSizer._x2, this._reservedRoomSizer._y2);
                if (spec != null) {
                    this._reservedRoom = spec;
                } else {
                    continue;
                }
            }
            // console.log("RR:" + this._reservedRoom.debug());
            this._generateRooms();
            // this._generateRoomsFill(cx, cy);
            if (this._rooms.length < 7) {
                continue;
            }

            break; //corridor constructions going to be handled by our A*
            /*
            if (this._generateCorridors()) {
                break;
            } else {
                console.log("corr fail");
            }
             */
        }

        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(this.mapGen, i, j, this._map[i][j]);
                }
            }
        }

        return this;
    }

    _generateSpecialRoomHolder(w: number, h: number) {
        let count = 0;
        while (count < this._roomAttempts) {
            count++;

            let room = Room.createRandomFixedSize(this._width, this._height, w, h, this._options);
            if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
                continue;
            }

            room.create(this._digCallback);
            this._rooms.push(room);
            return room;
        }

        /* no room was generated in a given number of attempts */
        return null;
    }
    /**
     * Generates a suitable amount of rooms
     */
    _generateRooms() {
        let w = this._width - 2;
        let h = this._height - 2;

        let room;
        do {
            room = this._generateRoom();
            if (this._dug / (w * h) > this._options.roomDugPercentage) {
                console.log("FILLED ROOM DUG PERC");
                break;
            } /* achieved requested amount of free space */
        } while (room);

        /* either enough rooms, or not able to generate more of them :) */
    }

    /**
     * Try to generate one room
     */
    _generateRoom() {
        let count = 0;
        while (count < this._roomAttempts) {
            count++;

            let room = Room.createRandom(this._width, this._height, this._options);
            if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
                continue;
            }

            room.create(this._digCallback);
            this._rooms.push(room);
            return room;
        }

        /* no room was generated in a given number of attempts */
        return null;
    }

    /**
     * Generates connectors beween rooms
     * @returns {bool} success Was this attempt successfull?
     */
    _generateCorridors() {
        let cnt = 0;
        while (cnt < this._corridorAttempts) {
            cnt++;
            this._corridors = [];

            /* dig rooms into a clear map */
            this._map = this._fillMap(1);
            for (let i = 0; i < this._rooms.length; i++) {
                let room = this._rooms[i];
                room.clearDoors();
                room.create(this._digCallback);
            }

            this._unconnected = RNG.shuffle(this._rooms.slice());
            this._connected = [];
            if (this._unconnected.length) {
                this._connected.push(this._unconnected.pop() as Room);
            } /* first one is always connected */

            while (1) {
                /* 1. pick random connected room */
                let connected = RNG.getItem(this._connected);
                if (!connected) {
                    break;
                }

                /* 2. find closest unconnected */
                let room1 = this._closestRoom(this._unconnected, connected);
                if (!room1) {
                    break;
                }

                /* 3. connect it to closest connected */
                let room2 = this._closestRoom(this._connected, room1);
                if (!room2) {
                    break;
                }

                let ok = this._connectRooms(room1, room2);
                if (!ok) {
                    break;
                } /* stop connecting, re-shuffle */

                if (!this._unconnected.length) {
                    return true;
                } /* done; no rooms remain */
            }
        }
        return false;
    }

    /**
     * For a given room, find the closest one from the list
     */
    _closestRoom(rooms: Room[], room: Room): Room {
        let dist = Infinity;
        let center = room.getCenter();
        let result: Room | null = null;

        for (let i = 0; i < rooms.length; i++) {
            let r = rooms[i];
            let c = r.getCenter();
            let dx = c[0] - center[0];
            let dy = c[1] - center[1];
            let d = dx * dx + dy * dy;

            if (d < dist) {
                dist = d;
                result = r;
            }
        }

        if (result == null) {
            throw new Error("NO RESULT IN UNIFORM GEN");
        }
        return result;
    }

    _connectRooms(room1: Room, room2: Room) {
        /*
            room1.debug();
            room2.debug();
        */
        let center1 = room1.getCenter();
        let center2 = room2.getCenter();

        let diffX = center2[0] - center1[0];
        let diffY = center2[1] - center1[1];

        let start: Point | null;
        let end: Point | null;

        let dirIndex1, dirIndex2, min, max, index;
        if (Math.abs(diffX) < Math.abs(diffY)) {
            /* first try connecting north-south walls */
            dirIndex1 = diffY > 0 ? 2 : 0;
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getLeft();
            max = room2.getRight();
            index = 0;
        } else {
            /* first try connecting east-west walls */
            dirIndex1 = diffX > 0 ? 1 : 3;
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getTop();
            max = room2.getBottom();
            index = 1;
        }

        start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
        if (!start) {
            return false;
        }

        if (start[index] >= min && start[index] <= max) {
            /* possible to connect with straight line (I-like) */
            end = start.slice() as Point;
            let value = 0;
            switch (dirIndex2) {
                case 0:
                    value = room2.getTop() - 1;
                    break;
                case 1:
                    value = room2.getRight() + 1;
                    break;
                case 2:
                    value = room2.getBottom() + 1;
                    break;
                case 3:
                    value = room2.getLeft() - 1;
                    break;
            }
            end[(index + 1) % 2] = value;
            this._digLine([start, end]);
        } else if (start[index] < min - 1 || start[index] > max + 1) {
            /* need to switch target wall (L-like) */

            let diff = start[index] - center2[index];
            let rotation = 0;
            switch (dirIndex2) {
                case 0:
                case 1:
                    rotation = diff < 0 ? 3 : 1;
                    break;
                case 2:
                case 3:
                    rotation = diff < 0 ? 1 : 3;
                    break;
            }
            dirIndex2 = (dirIndex2 + rotation) % 4;

            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }

            let mid = [0, 0];
            mid[index] = start[index];
            let index2 = (index + 1) % 2;
            mid[index2] = end[index2];
            this._digLine([start as Point, mid as Point, end as Point]);
        } else {
            /* use current wall pair, but adjust the line in the middle (S-like) */

            let index2 = (index + 1) % 2;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            let mid = Math.round((end[index2] + start[index2]) / 2);

            let mid1 = [0, 0];
            let mid2 = [0, 0];
            mid1[index] = start[index];
            mid1[index2] = mid;
            mid2[index] = end[index];
            mid2[index2] = mid;
            this._digLine([start as Point, mid1 as Point, mid2 as Point, end as Point]);
        }

        room1.addDoor(start[0], start[1]);
        room2.addDoor(end[0], end[1]);

        index = this._unconnected.indexOf(room1);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room1);
        }

        index = this._unconnected.indexOf(room2);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room2);
        }

        return true;
    }

    _placeInWall(room: Room, dirIndex: number): Point | null {
        let start = [0, 0];
        let dir = [0, 0];
        let length = 0;

        switch (dirIndex) {
            case 0:
                dir = [1, 0];
                start = [room.getLeft(), room.getTop() - 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 1:
                dir = [0, 1];
                start = [room.getRight() + 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
            case 2:
                dir = [1, 0];
                start = [room.getLeft(), room.getBottom() + 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 3:
                dir = [0, 1];
                start = [room.getLeft() - 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
        }

        let avail: (Point | null)[] = [];
        let lastBadIndex = -2;

        for (let i = 0; i < length; i++) {
            let x = start[0] + i * dir[0];
            let y = start[1] + i * dir[1];
            avail.push(null);

            let isWall = this._map[x][y] == 1;
            if (isWall) {
                if (lastBadIndex != i - 1) {
                    avail[i] = [x, y];
                }
            } else {
                lastBadIndex = i;
                if (i) {
                    avail[i - 1] = null;
                }
            }
        }

        for (let i = avail.length - 1; i >= 0; i--) {
            if (!avail[i]) {
                avail.splice(i, 1);
            }
        }
        return avail.length ? RNG.getItem(avail) : null;
    }

    /**
     * Dig a polyline.
     */
    _digLine(points: Point[]) {
        for (let i = 1; i < points.length; i++) {
            let start = points[i - 1];
            let end = points[i];
            let corridor = new Corridor(start[0], start[1], end[0], end[1]);
            corridor.create(this._digCallback);
            this._corridors.push(corridor);
        }
    }

    _digCallback(x: number, y: number, value: number) {
        this._map[x][y] = value;
        if (value == 0) {
            this._dug++;
        }
    }

    _isWallCallback(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return this._map[x][y] == 1;
    }

    _canBeDugCallback(x: number, y: number) {
        //if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height || x < this._reservedx) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height || x < this._reservedx) {
            return false;
        }
        return this._map[x][y] == 1;
    }
}
