import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class FloodedChamberData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.FLOODED_CHAMBER);
        this.introText = "The rough-hewn walls of the chamber ahead echo with the sounds of dripping water...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.LIGHTNING }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.STATUE, spot: 2 },
            { type: GlobalConst.STORY_EVENT_KEYS.ADV_CHEST },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.VODYANOI }]; //vody
        this.items = [
            { type: GlobalConst.WEAPON_BASE_TYPE.SPEAR, spot: 1 },
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM },
        ];
        this.map = [
            "┌─-┐                     ",
            "+..└──-─┐                ",
            "│~.v%...+                ",
            "+.~%%~.~└┐               ",
            "└┐.......└┐              ",
            " └┐.~~.~2┌┘              ",
            " ┌┘.¤...┌┘               ",
            " +.~.~.~└┐               ",
            " └┐......+               ",
            "  └┐.~1~┌┘               ",
            "   └-┐.┌┘                ",
            "     └-┘                 ",
        ];
        /*
"┌─-┐                     ",
"+..└──-─┐                ",
"│~.v%...+                ",
"+.~%%~.~└┐               ",
"└┐.......└┐              ",
" └┐.~~.~¥┌┘              ",
" ┌┘.¤...┌┘               ",
" +.~.~.~└┐               ",
" └┐......+               ",
"  └┐.~‡~┌┘               ",
"   └-┐.┌┘                ",
"     └-┘                 ",
         */
    }
}
