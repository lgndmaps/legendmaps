import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class RatWarrenData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.RAT_WARREN);
        this.introText = "You hear a scuttling of paws...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.GAS }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.TRASH_PILE },
            { type: GlobalConst.STORY_EVENT_KEYS.TRASH_PILE },
        ];
        this.dwellers = [
            { type: GlobalConst.DWELLER_KIND.GIANT_RAT },
            { type: GlobalConst.DWELLER_KIND.GIANT_RAT },
            { type: GlobalConst.DWELLER_KIND.WERERAT },
        ];
        this.items = [
            { type: GlobalConst.ARMOR_BASE_TYPE.BOOTS, spot: 3 },
            { type: GlobalConst.ARMOR_BASE_TYPE.ROBES, spot: 4 },
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM },
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM },
        ];
        this.map = [
            "   ┌-─┐                  ",
            "   │..└─┐ ┌──┐           ",
            " ┌─┘....+ │..│           ",
            "┌┘......└─┘2.+           ",
            "│....1...4...│           ",
            "+..........┌-┘           ",
            "│......3..┌┘             ",
            "└┐.....┌─-┘              ",
            " └┐...┌┘                 ",
            "  └─-─┘                  ",
        ];
    }
}
