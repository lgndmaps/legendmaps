import {
    Dwellers,
    GlitchTypes,
    ItemTypes,
    LineArtTypes,
    OptionsType,
    OrderByOptions,
    SearchableFields,
    SpecialRooms,
} from "../types/mapTypes";
import { Biomes, Materials, TrapTypes } from "../types/metaMapTypes";

/*
Dwellers always map directly from the letter in grid
to the name, put this "default" here to keep it consistent
with out items in this file.
*/
const dwellers = {
    g: {
        default: "Goblin",
    },
    b: {
        default: "Bats",
    },
    r: {
        default: "Giant Rat",
    },
    u: {
        default: "Skell",
    },
    S: {
        default: "Slime",
    },
    s: {
        default: "Giant Spider",
    },
    z: {
        default: "Zombie",
    },
    m: {
        default: "Giant Snake",
    },
    d: {
        default: "Dwarv",
    },
    R: {
        default: "Were Rat",
    },
    y: {
        default: "Wyrden Cat",
    },
    F: {
        default: "Mirthcreant",
    },
    h: {
        default: "Hob Gob",
    },
    k: {
        default: "Kobold",
    },
    A: {
        default: "Arkan",
    },
    B: {
        default: "Brown Pudding",
    },
    C: {
        default: "Collector",
    },
    w: {
        default: "Crawler",
    },
    W: {
        default: "Ditch Witch",
    },
    f: {
        default: "Fey Wing",
    },
    i: {
        default: "Giant Wasp",
    },
    G: {
        default: "Ghast",
    },
    Y: {
        default: "Gargoyle",
    },
    v: {
        default: "Vodyanoi",
    },
    e: {
        default: "Shadow Elf",
    },
    o: {
        default: "Brownie",
    },
    a: {
        default: "Fomoian",
    },
    j: {
        default: "Paralisk",
    },
    x: {
        default: "Skell",
    },
    J: {
        default: "Jel Cube",
    },
    P: {
        default: "Black Pudding",
    },
    E: {
        default: "Bubble Eyes",
    },
    c: {
        default: "Cockatrice",
    },
    V: {
        default: "Devil Bones",
    },
    H: {
        default: "Harpy",
    },
    q: {
        default: "Quex",
    },
    T: {
        default: "Traveler",
    },
    K: {
        default: "Dead Knight",
    },
    t: {
        default: "Troll",
    },
    l: {
        default: "Gains Goblin",
    },
    p: {
        default: "Wisp",
    },
    O: {
        default: "Toothtube",
    },
    Q: {
        default: "Stachelig",
    },
    M: {
        default: "Manticore",
    },
    D: {
        default: "Dramock",
    },
    N: {
        default: "Night Father",
    },
    L: {
        default: "Gem Lizard",
    },
    n: {
        default: "Bananach",
    },
    U: {
        default: "Lost Punk",
    },
    I: {
        default: "Lost Toad",
    },
    X: {
        default: "Greiger",
    },
};

