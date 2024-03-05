//KEY UTILITY FUNCTIONS SHARED WITH CLIENT AND SERVER
class GlobalConst {
    public static GetWeaponAttribute(wpnType: GlobalConst.WEAPON_BASE_TYPE) {
        if (wpnType == GlobalConst.WEAPON_BASE_TYPE.BOW || wpnType == GlobalConst.WEAPON_BASE_TYPE.DAGGER) {
            return GlobalConst.ATTRIBUTES.AGILITY;
        } else if (wpnType == GlobalConst.WEAPON_BASE_TYPE.STAFF || wpnType == GlobalConst.WEAPON_BASE_TYPE.WAND) {
            return GlobalConst.ATTRIBUTES.SPIRIT;
        } else {
            return GlobalConst.ATTRIBUTES.BRAWN;
        }
    }

    public static GetHPAdjustmentBrawn(brawn: number) {
        let highStat = brawn;
        if (highStat <= 13) {
            return highStat - 10;
        } else {
            return (highStat - 10) * 2 - 3;
        }
    }

    public static GetDefBonusSpirit(spirit: number) {
        if (spirit <= 13) {
            return spirit - 10;
        } else {
            return (spirit - 10) * 2 - 3;
        }
    }

    public static GetDodgeBonusByAgility(agility: number) {
        if (agility <= 10) {
            return 0;
        } else {
            return agility - 10;
        }
    }

    public static GetGuileCritBonus(guile: number): number {
        //  use for crit bonus and luck bonus (currently the same amounts)
        if (guile <= 10) {
            return Math.floor((guile - 9) / 2);
        } else {
            return guile - 9;
        }
    }

    public static GetGuileLuckBonus(guile: number): number {
        //  use for crit bonus and luck bonus (currently the same amounts)
        if (guile <= 10) {
            return Math.floor((guile - 9) / 2);
        } else {
            return guile - 9;
        }
    }

    public static GetToHitBonusByBAGS(bags: number): number {
        if (bags <= 10) {
            return bags - 10;
        } else {
            return (bags - 10) * 2;
        }
    }

    public static GetDamageBonusByBAGS(bags: number): number {
        return bags - 10;
    }

    public static GetPriceAdjustByGuile(guile: number): number {
        return guile - 10;
    }

    public static GetGenericBagsBonus(bags: number): number {
        if (bags <= 10) {
            return bags - 10;
        } else {
            return bags - 10;
        }
    }
}

//SHARED CONSTANTS BETWEEN CLIENT & SERVER
namespace GlobalConst {
    export const COMBAT_DEFENSE_CAP: number = 120;
    export const COMBAT_DODGE_CAP: number = 75;
    export const COMBAT_BLOCK_CAP: number = 90;

    //Used to set boolean values for game state in the top level gameData
    export enum GAMESTATE_FLAGS {
        IS_STARTED = 1 << 0,
        PLAYER_IN_DUNGEON = 1 << 1,
        PLAYER_DEAD = 1 << 2,
        RUN_CONCLUDED = 1 << 3,
    }

    export enum ATTACK_FLAGS {
        MISSED = 1 << 0,
        DODGED = 1 << 1,
        CRIT = 1 << 2,
        BLOCKED = 1 << 3,
        RESISTED = 1 << 4,
        VULN = 1 << 5,
        IMMUNE = 1 << 6,
        FATAL = 1 << 7,
        MULTITILE = 1 << 8,
        IS_BEAM = 1 << 9,
        IS_AOE = 1 << 10,
        POINT_BLANK_PENALTY = 1 << 11,
    }

    export enum DAMAGE_TYPES {
        BLADE = "blade",
        PIERCE = "pierce",
        BLUDGEON = "bludgeon",
        FIRE = "fire",
        COLD = "cold",
        ELECTRIC = "electric",
        POISON = "poison",
        NECROTIC = "necrotic",
        ARCANE = "arcane",
        DIVINE = "divine",
    }

    export enum SOURCE_TYPE {
        EQUIPMENT = "equip", //conditions and effects caused by equipped items only
        INNATE = "innate", //for conditions and effects caused by traits, etc.
        SKILL = "skill", // for skill-based effects only, source_id will be the Skill ID
        TEMPORARY = "temp", //dwellers, story events, etc, these should usually be timed (barring story events which might give perm effects, which would be INNATE
    }

