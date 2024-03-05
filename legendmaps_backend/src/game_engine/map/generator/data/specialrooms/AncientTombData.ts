import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class AncientTombData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.ANCIENT_TOMB);

        this.introText = "Ancient dust swirls in the air, somewhere in the room you hear a rattling of bones...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.PIT }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.GRAVESTONE, spot: 3 },
            { type: GlobalConst.STORY_EVENT_KEYS.GRAVESTONE, spot: 4 },
        ]; //GRAVE
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.DEAD_KNIGHT }];
        this.items = [
            { type: GlobalConst.TREASURE_BASE_TYPE.COINBAG, spot: 1 },
            { type: GlobalConst.WEAPON_BASE_TYPE.SPEAR, spot: 2 },
        ];
        this.map = [
            "  ┌──┐                   ",
            " ┌┘21└┐                  ",
            "┌┘....└┐                 ",
            "│.3K%4.│                 ",
            "│..%%..│                 ",
            "│.±..±.│                 ",
            "+......+                 ",
            "│.±..±.│                 ",
            "+......+                 ",
            "└─----─┘                 ",
        ];
        /*
"  ┌──┐                   ",
" ┌┘‡$└┐                  ",
"┌┘....└┐                 ",
"│.±K%±.│                 ",
"│..%%..│                 ",
"│.±..±.│                 ",
"+......+                 ",
"│.±..±.│                 ",
"+......+                 ",
"└─----─┘                 ",
         */
    }
}
