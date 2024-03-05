import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class WitchCovenData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.WITCH_COVEN);
        this.introText =
            "As you step into the musty room a voice echos from the shadows, 'joining us for dinner, wanderer?'";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.PIT }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.BARREL, spot: 3 },
            { type: GlobalConst.STORY_EVENT_KEYS.CAULDRON, spot: 6 },
            { type: GlobalConst.STORY_EVENT_KEYS.CAULDRON, spot: 4 },
        ];
        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.DITCH_WITCH }]; //WITCHES, 2
        this.items = [
            { type: GlobalConst.ARMOR_BASE_TYPE.HAT, spot: 5 },
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.POTION, spot: 1 },
            { type: GlobalConst.CONSUMABLE_BASE_TYPE.POTION, spot: 2 },
        ];
        this.map = [
            " ┌-──┐┌───┐              ",
            "┌┘...└┘123└┐             ",
            "│...W%.....│             ",
            "+...%%.....+             ",
            "│...6ø7W%..│             ",
            "└┐.....%%.┌┘             ",
            " └┐......┌┘              ",
            " ┌┘......└┐              ",
            " +........+              ",
            " └┐4.5...┌┘              ",
            "  └─-──-─┘               ",
        ];
        /*
" ┌-──┐┌───┐              ",
"┌┘...└┘!!Ý└┐             ",
"│...W%.....│             ",
"+...%%.....+             ",
"│...ÜøÜW%..│             ",
"└┐.....%%.┌┘             ",
" └┐......┌┘              ",
" ┌┘......└┐              ",
" +........+              ",
" └┐■.^..■┌┘              ",
"  └─-──-─┘               ",
         */
    }
}
