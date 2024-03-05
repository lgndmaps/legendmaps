import GlobalConst from "./types/globalConst";

export default class GameConfig {
    static GetVersion(): string {
        return GameConfig.versionMajor + "." + GameConfig.versionMinor + "." + GameConfig.versionRelease;
    }

    //VERSION INFO
    static versionMajor: number = 0;
    static versionMinor: number = 2;
    static versionRelease: number = 3;

    static ALLOW_STACKING: boolean = true;

    //if true, no dwellers other than boss will be spawned.
    static TEST_NODWELLERS: boolean = false;

    static TEST_ALLEVENTS: boolean = false;

    // set a list of test trait IDs to be added to your character
    static TEST_TRAITS: number[] = []; //[3];

    // set a list of test skill IDs to be added to your character
    static TEST_SKILLS: number[] = []; //[20,33];

    //Array of story event keys to place outside entrance for fast testing
    static TEST_STORYEVENTS: GlobalConst.STORY_EVENT_KEYS[] = [];

    //Array of dwellers to place outside entrance for fast testing { dweller: DWELLER_KIND.KOBOLD, level: 1 }
    static TEST_DWELLERS: TestDweller[] = []; // [{dweller: GlobalConst.DWELLER_KIND.QUEX, level: 1}];

    //Array of story event keys to place outside entrance for fast testing
    static TEST_TRAPS: GlobalConst.TRAP_TYPES[] = []; //[GlobalConst.TRAP.BASIC_CHEST];
    //GlobalConst.TRAP

    static TEST_MERCHANTS: GlobalConst.MERCHANT_TYPES[] = []; //GlobalConst.MERCHANT_TYPES.MAGIC;

    //If true, player spawns with 5 keys, magic mapping, teleport scrolls and death potion
    static TEST_GEAR_TESTING_KIT: boolean = false;

    //If true, the player starting items will be generated according to following rarity settings
    static TEST_GEAR_ENABLED: boolean = false;

    //Following variables will only have an impact if TEST_GEAR_ENABLED is set.

    static TEST_STARTING_WEAPON: GlobalConst.RARITY = GlobalConst.RARITY.RARE;
    static TEST_WEAPON_TYPE: GlobalConst.WEAPON_BASE_TYPE = GlobalConst.WEAPON_BASE_TYPE.BOW;

    static TEST_STARTING_ARMOR: GlobalConst.RARITY = GlobalConst.RARITY.EPIC;
    static TEST_STARTING_SHIELD: GlobalConst.RARITY = GlobalConst.RARITY.EPIC;
    static TEST_STARTING_SCROLL: GlobalConst.RARITY = GlobalConst.RARITY.EPIC;
    static TEST_STARTING_POTION: GlobalConst.RARITY = GlobalConst.RARITY.EPIC;
    static TEST_STARTING_JEWELERY: GlobalConst.RARITY = GlobalConst.RARITY.LEGENDARY;
}

type TestDweller = {
    dweller: GlobalConst.DWELLER_KIND;
    level: number;
};
