import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class CarrionLairData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.CARRION_LAIR);
        this.introText = "The stench of rot fills the air and you hear a chitinous clicking...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.PIT }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.TRASH_PILE },
            { type: GlobalConst.STORY_EVENT_KEYS.TRASH_PILE },
            { type: GlobalConst.STORY_EVENT_KEYS.BARREL },
            { type: GlobalConst.STORY_EVENT_KEYS.ADV_CHEST },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.CRAWLER }]; //crawler
        this.items = [{ type: GlobalConst.TREASURE_BASE_TYPE.KEY }, { type: GlobalConst.WEAPON_BASE_TYPE.DAGGER }];
        this.map = [
            "┌──┐    ┌─┐              ",
            "+..└────┘ø│              ",
            "│ø...▄....└┐             ",
            "+..........+             ",
            "└┐.....ø..┌┘             ",
            " └──┐....┌┘              ",
            "    │.w%┌┘               ",
            "    └┐%%│                ",
            "     └──┘                ",
        ];
        /*
"┌──┐    ┌─┐              ",
"+..└────┘ø│              ",
"│ø...▄....└┐             ",
"+..........+             ",
"└┐.....ø..┌┘             ",
" └──┐....┌┘              ",
"    │.w%┌┘               ",
"    └┐%%│                ",
"     └──┘                ",
         */
    }
}
