import MapPos from "../../utils/mapPos";
import { MapGenHalls } from "./mapGenHalls";
import MapRoom from "./../mapRoom";

export default class MapGenHallPath {
    score: number;
    steps: Array<MapPos>;
    startPt: MapPos;
    endPt: MapPos;
    curNextStep: MapPos;
    isDeadEnd: boolean;
    rooms: Array<MapRoom>;

    constructor(startPt: MapPos, endPt: MapPos) {
        this.score = 0;
        this.steps = new Array();
        this.startPt = startPt;
        this.endPt = endPt;
        this.curNextStep = new MapPos();
        this.isDeadEnd = false;
        this.rooms = new Array(); //not always used
    }

    isComplete(): boolean {
        return this.steps.length > 1 && this.steps[this.steps.length - 1].equalsPos(this.endPt);
    }

    /*
    buildPath(map: MapGenHalls) {
        this.steps = map.ResolveAStar(this.startPt, this.endPt);
        this.score = 1000 - (this.steps.length * 3);
        this.isDeadEnd = false;
    }
    */
}