    export enum CONDITION {
        POISONED = "poisoned",
        BURNING = "burning",
        FREEZING = "freezing",
        BLEEDING = "bleeding",
        DISEASED = "diseased",
        SLOWED = "slowed",
        HASTED = "hasted",
        HUNGRY = "hungry",
        STARVING = "starving",
        CONFUSED = "confused",
        REGEN = "regen",
        LUCKY = "lucky",
        STUNNED = "stunned",
        SLEPT = "slept",
        HELD = "held",
        LOWHP = "lowhp",
        INSIGHT = "insight",
    }

    export enum EFFECT_TYPES {
        DAMAGE = "dmg",
        DAMAGE_MODIFIER = "dmg mod",
        HEAL = "heal",
        DEFENSE = "def",
        RESIST = "resist",
        VULNERABLE = "vuln",
        IMMUNE = "immune",
        BLOCK = "block",
        CRIT = "crit",
        DODGE = "dodge",
        TOHIT = "tohit",
        GOLD = "gold",
        KEYS = "keys",
        BRAWN = "br",
        AGILITY = "ag",
        GUILE = "gu",
        SPIRIT = "sp",
        MAXHP = "maxhp",
        GIVES_CONDITION = "cond",
        HUNGER = "hunger",
        SPELL = "spell",
        LUCK = "luck",
        DEBUGWIN = "dwin",

        //BELOW ITEMS GET MOVED TO CONDTIONS?

        // DOT = "dot",
        // HOT = "hot",
        // SLOW = "slow",
        // HASTE = "haste",
        // STUN = "stun",
        // HELD = "held",
        // SLEEP = "sleep",
    }

    export enum EFFECT_TRIGGERS {
        PICKUP = "pickup",
        EQUIP = "equip",
        USE = "use",
        HIT = "hit",
        TIMED = "time",
        NONE = "none",
    }

    export enum EFFECT_FLAGS {
        PERMANENT = 1 << 1,
        ENDED = 1 << 2,
        AOE = 1 << 3,
    }

    export enum SPELLS {
        TELEPORT = "teleport",
        ENCHANT_WEAPON = "enchant weapon",
        ENCHANT_ARMOR = "enchant armor",
        GREATER_ENCHANT_ARMOR = "greater enchant armor",
        GREATER_ENCHANT_WEAPON = "greater enchant weapon",
        BLINK = "blink",
        SATISFY_HUNGER = "satisfy hunger",
        MAPPING = "magic mapping",
        SUMMON_DWELLER = "summon dweller",
        TELEPORT_DWELLER = "teleport dweller",
        POISON_DWELLER = "poison dweller",
        STUN_DWELLER = "stun dweller",
        AOE_DWELLER = "aoe dweller",
        REVEAL_TRAPS = "reveal traps",
        CURE_ALL = "cure all",
    }

    export enum RARITY {
        NONE = "n",
        COMMON = "c",
        UNCOMMON = "u",
        RARE = "r",
        EPIC = "e",
        LEGENDARY = "l",
    }

    export enum ATTRIBUTES {
        BRAWN = "brawn",
        AGILITY = "agility",
        GUILE = "guile",
        SPIRIT = "spirit",
    }

    export enum EQUIPMENT_SLOT {
        NONE = "none",
        HEAD = "head",
        BODY = "body",
        FEET = "feet",
        WEAPON = "wpn",
        SHIELD = "shield",
        JEWELRY = "jewel",
    }

    //USED FOR EFFECT TRIGGERS, SEPERATE FROM DAMAGE TYPE
    export enum DWELLER_LOOT_TYPE {
        NONE = "none",
        TREASURE_ONLY = "treasure",
        HUMANOID = "humanoid",
        BEAST = "beast",
        MAGIC_USER = "magic",
    }

    //USED FOR EFFECT TRIGGERS ONLY, SEPERATE FROM DAMAGE TYPE
    export enum DWELLER_ATTACK_TYPE {
        MELEE_SLASH = "slash",
        MELEE_BITE = "bite",
        MELEE_BLUDGEON = "bludgeon",
        RANGED_MAGIC = "magic",
        RANGED_PHYSICAL = "projectile",
    }

    export enum WEAPON_BASE_TYPE {
        SWORD = "sword",
        DAGGER = "dagger",
        HAMMER = "hammer",
        SPEAR = "spear",
        AXE = "axe",
        WAND = "wand",
        STAFF = "staff",
        BOW = "bow",
    }

    export enum ARMOR_BASE_TYPE {
        ARMOR_HEAVY = "heavy",
        ARMOR_LIGHT = "light",
        ROBES = "robes",
        SHIELD = "shield",
        BOOTS = "boots",
        HELM = "helm",
        HAT = "hat",
    }

