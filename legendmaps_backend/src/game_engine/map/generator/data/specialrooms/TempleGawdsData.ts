import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class TempleGawdsData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.TEMPLE_GAWDS);
        this.introText = "You step into a lost temple. Cower...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.LIGHTNING }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.PYRAMID, spot: 5 },
            { type: GlobalConst.STORY_EVENT_KEYS.BASIC_CHEST, spot: 1 },
            { type: GlobalConst.STORY_EVENT_KEYS.ADV_CHEST, spot: 2 },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.WISP }]; //WISPS //{ type: GlobalConst.DWELLER_KIND.GIANT_RAT }, { type: GlobalConst.DWELLER_KIND.GIANT_RAT }
        this.items = [
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.FOOD, spot: 3 },
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.FOOD, spot: 4 },
        ];
        this.map = [
            "     ┌──┐                 ",
            "    ┌┘5%└┐                ",
            "   ┌┘.%%.└┐               ",
            "  ┌┘......└┐              ",
            " ┌┘¥..12..¥└┐             ",
            "┌┘....34....└┐            ",
            "+............+            ",
            "└──-──-──-───┘            ",
        ];
        /*
"     ┌──┐                 ",
"    ┌┘p%└┐                ",
"   ┌┘.%%.└┐               ",
"  ┌┘......└┐              ",
" ┌┘¥..▄▄..¥└┐             ",
"┌┘....œœ....└┐            ",
"+............+            ",
"└──-──-──-───┘            ",
         */
    }
}
