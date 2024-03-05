import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class LavaFloorData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.LAVA_FLOOR);
        this.introText = "A heavy blast of heat emanates from the room ahead, lit with a wavering red glow...";
        this.tildeIsLava = true;
        this.traps = [{ type: GlobalConst.TRAP_TYPES.SPIKED_WALL }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.STATUE_HELL, spot: 1 },
            { type: GlobalConst.STORY_EVENT_KEYS.ALTAR, spot: 2 },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.DRAMOCK, spot: 3 }]; //drammock
        this.items = [
            { type: GlobalConst.JEWELRY_BASE_TYPE.NECKLACE, spot: 4 },
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM, spot: 5 },
        ];
        this.map = [
            " ┌-───────┐             ",
            "┌┘.≈≈≈≈≈..└┐            ",
            "+..5≈≈≈≈≈..+            ",
            "│..≈≈≈≈≈1..│            ",
            "+....3%....+            ",
            "│..4.%%....│            ",
            "+..≈≈≈≈≈2..+            ",
            "└┐..≈≈≈≈≈.┌┘            ",
            " └-───────┘             ",
        ];
        /*
" ┌-───────┐             ",
"┌┘.≈≈≈≈≈..└┐            ",
"+..¤≈≈≈≈≈..+            ",
"│..≈≈≈≈≈¥..│            ",
"+....D%....™            ",
"│..δ.%%....│            ",
"+..≈≈≈≈≈¥..+            ",
"└┐..≈≈≈≈≈.┌┘            ",
" └-───────┘             ",
         */
    }
}
