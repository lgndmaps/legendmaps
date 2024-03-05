import TrapData from "./data/TrapData";
import GlobalConst from "../types/globalConst";
import Game from "../game";
import Trap from "./trap";
import TrapDataPit from "./data/TrapDataPit";
import StoryEventData from "../story/data/storyEventData";
import StoryEvent from "../story/storyEvent";
import TRAP_TYPES = GlobalConst.TRAP_TYPES;
import TrapDataGas from "./data/TrapDataGas";
import TrapDataSpikedWall from "./data/TrapDataSpikedWall";
import TrapDataLightning from "./data/TrapDataLightning";
import TrapDataWeb from "./data/TrapDataWeb";

export default class TrapFactory {
    trapData: Map<string, TrapData> = new Map();

    private static _instance: TrapFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    constructor() {
        this.trapData[GlobalConst.TRAP_TYPES.PIT] = new TrapDataPit();
        this.trapData[GlobalConst.TRAP_TYPES.GAS] = new TrapDataGas();
        this.trapData[GlobalConst.TRAP_TYPES.WEB] = new TrapDataWeb();
        this.trapData[GlobalConst.TRAP_TYPES.SPIKED_WALL] = new TrapDataSpikedWall();
        this.trapData[GlobalConst.TRAP_TYPES.LIGHTNING] = new TrapDataLightning();
    }

    CreateTrap(game: Game, kind: GlobalConst.TRAP_TYPES): Trap {
        let t: Trap = new Trap(game, "", kind);
        return t;
    }

    GetTrapData(kind: GlobalConst.TRAP_TYPES): TrapData {
        if (this.trapData[kind] == null) {
            throw new Error("Unknown trap: " + kind);
        }
        return this.trapData[kind];
    }
}
