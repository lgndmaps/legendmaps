import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class GiantHiveData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.GIANT_HIVE);
        this.introText = "A thunderous buzzing of wings greets you are you enter...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.LIGHTNING }];
        this.storyEvents = [{ type: GlobalConst.STORY_EVENT_KEYS.WASPNEST }];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.GIANT_WASP }, { type: GlobalConst.DWELLER_KIND.GIANT_WASP }];
        this.items = [
            { type: GlobalConst.WEAPON_BASE_TYPE.BOW, spot: 1 },
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.POTION, spot: 2 },
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.POTION, spot: 3 },
        ];
        this.map = [
            "  ┌-┐  ┌-┐               ",
            " ┌┘.└┐┌┘.└┐              ",
            "┌┘...└┘...└┐             ",
            "+..........+             ",
            "└┐..2┌┐1..┌┘             ",
            " └┐.┌┘└┐.┌┘              ",
            " ┌┘.└┐ └-┘               ",
            "┌┘...└┐                  ",
            "+.....+                  ",
            "└┐3..┌┘                  ",
            " └┐.┌┘                   ",
            "  └-┘                    ",
        ];
        /*
"  ┌-┐  ┌-┐               ",
" ┌┘.└┐┌┘.└┐              ",
"┌┘i%.└┘.i%└┐             ",
"+.%%....%%.+             ",
"└┐..!┌┐}..┌┘             ",
" └┐.┌┘└┐.┌┘              ",
" ┌┘.└┐ └-┘               ",
"┌┘.i%└┐                  ",
"+..%%.+                  ",
"└┐!..┌┘                  ",
" └┐.┌┘                   ",
"  └-┘                    ",
         */
    }
}