/*
Items can be keyed off of the ascii values as well,
the rarity we have to pull from metadata file
deterministicly. We need to verify color on these
if there is more than one in the metadata.
*/
const items = {
    ƒ: {
        uncommon: "uncommon sword",
        rare: "rare sword",
        epic: "epic sword",
        legendary: "legendary sword",
    },
    "†": {
        uncommon: "uncommon dagger",
        rare: "rare dagger",
        epic: "epic dagger",
        legendary: "legendary dagger",
    },
    "╤": {
        uncommon: "uncommon hammer",
        rare: "rare hammer",
        epic: "epic hammer",
        legendary: "legendary hammer",
    },
    "‡": {
        uncommon: "uncommon spear",
        rare: "rare spear",
        epic: "epic spear",
        legendary: "legendary spear",
    },
    "}": {
        uncommon: "uncommon bow",
        rare: "rare bow",
        epic: "epic bow",
        legendary: "legendary bow",
    },
    "¶": {
        uncommon: "uncommon axe",
        rare: "rare axe",
        epic: "epic axe",
        legendary: "legendary axe",
    },

    "/": {
        uncommon: "uncommon wand",
        rare: "rare wand",
        epic: "epic wand",
        legendary: "legendary wand",
    },
    "⌠": {
        uncommon: "uncommon staff",
        rare: "rare staff",
        epic: "epic staff",
        legendary: "legendary staff",
    },

    "[": {
        uncommon: "uncommon heavy armor",
        rare: "rare heavy armor",
        epic: "epic heavy armor",
        legendary: "legendary heavy armor",
    },
    "{": {
        uncommon: "uncommon light armor",
        rare: "rare light armor",
        epic: "epic light armor",
        legendary: "legendary light armor",
    },
    "£": {
        uncommon: "uncommon robe",
        rare: "rare robe",
        epic: "epic robe",
        legendary: "legendary robe",
    },
    "]": {
        uncommon: "uncommon shield",
        rare: "rare shield",
        epic: "epic shield",
        legendary: "legendary shield",
    },
    "„": {
        uncommon: "uncommon boots",
        rare: "rare boots",
        epic: "epic boots",
        legendary: "legendary boots",
    },

    Ω: {
        uncommon: "uncommon helm",
        rare: "rare helm",
        epic: "epic helm",
        legendary: "legendary helm",
    },
    "^": {
        uncommon: "uncommon hat",
        rare: "rare hat",
        epic: "epic hat",
        legendary: "legendary hat",
    },

    δ: {
        uncommon: "uncommon amulet",
        rare: "rare amulet",
        epic: "epic amulet",
        legendary: "legendary amulet",
    },
    "≡": {
        uncommon: "uncommon wrist",
        rare: "rare wrist",
        epic: "epic wrist",
        legendary: "legendary wrist",
    },
    "=": {
        uncommon: "uncommon ring",
        rare: "rare ring",
        epic: "epic ring",
        legendary: "legendary ring",
    },

    "?": {
        uncommon: "uncommon scroll",
        rare: "rare scroll",
        epic: "epic scroll",
        legendary: "legendary scroll",
    },
    "!": {
        uncommon: "uncommon potion",
        rare: "rare potion",
        epic: "epic potion",
        legendary: "legendary potion",
    },
    œ: {
        uncommon: "uncommon food",
        rare: "rare food",
        epic: "water jug, epic food",
        legendary: "ale, legendary food",
    },
    "¢": {
        uncommon: "a few coins",
        rare: "small coin stack",
        epic: "coin stack",
        legendary: "large coin stack",
    },
    $: {
        uncommon: "bag of coins",
        rare: "bag of coins",
        epic: "bag of coins, full",
        legendary: "bag of coins, overflowing",
    },
    "¤": {
        uncommon: "gem",
        rare: "fine gem",
        epic: "quality gem",
        legendary: "perfect gem",
    },
    "▄": {
        uncommon: "chest",
        rare: "hardwood chest",
        epic: "iron chest",
        legendary: "bronze chest",
    },
    "⌐": {
        uncommon: "key",
        rare: "key",
        epic: "key",
        legendary: "key",
    },
};

/*
Anything with an X position <= 6
should look up HERE not any of the
others as that's either entrance
or biome. That includes ANY of the 
other lists. If it fails to find here,
then can check others.

Biome names will need to be set to
biome_BIOMENAME, and entrances to:
ent_ENTRANCETYPE
To work with these lookups.
*/

/*
  bTypeString = "forest";
  } else if (bType == EntranceGenerator.BIOME_MOUNTAIN) {
      bTypeString = "mountains";
  } else if (bType == EntranceGenerator.BIOME_GRASSLANDS) {
      bTypeString = "grasslands";
  } else if (bType == EntranceGenerator.BIOME_GRAVEYARD) {
      bTypeString = "graveyard";
  } else if (bType == EntranceGenerator.BIOME_HELL) {
      bTypeString = "hells";
  } else if (bType == EntranceGenerator.BIOME_DESERT) {
      bTypeString = "desert";
  } else if (bType == EntranceGenerator.BIOME_ICE) {
      bTypeString = "frozen lands";
  bTypeString = "volcanic";

   entranceTypeString = "stone";
} else if (entType == EntranceGenerator.WALL_RUIN) {
    entranceTypeString = "ruins";
} else if (entType == EntranceGenerator.WALL_TEMPLE) {
    entranceTypeString = "temple";
} else if (entType == EntranceGenerator.WALL_VOLCANO) {
    entranceTypeString = "volcanic";
} else if (entType == EntranceGenerator.WALL_DESERT) {
    entranceTypeString = "desert";
} else if (entType == EntranceGenerator.WALL_ICE) {
    entranceTypeString = "ice";
} else if (entType == EntranceGenerator.WALL_HELL) {
    entranceTypeString = "hellish";
                */