    export enum JEWELRY_BASE_TYPE {
        NECKLACE = "necklace",
        WRIST = "wrist",
        RING = "ring",
    }

    export enum CONSUMABLE_BASE_TYPE {
        SCROLL = "scroll",
        POTION = "potion",
        FOOD = "food",
    }

    export enum TREASURE_BASE_TYPE {
        COINS = "coins",
        COINBAG = "sack",
        GEM = "gem",
        KEY = "key",
    }

    export const ITEM_BASE_TYPE = {
        ...WEAPON_BASE_TYPE,
        ...ARMOR_BASE_TYPE,
        ...JEWELRY_BASE_TYPE,
        ...CONSUMABLE_BASE_TYPE,
        ...TREASURE_BASE_TYPE,
    };

    // export type ITEM_BASE_TYPE = typeof ITEM_BASE_TYPE;
    export type ITEM_BASE_TYPE =
        | WEAPON_BASE_TYPE
        | ARMOR_BASE_TYPE
        | JEWELRY_BASE_TYPE
        | CONSUMABLE_BASE_TYPE
        | TREASURE_BASE_TYPE;

    export enum ITEM_FLAGS {
        IS_TWOHANDED = 1 << 1,
        IS_BEAM = 1 << 2,
        IS_AOE = 1 << 3,
        IS_DWELLER_TARGET = 1 << 4,
    }

    export enum ENTITY_FLAGS {
        IS_WALKABLE = 1 << 1,
        IS_TOPLAYER = 1 << 2, //For entities which should appear above otehrs (e.g. characters, )
        BLOCKS_VISION = 1 << 3,
        MARKED_FOR_REMOVAL = 1 << 4, //Entity will be removed at end of this turn
        IS_DEAD = 1 << 5,
        IS_HIDDEN = 1 << 6,
        ALWAYS_VIS_AFTER_REVEAL = 1 << 7,
        IS_BOSS = 1 << 8,
        IS_DWELLER_WALKABLE = 1 << 9, //Dwellers can walk on this tile
        PLAYER_INTERACTED = 1 << 10, //Player has interacted with this entity in some way useful to entity info
    }

    export enum ENTITY_CNAME {
        ANY = "", //USed when any is allowed
        CHARACTER = "Character",
        DWELLER = "Dweller",
        ITEM = "Item",
        FEATURE = "Feature",
        TRAP = "Trap",
        MERCHANT = "Merchant",
        DOOR = "Door",
        STORYEVENT = "StoryEvent",
        CONDITION = "Condition",
        SPECIALTILE = "SpecialTile",
        MAPPORTAL = "MapPortal",
    }

