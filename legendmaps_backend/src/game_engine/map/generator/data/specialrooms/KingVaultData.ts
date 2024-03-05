import GlobalConst from "../../../../types/globalConst";
import SpecialRoomData from "./SpecialRoomData";
import { TrapSpawn } from "./SpecialSpawns";

export default class KingVaultData extends SpecialRoomData {
    public kind: GlobalConst.SPECIAL_ROOM;
    constructor() {
        super(GlobalConst.SPECIAL_ROOM.KING_VAULT);
        this.introText = "A crude sign hangs on the stone wall: 'propertee of hobgob king, stay oot!'";
        this.traps = [{ type: GlobalConst.TRAP_TYPES.PIT, spot: 8 }];
        this.storyEvents = [
            { type: GlobalConst.STORY_EVENT_KEYS.BARREL, spot: 5 },
            { type: GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_H, spot: 8 },
            { type: GlobalConst.STORY_EVENT_KEYS.ADV_CHEST, spot: 3 },
        ];

        this.dwellers = [{ type: GlobalConst.DWELLER_KIND.HOBGOB }, { type: GlobalConst.DWELLER_KIND.HOBGOB }]; //hob gob
        this.items = [
            { type: GlobalConst.TREASURE_BASE_TYPE.KEY },
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM, spot: 1 },
            { type: GlobalConst.TREASURE_BASE_TYPE.GEM, spot: 2 },
            { type: GlobalConst.TREASURE_BASE_TYPE.COINBAG, spot: 4 },
        ];
        this.map = [
            "┌────────┐               ",
            "│h%.567h%│               ",
            "│%%....%%│               ",
            "└┐.┌8─┐.┌┘               ",
            " │.│12│.│                ",
            " │.│34│.│                ",
            "┌┘.└──┘.└┐               ",
            "+........+               ",
            "└───-─-──┘               ",
        ];
        /*
"┌────────┐               ",
"│h%.■■⌐h%│               ",
"│%%....%%│               ",
"└┐.┌§§┐.┌┘               ",
" │.│¤¤│.│                ",
" │.│▄$│.│                ",
"┌┘.└──┘.└┐               ",
"+........+               ",
"└───™─-──┘               ",
         */
    }
}
