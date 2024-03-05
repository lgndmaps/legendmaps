import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class TortureChamberData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.TORTURE_CHAMBER);
        this.introText = "A creaking of chains and a distant wailing echo from the chambers ahead...";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.SPIKED_WALL }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.TORTURE, spot: 1 },
            { type: GlobalConst.STORY_EVENT_KEYS.TORTURE, spot: 2 },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.NIGHT_FATHER }, { type: GlobalConst.DWELLER_KIND.SKELL }]; //Night Father, Skel
        this.items = [
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.SCROLL, spot: 3 },
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.SCROLL, spot: 4 },
        ];
        this.map = [
            "┌──┐┌─-─┐┌─┐             ",
            "│13││Ý Ý││Ý│             ",
            "│..└┘...└┘.│             ",
            "│N%...u%...+             ",
            "│%%┌┐.%%┌┐.│             ",
            "│24││Ý.Ý││Ý│             ",
            "└──┘└─-─┘└─┘             ",
        ];
        /*
"┌──┐┌─-─┐┌─┐             ",
"│Ý?││Ý Ý││Ý│             ",
"│..└┘...└┘.│             ",
"│N%...u%...+             ",
"│%%┌┐.%%┌┐.│             ",
"│ÝÝ││Ý.Ý││Ý│             ",
"└──┘└─-─┘└─┘             ",
         */
    }
}