    export enum ITEM_ENHANCEMENTS {
        BRAWN,
        BRAWN_CONSUMABLE,
        BRAWN_PLUS,
        BRAWN_PLUS_CONSUMABLE,
        AGILITY,
        AGILITY_CONSUMABLE,
        AGILITY_PLUS,
        AGILITY_PLUS_CONSUMABLE,
        GUILE,
        GUILE_CONSUMABLE,
        GUILE_PLUS,
        GUILE_PLUS_CONSUMABLE,
        SPIRIT,
        SPIRIT_CONSUMABLE,
        SPIRIT_PLUS,
        SPIRIT_PLUS_CONSUMABLE,
        CRIT,
        CRIT_CLOTHING,
        BLOCK,
        SHIELD_BLOCK,
        WEAPON_BLOCK,
        DODGE,
        TOHIT,
        DEFENSE,
        WEAPON_DEFENSE,
        DAMAGE_FIRE,
        DAMAGE_COLD,
        DAMAGE_ELECTRIC,
        DAMAGE_DIVINE,
        DAMAGE_DIVINE_PLUS,
        COND_DISEASE,
        COND_DISEASE_CONSUMABLE,
        COND_STUN,
        COND_POISON,
        COND_POISON_CONSUMABLE,
        COND_REGEN_FOOD,
        COND_REGEN_CONSUMABLE,
        COND_HASTED_CONSUMABLE,
        COND_LUCKY,
        COND_LUCKY_CONSUMABLE,
        COND_INSIGHT,
        COND_INSIGHT_CONSUMABLE,
        HEALING_FOOD,
        HEALING,
        HEALING_MINOR,
        HEALING_MAJOR,
        HEALING_FULL,
        CURE_ALL,
        SLAY_FEY,
        SLAY_DEMON,
        SLAY_BEAST,
        SLAY_UNDEAD,
        SLAY_OOZE,
        SLAY_HUMANOID,
        SLAY_MYTHIC,
        SLAY_DEEPONE,
        SLAY_FEY_CONSUMABLE,
        SLAY_DEMON_CONSUMABLE,
        SLAY_BEAST_CONSUMABLE,
        SLAY_UNDEAD_CONSUMABLE,
        SLAY_OOZE_CONSUMABLE,
        SLAY_HUMANOID_CONSUMABLE,
        SLAY_MYTHIC_CONSUMABLE,
        SLAY_DEEPONE_CONSUMABLE,
        MAXHP,
        MAXHP_FOOD,
        BEAM_ELECTRIC,
        BEAM_COLD,
        RANGED_FIRE,
        RANGED_ARCANE,
        RANGED_NECROTIC,
        STAFF_BLUDGEON,
        STAFF_DISEASE,
        STAFF_ELECTRIC,
        RESIST_ARCANE,
        RESIST_ARCANE_CONSUMABLE,
        RESIST_BLADE,
        RESIST_BLADE_CONSUMABLE,
        RESIST_BLUDGEON,
        RESIST_BLUDGEON_CONSUMABLE,
        RESIST_COLD,
        RESIST_COLD_CONSUMABLE,
        RESIST_DIVINE,
        RESIST_DIVINE_CONSUMABLE,
        RESIST_ELECTRIC,
        RESIST_ELECTRIC_CONSUMABLE,
        RESIST_FIRE,
        RESIST_FIRE_CONSUMABLE,
        RESIST_NECROTIC,
        RESIST_NECROTIC_CONSUMABLE,
        RESIST_PIERCE,
        RESIST_PIERCE_CONSUMABLE,
        RESIST_POISON,
        RESIST_POISON_CONSUMABLE,
        IMMUNE_ARCANE_CONSUMABLE,
        IMMUNE_BLADE_CONSUMABLE,
        IMMUNE_BLUDGEON_CONSUMABLE,
        IMMUNE_COLD_CONSUMABLE,
        IMMUNE_DIVINE,
        IMMUNE_DIVINE_CONSUMABLE,
        IMMUNE_ELECTRIC_CONSUMABLE,
        IMMUNE_FIRE_CONSUMABLE,
        IMMUNE_NECROTIC_CONSUMABLE,
        IMMUNE_PIERCE_CONSUMABLE,
        IMMUNE_POISON_CONSUMABLE,
        IMMUNE_ARCANE,
        IMMUNE_BLADE,
        IMMUNE_BLUDGEON,
        IMMUNE_COLD,
        IMMUNE_ELECTRIC,
        IMMUNE_FIRE,
        IMMUNE_NECROTIC,
        IMMUNE_PIERCE,
        IMMUNE_POISON,
    }

    export enum TILE_FLAGS {
        IS_WALKABLE = 1 << 1,
        IS_REVEALED = 1 << 2,
        BLOCKS_VISION = 1 << 3,
        IS_VISIBLE = 1 << 4,
    }

    export enum WALL_TYPES {
        NW = "wall_nw",
        NE = "wall_ne",
        SW = "wall_sw",
        SE = "wall_se",
        H = "wall_h",
        V = "wall_v",
        DOOR = "door", //TODO: Replace
    }

    export enum SPECIAL_TILE_TYPE {
        ENTRANCE = "ent",
        EXIT = "exit",
        DOOR = "door",
        STAIRS = "stairs",
        WATER = "water",
        LAVA = "lava",
    }

    export enum GROUND_TYPES {
        DUNGEON_FLOOR = "floor",
        DUNGEON_HALL = "hall",
    }

    export enum SPECIAL_ROOM {
        RAT_WARREN = "rat warren",
        GIANT_HIVE = "hive",
        SPIDERS_WEB = "spider's web",
        ANCIENT_TOMB = "tomb",
        COLLECTOR_TRAP = "collector",
        ENCHANTED_FOREST = "forest",
        TEMPLE_GAWDS = "gawds temple",
        TORTURE_CHAMBER = "torture",
        CARRION_LAIR = "carrion",
        SPIRAL_MAZE = "spiral",
        LAVA_FLOOR = "floor is lava",
        WITCH_COVEN = "witch's conven",
        KING_VAULT = "king's vault",
        FLOODED_CHAMBER = "flooded chamber",
    }

    export enum DWELLER_SIZE {
        SMALL = 1,
        MEDIUM = 2,
        LARGE = 3,
    }

