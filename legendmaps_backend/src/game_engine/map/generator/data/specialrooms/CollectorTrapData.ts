import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class CollectorTrapData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.COLLECTOR_TRAP);
        this.introText = "The twisting passage ahead glitters with the unmistakable shine of gold...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.SPIKED_WALL, spot: 3 }];
        this.storyEvents = [];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.COLLECTOR, spot: 2 }];
        this.items = [
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM, rarity: GlobalConst.RARITY.LEGENDARY, spot: 1 },
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM, rarity: GlobalConst.RARITY.LEGENDARY, spot: 4 },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINS },
        ];
        this.map = [
            "┌-─-─-┐                  ",
            "+¢¢¢¢¢+                  ",
            "└-┐¢┌─┘                  ",
            "  │¢└┐                   ",
            "  │¢¢│                   ",
            "┌─└─¢│                   ",
            "│¢¢¢¢│                   ",
            "│¢┌──┘                   ",
            "│32%│                    ",
            "│1%4│                    ",
            "└───┘                    ",
        ];
        /*
"┌-─-─-┐                  ",
"+¢¢¢¢¢+                  ",
"└-┐¢┌─┘                  ",
"  │¢└┐                   ",
"  │¢¢│                   ",
"┌─└─¢│                   ",
"│¢¢¢¢│                   ",
"│¢┌──┘                   ",
"│ÕC%│                    ",
"│¤%%│                    ",
"└───┘                    ",
         */
    }
}
