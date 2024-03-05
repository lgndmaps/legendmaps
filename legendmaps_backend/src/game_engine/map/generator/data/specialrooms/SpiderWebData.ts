import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class SpiderWebData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.SPIDERS_WEB);
        this.introText = "The room is still and eerily silent, thick cobwebs cross the space ahead...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.WEB }, { type: GlobalConst.TRAP_TYPES.WEB }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.TRASH_PILE },
            { type: GlobalConst.STORY_EVENT_KEYS.ADV_CHEST },
        ];
        this.dwellers = [
            { type: GlobalConst.DWELLER_KIND.GIANT_SPIDER },
            { type: GlobalConst.DWELLER_KIND.GIANT_SPIDER },
        ]; //TODO: SPIDERS
        this.items = [{ type: GlobalConst.WEAPON_BASE_TYPE.STAFF }, { type: GlobalConst.TREASURE_BASE_TYPE.COINBAG }];
        this.map = [
            "   ┌-┐                   ",
            "  ┌┘Ô└┐                  ",
            "  +...│                  ",
            " ┌┘...└┐                 ",
            "┌┘$.s%.└┐                ",
            "+Ô..%%.Ô+                ",
            "└┐ø...⌠┌┘                ",
            " └┐...┌┘                 ",
            "  │...+                  ",
            "  └┐Ô┌┘                  ",
            "   └-┘                   ",
        ];
        /*
"   ┌-┐                   ",
"  ┌┘Ô└┐                  ",
"  +...│                  ",
" ┌┘...└┐                 ",
"┌┘$.s%.└┐                ",
"+Ô..%%.Ô+                ",
"└┐ø...⌠┌┘                ",
" └┐...┌┘                 ",
"  │...+                  ",
"  └┐Ô┌┘                  ",
"   └-┘                   ",
         */
    }
}