    export enum DWELLER_PHYLUM {
        UNDEAD = "undead",
        BEAST = "beast",
        OOZE = "ooze",
        HUMANOID = "humanoid",
        DEEP_ONE = "deep one",
        FEY = "fey",
        MYTHIC = "mythic",
        DEMON = "demon",
    }

    export enum DWELLER_KIND {
        ARKAN = "arkan",
        BANANACH = "bananach",
        BLACK_PUDDING = "blackpudding",
        BROWNIE = "brownie",
        BROWN_PUDDING = "brownpudding",
        BUBBLE_EYES = "bubbleeyes",
        COCKATRICE = "cockatrice",
        COLLECTOR = "collector",
        CRAWLER = "crawler",
        DEAD_KNIGHT = "deadknight",
        DEVIL_BONES = "devilbones",
        DITCH_WITCH = "ditchwitch",
        DRAMOCK = "dramock",
        DWARV = "dwarv",
        FEY_WING = "feywing",
        FOMOIAN = "fomoian",
        GAINS_GOBLIN = "gainsgob",
        GARGOYLE = "gargoyle",
        GEM_LIZARD = "gem_lizard",
        GHAST = "ghast",
        GIANT_BATS = "giantbats",
        GIANT_RAT = "giantrat",
        GIANT_SNAKE = "giantsnake",
        GIANT_SPIDER = "giantspider",
        GIANT_WASP = "giantwasp",
        GOBLIN = "goblin",
        GREIGER = "greiger",
        HARPY = "harpy",
        HOBGOB = "hobgob",
        JELCUBE = "jelcube",
        KOBOLD = "kobold",
        MANTICORE = "manticore",
        MIRTHCREANT = "mirthcreant",
        NIGHT_FATHER = "nightfather",
        PARALISK = "paralisk",
        QUEX = "quex",
        SHADOW_ELF = "shadowelf",
        SKELL = "skell",
        SLIME = "slime",
        STACHELIG = "stachelig",
        TOOTH_TUBE = "toothtube",
        TRAVELER = "traveler",
        TROLL = "troll",
        VODYANOI = "vodyanoi",
        WERERAT = "wererat",
        WISP = "wisp",
        WYRDEN_CAT = "wyrdencat",
        ZOMBIE = "zombie",
    }

    export enum DWELLER_ASCII {
        ARKAN = "A",
        BANANACH = "n",
        BLACK_PUDDING = "P",
        BROWNIE = "o",
        BROWN_PUDDING = "B",
        BUBBLE_EYES = "E",
        COCKATRICE = "c",
        COLLECTOR = "C",
        CRAWLER = "w",
        DEAD_KNIGHT = "K",
        DEVIL_BONES = "V",
        DITCH_WITCH = "W",
        DRAMOCK = "D",
        DWARV = "d",
        FEY_WING = "f",
        FOMOIAN = "a",
        GAINS_GOBLIN = "l",
        GARGOYLE = "Y",
        GEM_LIZARD = "L",
        GHAST = "G",
        GIANT_BATS = "b",
        GIANT_RAT = "r",
        GIANT_SNAKE = "m",
        GIANT_SPIDER = "s",
        GIANT_WASP = "i",
        GOBLIN = "g",
        GREIGER = "X",
        HARPY = "H",
        HOBGOB = "h",
        JELCUBE = "J",
        KOBOLD = "k",
        MANTICORE = "M",
        MIRTHCREANT = "F",
        NIGHT_FATHER = "N",
        PARALISK = "j",
        QUEX = "q",
        SHADOW_ELF = "e",
        SKELL = "x",
        SLIME = "S",
        STACHELIG = "Q",
        TOOTH_TUBE = "O",
        TRAVELER = "T",
        TROLL = "t",
        VODYANOI = "v",
        WERERAT = "R",
        WISP = "p",
        WYRDEN_CAT = "y",
        ZOMBIE = "z",
    }

    export enum DWELLER_ALERT_LEVELS {
        SENSELESS = 0,
        LOW = 4,
        NORMAL = 6,
        HIGH = 9,
        OMNI = 100,
    }

    export enum DWELLER_SPEED {
        SLOW = 0.5,
        NORMAL = 1,
        FAST = 1.5,
        VERY_FAST = 2,
    }

    export enum TRAP_TYPES {
        PIT = "pit",
        GAS = "gas",
        WEB = "web",
        SPIKED_WALL = "spike",
        LIGHTNING = "lightning",
    }