const entranceBiomes = {
    ".": {
        biome_mountain: "gravel",
        biome_forest: "leafy soil",
        biome_grasslands: "grass",
        biome_graveyard: "muddy soil",
        biome_hell: "burning soil",
        biome_desert: "sand",
        biome_frozenlands: "frozen soil",
        biome_volcanic: "rocky ground",
    },
    "#": {
        biome_mountain: "rocky path",
        biome_forest: "dirt path",
        biome_grasslands: "dirt path",
        biome_graveyard: "dirt path",
        biome_hell: "brimstone path",
        biome_desert: "sandstone path",
        biome_frozenlands: "icy path",
        biome_volcanic: "lava rock path",
    },
    î: {
        biome_mountain: "tree",
        biome_forest: "tree",
    },
    "^": {
        biome_mountain: "mountain peak",
        biome_hell: "burning peak",
        biome_frozenlands: "icy peak",
        biome_volcanic: "volcanic peak",
    },
    "±": {
        biome_graveyard: "grave",
    },
    "„": {
        biome_grasslands: "tall grass",
        biome_graveyard: "dead grass",
    },
    "≈": {
        biome_desert: "sand dune",
    },
    "¥": {
        biome_hell: "devil statue",
    },
};

const entrances = {
    "∩": {
        ent_stone: "entrance",
        ent_desert: "entrance",
        ent_ruins: "entrance",
        ent_temple: "entrance",
        ent_ice: "entrance",
        ent_hellish: "entrance",
        ent_volcanic: "entrance",
    },
    "│": {
        ent_stone: "stone wall",
        ent_desert: "sandstone wall",
        ent_ruins: "ruined wall",
        ent_temple: "temple wall",
        ent_ice: "icy wall",
        ent_hellish: "brimstone wall",
        ent_volcanic: "lava rock wall",
    },
    "┘": {
        ent_stone: "stone wall",
        ent_desert: "sandstone wall",
        ent_ruins: "ruined wall",
        ent_temple: "temple wall",
        ent_ice: "icy wall",
        ent_hellish: "brimstone wall",
        ent_volcanic: "lava rock wall",
    },
    "┌": {
        ent_stone: "stone wall",
        ent_desert: "sandstone wall",
        ent_ruins: "ruined wall",
        ent_temple: "temple wall",
        ent_ice: "icy wall",
        ent_hellish: "brimstone wall",
        ent_volcanic: "lava rock wall",
    },
    "└": {
        ent_stone: "stone wall",
        ent_desert: "sandstone wall",
        ent_ruins: "ruined wall",
        ent_temple: "temple wall",
        ent_ice: "icy wall",
        ent_hellish: "brimstone wall",
        ent_volcanic: "lava rock wall",
    },
    "─": {
        ent_stone: "stone wall",
        ent_desert: "sandstone wall",
        ent_ruins: "ruined wall",
        ent_temple: "temple wall",
        ent_ice: "icy wall",
        ent_hellish: "brimstone wall",
        ent_volcanic: "lava rock wall",
    },
    "…": {
        ent_desert: "sandstone columns",
        ent_hellish: "brimstone columns",
    },
    ":": {
        ent_desert: "sandstone columns",
        ent_hellish: "brimstone columns",
    },
    "<": {
        ent_ice: "jagged icy wall",
        ent_volcanic: "jagged lava rock wall",
    },
};

