import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class EnchantForestData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.ENCHANTED_FOREST);
        this.introText =
            "The wide chamber ahead is, impossibly, filled with dappled sunlight and fluttering insects...";
        this.tildeIsLava = false;
        this.traps = [{ type: GlobalConst.TRAP_TYPES.GAS }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.TREE },
            { type: GlobalConst.STORY_EVENT_KEYS.TREE },
            { type: GlobalConst.STORY_EVENT_KEYS.ADV_CHEST },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.ARKAN }, { type: GlobalConst.DWELLER_KIND.FEY_WING }]; //ARKAN, FEYWING
        this.items = [
            { type: GlobalConst.WEAPON_BASE_TYPE.WAND, spot: 1 },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINBAG, spot: 2 },
        ];
        this.map = [
            "┌─-┐ ┌─┐                 ",
            "+2.└-┘.└┐                ",
            "│.Îf%.Î.+                ",
            "+..%%...└┐               ",
            "└┐...Î1Î.└┐              ",
            " └┐Î.....┌┘              ",
            " ┌┘..A%Î.└┐              ",
            "┌┘...%%.Î┌┘              ",
            "└─-─-┐Î▄┌┘               ",
            "     └┐┌┘                ",
            "      └┘                 ",
        ];
        /*
"┌─-┐ ┌─┐                 ",
"+..└-┘.└┐                ",
"│.Îf%.Î.+                ",
"+..%%...└┐               ",
"└┐...Î/Î.└┐              ",
" └┐Î.....┌┘              ",
" ┌┘..A%Î.└┐              ",
"┌┘...%%.Î┌┘              ",
"└─-─-┐Î▄┌┘               ",
"     └┐┌┘                ",
"      └┘                 ",
         */
    }
}