    export enum STORY_EVENT_KEYS {
        MAGIC_FOUNTAIN = "fountain",
        BASIC_CHEST = "chest",
        ADV_CHEST = "adv_chest",
        TRASH_PILE = "trashpile",
        GRAVESTONE = "gravestone",
        TRAP_PIT = "pit",
        TRAP_GAS = "gas",
        TRAP_WEB = "web",
        TRAP_SPIKED_WALL = "spike",
        TRAP_LIGHTNING = "lightning",
        ALTAR = "altar",
        WASPNEST = "waspnest",
        CAULDRON = "cauldron",
        STATUE = "statue",
        STATUE_HELL = "statue_hell",
        TORTURE = "torture",
        BARREL = "barrel",
        PYRAMID = "pyramid",
        TREE = "tree",
        DOOR = "door",
        DOOR_MAGIC = "door_magic",
        DOOR_OPEN = "door_open",
        DOOR_SECRET_H = "door_secret_h",
        DOOR_SECRET_V = "door_secret_v",
        DOOR_UNLOCKED = "door_unlocked",
        DOOR_DAMAGED = "door_damaged",

        LOST_PUNK = "lostpunk",
        LOST_TOAD = "losttoad",
        GOBLIN_DICE = "goblindice",
        PORTAL = "portal",
    }

    export enum STORY_EVENT_CATEGORY {
        MERCHANT = "merchant",
        SPECIAL_ROOM = "specialroom",
        TRAP = "trap",
        CHEST = "chest",
        DOOR = "door",
        INTERACTIVE_ITEM = "intitem",
    }

    export enum MERCHANT_TYPES {
        MAGIC = "magic",
        WEAPON = "weapon",
        ARMOR = "armor",
        FOOD = "food",

        POTION = "potion",
        CLOTHING = "clothing",
    }

    export enum MERCHANT_ACTIONS {
        BUY = "b",
        HAGGLE = "h",
        STEAL = "s",
    }

    export enum BIOME {
        MOUNTAIN = "mountains",
        FOREST = "forest",
        GRASSLANDS = "grasslands",
        GRAVEYARD = "graveyard",
        HELL = "hells",
        DESERT = "desert",
        ICE = "frozen lands",
        VOLCANO = "volcanic",
    }

    export enum WALL {
        STONE = "stone",
        DESERT = "desert",
        HELL = "hellish",
        ICE = "ice",
        VOLCANO = "volcanic",
        RUIN = "ruins",
        TEMPLE = "temple",
    }

    export enum GLOBAL_COMMAND_TYPE {
        INPUT = "input",
        GAME_STATE = "game state",
    }

    export enum GAME_COMMAND_TYPE {
        MOVE = "move",
        WAIT = "wait",
        EQUIP = "equip",
        DELETE_ITEM = "del",
        USE = "use",
        ATTACK = "attack",
        INTERACT = "interact",
        STORYEVENT_OPTION = "storyopt",
        SHOP = "shop",
        SWAP_WEAPON = "swap",
    }

    export enum MOVE_DIR {
        NORTH = "N",
        NORTHEAST = "NE",
        EAST = "E",
        SOUTHEAST = "SE",
        SOUTH = "S",
        SOUTHWEST = "SW",
        WEST = "W",
        NORTHWEST = "NW",
    }

    export enum DAMAGE_SOURCE {
        PLAYER = "player",
        DWELLER = "dweller",
        EVENT = "event",
        TRAP = "trap",
        CONDITION = "condition",
    }

    //Special tags for client fx calls visual and/or sound.
    export enum CLIENTFX {
        NONE = "",
        ENCHANT = "enchant",
        HEAL = "heal",
        GENERIC_POSITIVE_MAGIC = "goodmagic",
        GENERIC_NEGATIVE_MAGIC = "negmagic",
        TELEPORT = "teleport",
        ENTER_DUNGEON = "enter",
        EXIT_OPEN = "exitopen",
    }

    export enum MESSAGE_FLAGS {
        NOLOG = 1 << 0, //Not saved to event log
        APPEND = 1 << 1, //tries to append message to previous
        CLEAR_AFTER = 1 << 2, //Force clear line after
        DELAY_AFTER = 1 << 3, //Puts canned delay after showing.
        ELLIPSES = 1 << 4, //Show staggered delayed ellipses after...
        EMPHASIZE = 1 << 5, //Scale/shake message area on display
        REPLACE_PREVIOUS = 1 << 6, //Wipes previous message from record
    }
}

export default GlobalConst;