const map = {
    Õ: {
        default: "gas trap",
    },
    Ò: {
        default: "pit trap",
    },
    Ô: {
        default: "web trap",
    },
    Ó: {
        default: "spiked wall trap",
    },
    Ö: {
        default: "lightning trap",
    },
    "#": {
        default: "hallway",
    },
    "+": {
        default: "door",
    },
    ".": {
        default: "floor",
    },
    "│": {
        default: "wall",
    },
    "┘": {
        default: "wall",
    },
    "┌": {
        default: "wall",
    },
    "└": {
        default: "wall",
    },
    "─": {
        default: "wall",
    },
    "~": {
        default: "water",
    },
    "≈": {
        default: "lava",
    },
    "§": {
        default: "secret door",
    },
    "±": {
        default: "grave",
    },
    "¥": {
        default: "statue",
    },
    "∩": {
        default: "entrance",
    },

    "■": {
        default: "barrel",
    },
    Ý: {
        default: "rack",
    },
    ø: {
        default: "trash pile",
    },
    Ü: {
        default: "cauldron",
    },
    Â: {
        default: "pyramid",
    },
    Î: {
        default: "tree",
    },
    ":": {
        default: "columns",
    },
    "…": {
        default: "columns",
    },
    "<": {
        default: "jagged wall",
    },
    ">": {
        default: "jagged wall",
    },
    "-": {
        default: "wall",
    },
    "|": {
        default: "wall",
    },
};

export default {
    dwellers,
    items,
    entrances,
    entranceBiomes,
    map,
    maxTokens: 5757,
};

export const SEARCH_FIELDS: { [key: string]: SearchableFields } = {
    TOKEN_ID: "tokenId",
    NAME: "name",
    DWELLER: "dweller",
    ITEMS: "items",
    TRAPS: "traps",
    LINE_ART: "lineart",
    WALL_MATERIAL: "wallMaterial",
    BIOME: "biome",
    GLITCH: "glitch",
    SPECIAL_ROOM: "specialRoom",
};

export const searchByOptions: OptionsType<SearchableFields>[] = [
    { value: SEARCH_FIELDS.TOKEN_ID, label: "Token ID" },
    { value: SEARCH_FIELDS.NAME, label: "Name" },
    { value: SEARCH_FIELDS.DWELLER, label: "Dwellers" },
    { value: SEARCH_FIELDS.ITEMS, label: "Items" },
    { value: SEARCH_FIELDS.TRAPS, label: "Traps" },
    { value: SEARCH_FIELDS.LINE_ART, label: "Line Art" },
    { value: SEARCH_FIELDS.WALL_MATERIAL, label: "Wall Type" },
    { value: SEARCH_FIELDS.BIOME, label: "Biome" },
    { value: SEARCH_FIELDS.GLITCH, label: "Glitch" },
    { value: SEARCH_FIELDS.SPECIAL_ROOM, label: "Special Room" },
];

export const ORDER_BY: { [key: string]: OrderByOptions } = {
    TOKEN_ID: "tokenId",
    ENEMY_RARITY_RANK: "enemyRarityRank",
    ITEM_RARITY_RANK: "itemRarityRank",
    CHALLENGE_RATING: "challengeRating",
    FEATURE_RARITY_RANK: "featureRarityRank",
};

export const ORDER_BY_OPTIONS: OptionsType<OrderByOptions>[] = [
    { value: ORDER_BY.TOKEN_ID, label: "Token ID" },
    { value: ORDER_BY.ENEMY_RARITY_RANK, label: "Enemy Rarity Rank" },
    { value: ORDER_BY.ITEM_RARITY_RANK, label: "Item Rarity Rank" },
    { value: ORDER_BY.CHALLENGE_RATING, label: "Challenge Rating" },
    { value: ORDER_BY.FEATURE_RARITY_RANK, label: "Feature Rarity Rank" },
];

export const MATERIAL_OPTIONS: OptionsType<Materials>[] = [
    { value: "stone", label: "Stone" },
    { value: "ruins", label: "Ruins" },
    { value: "temple", label: "Temple" },
    { value: "desert", label: "Desert" },
    { value: "volcanic", label: "Volcanic" },
];

export const BIOME_OPTIONS: OptionsType<Biomes>[] = [
    { value: "grasslands", label: "Grasslands" },
    { value: "forest", label: "Forest" },
    { value: "volcanic", label: "Volcanic" },
    { value: "mountains", label: "Mountains" },
    { value: "frozen lands", label: "Frozen Lands" },
];

