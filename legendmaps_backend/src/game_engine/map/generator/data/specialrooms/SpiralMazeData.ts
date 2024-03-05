import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class SpiralMazeData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.SPIRAL_MAZE);
        this.introText = "The smooth walls of this chamber wind in upon themselves like a nautilus shell...";
        this.traps = [
            { type: GlobalConst.TRAP_TYPES.GAS, spot: 1 },
            { type: GlobalConst.TRAP_TYPES.LIGHTNING, spot: 2 },
            { type: GlobalConst.TRAP_TYPES.SPIKED_WALL, spot: 3 },
        ];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.ADV_CHEST, spot: 4 },
            { type: GlobalConst.STORY_EVENT_KEYS.BASIC_CHEST, spot: 5 },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.GIANT_RAT }]; //any?
        this.items = [{ type: GlobalConst.JEWELRY_BASE_TYPE.RING, rarity: GlobalConst.RARITY.RARE }];
        this.map = [
            "┌────────-┐              ",
            "+.........│              ",
            "│.┌─────┐.│              ",
            "│.│.....│.+              ",
            "│.│.┌─┐.│.│              ",
            "│1│2│4│3│.│              ",
            "│.│..5│.│.+              ",
            "│.└───┘.│.│              ",
            "│.......│.│              ",
            "└───────┘-┘              ",
        ];
        /*
"┌────────-┐              ",
"│.........│              ",
"│.┌─────┐.│              ",
"│.│.....│.+              ",
"│.│.┌─┐.│.│              ",
"│Õ│Õ│▄│Õ│.│              ",
"│.│...│.│.+              ",
"│.└───┘.│.│              ",
"│.......│.│              ",
"└───────┘™┘              ",
         */
    }
}