export const ITEMS_OPTIONS: OptionsType<ItemTypes>[] = [
    { value: "coins", label: "Coins" },
    { value: "bag of coins", label: "Bag of Coins" },
    { value: "key", label: "Key" },
    { value: "chest", label: "Chest" },
    { value: "gem", label: "Gem" },
    { value: "food", label: "Food" },
    { value: "light armor", label: "Light Armor" },
    { value: "sword", label: "Sword" },
    { value: "bow", label: "Bow" },
    { value: "dagger", label: "Dagger" },
    { value: "scroll", label: "Scroll" },
    { value: "potion", label: "Potion" },
    { value: "wand", label: "Wand" },
    { value: "helm", label: "Helm" },
    { value: "shield", label: "Shield" },
    { value: "axe", label: "Axe" },
    { value: "heavy armor", label: "Heavy Armor" },
    { value: "robes", label: "Robes" },
    { value: "necklace", label: "Necklace" },
    { value: "ring", label: "Ring" },
    { value: "hat", label: "Hat" },
    { value: "boots", label: "Boots" },
    { value: "spear", label: "Spear" },
    { value: "hammer", label: "Hammer" },
    { value: "wrist", label: "Wrist" },
    { value: "shield", label: "Shield" },
    { value: "staff", label: "Staff" },
];

export const DWELLERS_OPTIONS: OptionsType<Dwellers>[] = [
    { value: "skell", label: "Skell" },
    { value: "giant spider", label: "Giant Spider" },
    { value: "hob gob", label: "Hob Gob" },
    { value: "kobold", label: "Kobold" },
    { value: "were rat", label: "Were Rat" },
    { value: "giant snake", label: "Giant Snake" },
    { value: "wyrden cat", label: "Wyrden Cat" },
    { value: "giant rat", label: "Giant Rat" },
    { value: "zombie", label: "Zombie" },
    { value: "bats", label: "Bats" },
    { value: "goblin", label: "Goblin" },
    { value: "dwarv", label: "Dwarv" },
    { value: "slime", label: "Slime" },
    { value: "mirthcreant", label: "Mirthcreant" },
    { value: "giant wasp", label: "Giant Wasp" },
    { value: "collector", label: "Collector" },
    { value: "arkan", label: "Arkan" },
    { value: "fey wing", label: "Fey Wing" },
    { value: "gargoyle", label: "Gargoyle" },
    { value: "crawler", label: "Crawler" },
    { value: "dead knight", label: "Dead Knight" },
    { value: "wisp", label: "Wisp" },
    { value: "vodyanoi", label: "Vodyanoi" },
    { value: "ghast", label: "Ghast" },
    { value: "ditch witch", label: "Ditch Witch" },
    { value: "paralisk", label: "Paralisk" },
    { value: "fomoian", label: "Fomoian" },
    { value: "brown pudding", label: "Brown Pudding" },
    { value: "devil bones", label: "Devil Bones" },
    { value: "stachelig", label: "Stachelig" },
    { value: "shadow elf", label: "Shadow Elf" },
    { value: "brownie", label: "Brownie" },
    { value: "jel cube", label: "Jel Cube" },
    { value: "gains goblin", label: "Gains Goblin" },
    { value: "troll", label: "Troll" },
    { value: "cockatrice", label: "Cockatrice" },
    { value: "traveler", label: "Traveler" },
    { value: "bubble eyes", label: "Bubble Eyes" },
    { value: "black pudding", label: "Black Pudding" },
    { value: "harpy", label: "Harpy" },
    { value: "quex", label: "Quex" },
    { value: "toothtube", label: "Toothtube" },
    { value: "night father", label: "Night Father" },
    { value: "dramock", label: "Dramock" },
    { value: "lost toad", label: "Lost Toad" },
    { value: "lost punk", label: "Lost Punk" },
    { value: "gem lizard", label: "Gem Lizard" },
    { value: "greiger", label: "Greiger" },
    { value: "bananach", label: "Bananach" },
    { value: "manticore", label: "Manticore" },
];

export const GLITCH_OPTIONS: OptionsType<GlitchTypes>[] = [
    { value: "Rainbow", label: "Rainbow" },
    { value: "Inversion", label: "Inversion" },
    { value: "Terminal: green", label: "Terminal: green" },
    { value: "Retro lcd", label: "Retro lcd" },
];

export const TRAPS_OPTIONS: OptionsType<TrapTypes>[] = [
    { value: "pit", label: "Pit" },
    { value: "gas", label: "Gas" },
    { value: "web", label: "Web" },
    { value: "spiked wall", label: "Spiked Wall" },
    { value: "lightning", label: "Lightning" },
];

export const SPECIAL_ROOMS_OPTIONS: OptionsType<SpecialRooms>[] = [
    { value: "giant hive", label: "Giant Hive" },
    { value: "the spider's web", label: "The Spider's Web" },
    { value: "ancient tomb", label: "Ancient Tomb" },
    { value: "collector's trap", label: "Collector's Trap" },
    { value: "enchanted forest", label: "Enchanted Forest" },
    { value: "temple of the gawds", label: "Temple of the Gawds" },
    { value: "torture chamber", label: "Torture Chamber" },
    { value: "rat warren", label: "Rat Warren" },
    { value: "carrion lair", label: "Carrion Lair" },
    { value: "spiral maze", label: "Spiral Maze" },
    { value: "ye floor is lava", label: "Ye Floor Is Lava" },
    { value: "flooded chamber", label: "Flooded Chamber" },
    { value: "witch's coven", label: "Witch's Coven" },
    { value: "king's vault", label: "King's Vault" },
];

export const LINE_ART_OPTIONS: OptionsType<LineArtTypes>[] = [
    { value: "rat and ring", label: "Rat and Ring" },
    { value: "the tower: bats", label: "The Tower: Bats" },
    { value: "silhouette: the warrior", label: "Silhouette: The Warrior" },
    { value: "three heroes", label: "Three Heroes" },
    { value: "roll: critical hit", label: "Roll: Critical Hit" },
    { value: "roll: miss", label: "Roll: Miss" },
    { value: "chest: a fortune", label: "Chest: A Fortune" },
    { value: "mystery feast", label: "Mystery Feast" },
    { value: "flagon, a few coppers", label: "Flagon, A Few Coppers" },
    { value: "summoning portal", label: "Summoning Portal" },
    { value: "the khopesh", label: "The Khopesh" },
    { value: "silhouette: lump", label: "Silhouette: Lump" },
    { value: "faun: the treasure", label: "Faun: The Treasure" },
    { value: "eyes on you", label: "Eyes On You" },
    { value: "silhouette: night father", label: "Silhouette: Night Father" },
    { value: "the tower: dragon", label: "The Tower: Dragon" },
    { value: "mage's tome", label: "Mage's Tome" },
    { value: "a dagger", label: "A Dagger" },
    { value: "bag of the rune keeper", label: "Bag of the Rune Keeper" },
    { value: "crystal ball: dragon's tower", label: "Crystal Ball: Dragons Tower" },
    { value: "bag of runes", label: "Bag of Runes" },
    { value: "hourglass: it's early", label: "Hourglass: It's Early" },
    { value: "the tower: clouds", label: "The Tower: Clouds" },
    { value: "rune reading: FCX", label: "Rune Reading: FCX" },
    { value: "chest: the mimic", label: "Chest: The Mimic" },
    { value: "the chalice", label: "The Chalice" },
    { value: "rune reading: MNX", label: "Rune Reading: MNX" },
    { value: "mysterious potion", label: "Mysterious Potion" },
    { value: "ancient scroll", label: "Ancient Scroll" },
    { value: "hourglass: in balance", label: "Hourglass: In Balance" },
    { value: "enchanted axe", label: "Enchanted Axe" },
    { value: "bag of coins", label: "Bag of Coins" },
    { value: "the tower: cosmic beast", label: "The Tower: Cosmic Beast" },
    { value: "silhouette: the demon", label: "Silhouette: The Demon" },
    { value: "crystal ball: the portal", label: "Crystal Ball: The Portal" },
    { value: "roll: fumble", label: "Roll: Fumble" },
    { value: "chest: the jump scare", label: "Chest: The Jump Scare" },
    { value: "crystal ball: hazy", label: "Crystal Ball: Hazy" },
    { value: "faun: the key", label: "Faun: The Key" },
    { value: "rune reading: ZYM", label: "Rune Reading: ZYM" },
    { value: "bag of bones", label: "Bag of Bones" },
    { value: "hourglass: later than you think", label: "Hourglass: Later Than You Think" },
    { value: "last call", label: "Last Call" },
    { value: "roll: hit", label: "Roll: Hit" },
];
