export type IAdventurerD = {
    tokenId: number;
    nativeTokenId: number;
    name: string;
    first_name: string;
    last_name: string;
    image: string;
    image_transparent: string;
    image_card: string;
    brawn: number;
    agility: number;
    guile: number;
    spirit: number;
    bags_total: number;
    traits: string[];
    art_background: string;
    art_armor: string;
    art_head: string;
    art_weapon: string;
    art_gear: string;
    art_shield: string;
    art_special: string;
    art_rarity: number;
    description_version?: number;
    lore?: {
        description: string;
        version: number;
        createdAt: string;
        authorAddressOrEns: string;
    };
    blacklisted: boolean;
    project: "CC" | "FRWC" | "LM";
    owner: string;
    dwellers_killed?: number;
    events_completed?: number;
    scrolls_read?: number;
    potions_drunk?: number;
    items_looted?: number;
    items_purchased?: number;
    gold_looted?: number;
    chests_opened?: number;
    total_count?: number;
    died_count?: number;
    campaigns_completed?: number;
    causesOfDeath?: CauseOfDeath[];
};

export type CauseOfDeath = {
    count: number;
    causeOfDeath: string;
};

export type OrderByOptions = "art_rarity" | "tokenId" | "bags_total" | "brawn" | "agility" | "guile" | "spirit";

export type Traits =
    | "Glitch: Ascii,Glitch: CGA,Glitch: Graph Paper,Glitch: Terminal,Glitch: Rainbow"
    | "Plot Armor"
    | "Polymath"
    | "Glitch: Ascii"
    | "Oafish"
    | "Troll Blood"
    | "Sneaky"
    | "Innocent"
    | "Chosen One"
    | "Lucky Strike"
    | "Escape Artist"
    | "Fey Touched"
    | "Jeweler"
    | "Insulated"
    | "Safecracker"
    | "Skeptic"
    | "H.P. Hatecraft"
    | "Lumberjack"
    | "Treasure Hunter"
    | "Underdog"
    | "Nimble"
    | "Locksmith"
    | "Glitch: CGA"
    | "Cutpurse"
    | "Eagle Eye"
    | "Glitch: Graph Paper"
    | "Fisher"
    | "Glitch: Terminal"
    | "Glitch: Rainbow"
    | "Reliable"
    | "Town Watch"
    | "Well-Grounded"
    | "Tinkerer"
    | "Paranoid"
    | "Sludge Grudge"
    | "People Person"
    | "Stress Eater"
    | "Silver Spoon"
    | "Unpierceable"
    | "Assassin"
    | "Vivacious"
    | "Apprentice"
    | "Fletcher"
    | "Unstoppable"
    | "Clean Freak"
    | "Fairy Tale Hater"
    | "Rune Reader"
    | "Spelunker"
    | "Squire"
    | "Thick Skin"
    | "Smith's Apprentice"
    | "Initiate"
    | "Deceptive"
    | "Slugger"
    | "Intimidating"
    | "Scribe"
    | "Pauper"
    | "Low Metabolism"
    | "Awkward"
    | "Necrophobic"
    | "Procrastinator"
    | "Realist"
    | "Physician"
    | "Goth"
    | "Hunter"
    | "Sanctimonious"
    | "Gravedigger"
    | "Fire Walker"
    | "Temple Charter"
    | "Trapper"
    | "Gourmand"
    | "Mountaineer"
    | "Naturalist"
    | "Runs Hot"
    | "Charming"
    | "Grizzled Veteran"
    | "Alchemist"
    | "Focused"
    | "Greenskeeper"
    | "Hardy Stock"
    | "Merchant"
    | "Scavenger"
    | "Fey Slayer"
    | "Strong Metabolism"
    | "Sand Crawler"
    | "Big Drinker"
    | "Northerner"
    | "Profligate"
    | "Brute"
    | "Misanthrope"
    | "Ruins Raider"
    | "Icy Veins"
    | "Librarian"
    | "Hell Walker"
    | "Demonslayer"
    | "Oblivious"
    | "Glitch Walker";

export type GLITCH = "Glitch: Ascii" | "Glitch: CGA" | "Glitch: Graph Paper" | "Glitch: Terminal" | "Glitch: Rainbow";

export type ART =
    | "naga inquistor cap"
    | "forlorn hood"
    | "hair 39"
    | "hair 27"
    | "delve helm"
    | "hair 59"
    | "hair 57"
    | "hair 29"
    | "standard great helm"
    | "dragon's guard helm"
    | "fur half helm"
    | "hair 31"
    | "stalker's wrap"
    | "mountain toque"
    | "hair 24"
    | "hair 19"
    | "sword and moon bonnet"
    | "hair 60"
    | "bolger's lament"
    | "hair 43"
    | "hood of the feared"
    | "cavalry half helm"
    | "wrapped countenance"
    | "footman's cap"
    | "hair 10"
    | "alchemist's cap"
    | "hair 34"
    | "delda's cage"
    | "rictus visage"
    | "buckled conjurer hat"
    | "leather sprangenhelm"
    | "black iron close helm"
    | "hair 2"
    | "hair 21"
    | "premunir"
    | "half helm horned"
    | "hair 38"
    | "hair 18"
    | "banded sprangenhelm"
    | "crowned great helm"
    | "hair 61"
    | "hair 58"
    | "hair 15"
    | "channeler's hat"
    | "hair 4"
    | "hair 52"
    | "hair 47"
    | "steppe's brass helm"
    | "emporer mink cap"
    | "hair 26"
    | "pigface"
    | "hair 40"
    | "hair 33"
    | "hair 25"
    | "iron armsmen"
    | "horned defender"
    | "stout frog's mouth"
    | "hair 7"
    | "rusted crown"
    | "hair 16"
    | "studded mask"
    | "ragged cloak"
    | "hair 5"
    | "hair 12"
    | "hair 23"
    | "hair 41"
    | "hair 54"
    | "hair 56"
    | "traveller's hood"
    | "hair 17"
    | "hair 32"
    | "hair 14"
    | "leather ushunka"
    | "steel great helm"
    | "hair 30"
    | "hair 6"
    | "wiz hat common"
    | "hair 3"
    | "hair 37"
    | "hair 11"
    | "skull & rose half helm"
    | "hair 9"
    | "hair 22"
    | "normal nasal helm"
    | "naga aswaran helm"
    | "occult bonnet"
    | "hair 48"
    | "hair 1"
    | "full metal armet"
    | "bronze sallet"
    | "unbreachable great helm"
    | "hair 53"
    | "kettle head helm"
    | "game's great helm"
    | "hair 42"
    | "hair 46"
    | "dandy's favor"
    | "hair 44"
    | "fine magus cone"
    | "hair 45"
    | "hair 50"
    | "hair 28"
    | "hedge topper"
    | "hair 8"
    | "bone crown"
    | "clipped light armet"
    | "hair 36"
    | "hair 20"
    | "hair 35"
    | "hair 49"
    | "the dummy helm"
    | "old god's crown"
    | "hair 13"
    | "temple mage garb"
    | "occultist's charm robe"
    | "defender's blessed plate"
    | "rizellda's formal"
    | "victor's lush fur armor"
    | "scryer's robe"
    | "rogue's full leathers"
    | "plain's hide and horn armor"
    | "enchanted mezzmer"
    | "studded & quilted leather"
    | "champion's plate"
    | "rogue's leather vest"
    | "clasped leather vest"
    | "adventurer's chain mail"
    | "raider's armor"
    | "naga guard coat"
    | "tough boiled leather"
    | "simple farmer armor"
    | "collared plate"
    | "acolyte robe"
    | "hedge wizard outfit"
    | "stealth quilted enhanced"
    | "charlatan's outfit"
    | "steel plate"
    | "naga priest's robe"
    | "naga healer's garb"
    | "humble servant robe"
    | "apprentice's ambition"
    | "warlock's robes"
    | "stealth quilted"
    | "quam quilted and leather"
    | "iron tower plate"
    | "merchant's getup"
    | "temporal subjegator's trappings"
    | "royal eagle armor"
    | "explorer's wrap"
    | "keen's adventuring garb"
    | "wizard's robes"
    | "worn threads"
    | "common barbarian"
    | "fine magus robe"
    | "king's guard chain mail"
    | "bravo's plate"
    | "fighter full leathers"
    | "ruler's fur armor"
    | "skull and roses chain"
    | "black steel plate"
    | "collared mezzmer"
    | "naga skin robe"
    | "sword of honor"
    | "gilded blade"
    | "long bow"
    | "battle axe"
    | "stone axe"
    | "runic bow"
    | "pole"
    | "regal long sword"
    | "ornate bow"
    | "footman's gift"
    | "morning glory"
    | "block mace"
    | "shamanic staff"
    | "trident"
    | "steel sword"
    | "crescent pole"
    | "dawnbringer sword"
    | "spiked club"
    | "viking axe"
    | "zorach warrior sword"
    | "thumper"
    | "isles broad sword"
    | "woodsman's axe"
    | "ornate bastard sword"
    | "dark bargains wand"
    | "recurve bow"
    | "iron sword"
    | "crafted stabber"
    | "star mace"
    | "leaf spear"
    | "wooden staff"
    | "glower's staff"
    | "iron short sword"
    | "bo stick"
    | "iron bastard"
    | "battle hammer"
    | "crystal wand"
    | "staff of spheres"
    | "glaive"
    | "gladius"
    | "greater staff of spheres"
    | "spiked mace"
    | "wand of curses"
    | "ornate hammer"
    | "culling scythe"
    | "ritual axe"
    | "ornate spear"
    | "legion long sword"
    | "wand of the claw"
    | "perfect katana"
    | "bedroll"
    | "bountiful backpack"
    | "ornate quiver"
    | "climber's backpack"
    | "treasure hunter's backpack"
    | "diamond heater shield"
    | "legend shield"
    | "wooden shield"
    | "dragon shield"
    | "lion targe"
    | "augur targe"
    | "knight's shield"
    | "weathered shield"
    | "hunter's eye"
    | "eyes of the dramock"
    | "sword scar"
    | "tear scar"
    | "eyes of the witness"
    | "dividing scar"
    | "warding runes"
    | "snarling scar"
    | "dagger scar"
    | "painted mask"
    | "stalker's eye"
    | "eyes of the fey"
    | "unique"
    | "runic vision"
    | "sign of sorrow"
    | "talon scar"
    | "runic wards"
    | "mark of fury"
    | "eye of the deep"
    | "tally tattoo"
    | "spear scar"
    | "runic scar"
    | "beast claw scar";

export const art = [
    {
        name: "naga inquistor cap",
        percentage: 0.011379,
        type: "art_head",
    },
    { type: "art_head", name: "forlorn hood", percentage: 0.007852 },
    { type: "art_head", name: "hair 39", percentage: 0.007624 },
    { type: "art_head", name: "hair 27", percentage: 0.008648 },
    { type: "art_head", name: "delve helm", percentage: 0.00899 },
    { type: "art_head", name: "hair 59", percentage: 0.005007 },
    { type: "art_head", name: "hair 57", percentage: 0.0099 },
    { type: "art_head", name: "hair 29", percentage: 0.008421 },
    {
        type: "art_head",
        name: "standard great helm",
        percentage: 0.018207,
    },
    {
        type: "art_head",
        name: "dragon's guard helm",
        percentage: 0.002731,
    },
    { type: "art_head", name: "fur half helm", percentage: 0.01741 },
    { type: "art_head", name: "hair 31", percentage: 0.007169 },
    { name: "stalker's wrap", percentage: 0.018662, type: "art_head" },
    { name: "mountain toque", percentage: 0.007283, type: "art_head" },
    { type: "art_head", name: "hair 24", percentage: 0.004438 },
    { type: "art_head", name: "hair 19", percentage: 0.00239 },
    {
        name: "sword and moon bonnet",
        percentage: 0.016158,
        type: "art_head",
    },
    { type: "art_head", name: "hair 60", percentage: 0.018434 },
    { name: "bolger's lament", percentage: 0.007055, type: "art_head" },
    { type: "art_head", name: "hair 43", percentage: 0.009558 },
    {
        type: "art_head",
        name: "hood of the feared",
        percentage: 0.007169,
    },
    { type: "art_head", name: "cavalry half helm", percentage: 0.013769 },
    {
        name: "wrapped countenance",
        percentage: 0.003983,
        type: "art_head",
    },
    { name: "footman's cap", percentage: 0.012745, type: "art_head" },
    { type: "art_head", name: "hair 10", percentage: 0.019117 },
    { name: "alchemist's cap", percentage: 0.004779, type: "art_head" },
    { type: "art_head", name: "hair 34", percentage: 0.002845 },
    { type: "art_head", name: "delda's cage", percentage: 0.001252 },
    { name: "rictus visage", percentage: 0.012062, type: "art_head" },
    {
        name: "buckled conjurer hat",
        percentage: 0.015476,
        type: "art_head",
    },
    {
        type: "art_head",
        name: "leather sprangenhelm",
        percentage: 0.018207,
    },
    {
        type: "art_head",
        name: "black iron close helm",
        percentage: 0.001593,
    },
    { type: "art_head", name: "hair 2", percentage: 0.009331 },
    { type: "art_head", name: "hair 21", percentage: 0.002503 },
    { name: "premunir", percentage: 0.014224, type: "art_head" },
    { type: "art_head", name: "half helm horned", percentage: 0.005121 },
    { type: "art_head", name: "hair 38", percentage: 0.004096 },
    { type: "art_head", name: "hair 18", percentage: 0.002162 },
    {
        type: "art_head",
        name: "banded sprangenhelm",
        percentage: 0.012062,
    },
    {
        type: "art_head",
        name: "crowned great helm",
        percentage: 0.005121,
    },
    { type: "art_head", name: "hair 61", percentage: 0.005576 },
    { type: "art_head", name: "hair 58", percentage: 0.009786 },
    { type: "art_head", name: "hair 15", percentage: 0.009558 },
    { name: "channeler's hat", percentage: 0.006372, type: "art_head" },
    { type: "art_head", name: "hair 4", percentage: 0.0099 },
    { type: "art_head", name: "hair 52", percentage: 0.0033 },
    { type: "art_head", name: "hair 47", percentage: 0.001707 },
    {
        type: "art_head",
        name: "steppe's brass helm",
        percentage: 0.018776,
    },
    { name: "emporer mink cap", percentage: 0.019686, type: "art_head" },
    { type: "art_head", name: "hair 26", percentage: 0.011607 },
    { name: "pigface", percentage: 0.002162, type: "art_head" },
    { type: "art_head", name: "hair 40", percentage: 0.011607 },
    { type: "art_head", name: "hair 33", percentage: 0.011948 },
    { type: "art_head", name: "hair 25", percentage: 0.005803 },
    { name: "iron armsmen", percentage: 0.005576, type: "art_head" },
    { name: "horned defender", percentage: 0.011948, type: "art_head" },
    {
        name: "stout frog's mouth",
        percentage: 0.004324,
        type: "art_head",
    },
    { type: "art_head", name: "hair 7", percentage: 0.004552 },
    { name: "rusted crown", percentage: 0.019003, type: "art_head" },
    { type: "art_head", name: "hair 16", percentage: 0.005917 },
    { name: "studded mask", percentage: 0.016727, type: "art_head" },
    { name: "ragged cloak", percentage: 0.014452, type: "art_head" },
    { type: "art_head", name: "hair 5", percentage: 0.009672 },
    { type: "art_head", name: "hair 12", percentage: 0.008307 },
    { type: "art_head", name: "hair 23", percentage: 0.004552 },
    { type: "art_head", name: "hair 41", percentage: 0.004665 },
    { type: "art_head", name: "hair 54", percentage: 0.004665 },
    { type: "art_head", name: "hair 56", percentage: 0.009445 },
    { type: "art_head", name: "traveller's hood", percentage: 0.006941 },
    { type: "art_head", name: "hair 17", percentage: 0.005462 },
    { type: "art_head", name: "hair 32", percentage: 0.011493 },
    { type: "art_head", name: "hair 14", percentage: 0.009558 },
    { name: "leather ushunka", percentage: 0.018434, type: "art_head" },
    { type: "art_head", name: "steel great helm", percentage: 0.017751 },
    { type: "art_head", name: "hair 30", percentage: 0.007852 },
    { type: "art_head", name: "hair 6", percentage: 0.00421 },
    { name: "wiz hat common", percentage: 0.020369, type: "art_head" },
    { type: "art_head", name: "hair 3", percentage: 0.008762 },
    { type: "art_head", name: "hair 37", percentage: 0.006031 },
    { type: "art_head", name: "hair 11", percentage: 0.009331 },
    {
        type: "art_head",
        name: "skull & rose half helm",
        percentage: 0.008534,
    },
    { type: "art_head", name: "hair 9", percentage: 0.005348 },
    { type: "art_head", name: "hair 22", percentage: 0.004779 },
    { type: "art_head", name: "normal nasal helm", percentage: 0.011265 },
    { type: "art_head", name: "naga aswaran helm", percentage: 0.018093 },
    { name: "occult bonnet", percentage: 0.007965, type: "art_head" },
    { type: "art_head", name: "hair 48", percentage: 0.00421 },
    { type: "art_head", name: "hair 1", percentage: 0.009217 },
    { name: "full metal armet", percentage: 0.00239, type: "art_head" },
    { name: "bronze sallet", percentage: 0.001593, type: "art_head" },
    {
        type: "art_head",
        name: "unbreachable great helm",
        percentage: 0.017638,
    },
    { type: "art_head", name: "hair 53", percentage: 0.002276 },
    { type: "art_head", name: "kettle head helm", percentage: 0.002731 },
    { type: "art_head", name: "game's great helm", percentage: 0.009331 },
    { type: "art_head", name: "hair 42", percentage: 0.008762 },
    { type: "art_head", name: "hair 46", percentage: 0.002276 },
    { name: "dandy's favor", percentage: 0.008307, type: "art_head" },
    { type: "art_head", name: "hair 44", percentage: 0.002276 },
    { name: "fine magus cone", percentage: 0.012289, type: "art_head" },
    { type: "art_head", name: "hair 45", percentage: 0.004324 },
    { type: "art_head", name: "hair 50", percentage: 0.002731 },
    { type: "art_head", name: "hair 28", percentage: 0.004893 },
    { name: "hedge topper", percentage: 0.018662, type: "art_head" },
    { type: "art_head", name: "hair 8", percentage: 0.009786 },
    { name: "bone crown", percentage: 0.017979, type: "art_head" },
    {
        name: "clipped light armet",
        percentage: 0.003414,
        type: "art_head",
    },
    { type: "art_head", name: "hair 36", percentage: 0.006259 },
    { type: "art_head", name: "hair 20", percentage: 0.006486 },
    { type: "art_head", name: "hair 35", percentage: 0.009217 },
    { type: "art_head", name: "hair 49", percentage: 0.001934 },
    { type: "art_head", name: "the dummy helm", percentage: 0.007965 },
    { name: "old god's crown", percentage: 0.01741, type: "art_head" },
    { type: "art_head", name: "hair 13", percentage: 0.005803 },
    { name: "temple mage garb", percentage: 0.022645, type: "art_armor" },
    {
        name: "occultist's charm robe",
        percentage: 0.021734,
        type: "art_armor",
    },
    {
        name: "defender's blessed plate",
        percentage: 0.020482,
        type: "art_armor",
    },
    {
        name: "rizellda's formal",
        percentage: 0.006031,
        type: "art_armor",
    },
    {
        name: "victor's lush fur armor",
        percentage: 0.022645,
        type: "art_armor",
    },
    { name: "scryer's robe", percentage: 0.023555, type: "art_armor" },
    {
        name: "rogue's full leathers",
        percentage: 0.024351,
        type: "art_armor",
    },
    {
        name: "plain's hide and horn armor",
        percentage: 0.010469,
        type: "art_armor",
    },
    {
        name: "enchanted mezzmer",
        percentage: 0.004438,
        type: "art_armor",
    },
    {
        name: "studded & quilted leather",
        percentage: 0.022986,
        type: "art_armor",
    },
    { name: "champion's plate", percentage: 0.018434, type: "art_armor" },
    {
        name: "rogue's leather vest",
        percentage: 0.023213,
        type: "art_armor",
    },
    {
        name: "clasped leather vest",
        percentage: 0.018093,
        type: "art_armor",
    },
    {
        name: "adventurer's chain mail",
        percentage: 0.022417,
        type: "art_armor",
    },
    { name: "raider's armor", percentage: 0.023782, type: "art_armor" },
    { name: "naga guard coat", percentage: 0.020824, type: "art_armor" },
    {
        name: "tough boiled leather",
        percentage: 0.023896,
        type: "art_armor",
    },
    {
        name: "simple farmer armor",
        percentage: 0.024238,
        type: "art_armor",
    },
    { name: "collared plate", percentage: 0.020141, type: "art_armor" },
    { name: "acolyte robe", percentage: 0.02401, type: "art_armor" },
    {
        name: "hedge wizard outfit",
        percentage: 0.024238,
        type: "art_armor",
    },
    {
        name: "stealth quilted enhanced",
        percentage: 0.022417,
        type: "art_armor",
    },
    {
        name: "charlatan's outfit",
        percentage: 0.024351,
        type: "art_armor",
    },
    { name: "steel plate", percentage: 0.02162, type: "art_armor" },
    {
        name: "naga priest's robe",
        percentage: 0.022189,
        type: "art_armor",
    },
    {
        name: "naga healer's garb",
        percentage: 0.012403,
        type: "art_armor",
    },
    {
        name: "humble servant robe",
        percentage: 0.023555,
        type: "art_armor",
    },
    {
        name: "apprentice's ambition",
        percentage: 0.021734,
        type: "art_armor",
    },
    { name: "warlock's robes", percentage: 0.023327, type: "art_armor" },
    { name: "stealth quilted", percentage: 0.024351, type: "art_armor" },
    {
        name: "quam quilted and leather",
        percentage: 0.025376,
        type: "art_armor",
    },
    { name: "iron tower plate", percentage: 0.0231, type: "art_armor" },
    { name: "merchant's getup", percentage: 0.021848, type: "art_armor" },
    {
        name: "temporal subjegator's trappings",
        percentage: 0.021051,
        type: "art_armor",
    },
    {
        name: "royal eagle armor",
        percentage: 0.019231,
        type: "art_armor",
    },
    { name: "explorer's wrap", percentage: 0.022645, type: "art_armor" },
    {
        name: "keen's adventuring garb",
        percentage: 0.022303,
        type: "art_armor",
    },
    { name: "wizard's robes", percentage: 0.024238, type: "art_armor" },
    { name: "worn threads", percentage: 0.02401, type: "art_armor" },
    { name: "common barbarian", percentage: 0.022076, type: "art_armor" },
    { name: "fine magus robe", percentage: 0.022986, type: "art_armor" },
    {
        name: "king's guard chain mail",
        percentage: 0.021962,
        type: "art_armor",
    },
    { name: "bravo's plate", percentage: 0.012517, type: "art_armor" },
    {
        name: "fighter full leathers",
        percentage: 0.023327,
        type: "art_armor",
    },
    {
        name: "ruler's fur armor",
        percentage: 0.019914,
        type: "art_armor",
    },
    {
        name: "skull and roses chain",
        percentage: 0.011152,
        type: "art_armor",
    },
    {
        name: "black steel plate",
        percentage: 0.021848,
        type: "art_armor",
    },
    { name: "collared mezzmer", percentage: 0.008193, type: "art_armor" },
    { name: "naga skin robe", percentage: 0.012517, type: "art_armor" },
    { name: "sword of honor", percentage: 0.020824, type: "art_weapon" },
    { name: "gilded blade", percentage: 0.013541, type: "art_weapon" },
    { name: "long bow", percentage: 0.022645, type: "art_weapon" },
    { name: "battle axe", percentage: 0.020938, type: "art_weapon" },
    { name: "stone axe", percentage: 0.016955, type: "art_weapon" },
    { name: "runic bow", percentage: 0.013541, type: "art_weapon" },
    { name: "pole", percentage: 0.016841, type: "art_weapon" },
    {
        name: "regal long sword",
        percentage: 0.012631,
        type: "art_weapon",
    },
    { name: "ornate bow", percentage: 0.0231, type: "art_weapon" },
    { name: "footman's gift", percentage: 0.023782, type: "art_weapon" },
    { name: "morning glory", percentage: 0.017069, type: "art_weapon" },
    { name: "block mace", percentage: 0.019686, type: "art_weapon" },
    { name: "shamanic staff", percentage: 0.011493, type: "art_weapon" },
    { name: "trident", percentage: 0.019686, type: "art_weapon" },
    { name: "steel sword", percentage: 0.025034, type: "art_weapon" },
    { name: "crescent pole", percentage: 0.018093, type: "art_weapon" },
    {
        name: "dawnbringer sword",
        percentage: 0.024238,
        type: "art_weapon",
    },
    { name: "spiked club", percentage: 0.018662, type: "art_weapon" },
    { name: "viking axe", percentage: 0.019458, type: "art_weapon" },
    {
        name: "zorach warrior sword",
        percentage: 0.021734,
        type: "art_weapon",
    },
    { name: "thumper", percentage: 0.020938, type: "art_weapon" },
    {
        name: "isles broad sword",
        percentage: 0.023213,
        type: "art_weapon",
    },
    { name: "woodsman's axe", percentage: 0.019231, type: "art_weapon" },
    {
        name: "ornate bastard sword",
        percentage: 0.023669,
        type: "art_weapon",
    },
    {
        name: "dark bargains wand",
        percentage: 0.012631,
        type: "art_weapon",
    },
    { name: "recurve bow", percentage: 0.021165, type: "art_weapon" },
    { name: "iron sword", percentage: 0.023782, type: "art_weapon" },
    { name: "crafted stabber", percentage: 0.024238, type: "art_weapon" },
    { name: "star mace", percentage: 0.017979, type: "art_weapon" },
    { name: "leaf spear", percentage: 0.020824, type: "art_weapon" },
    { name: "wooden staff", percentage: 0.023327, type: "art_weapon" },
    { name: "glower's staff", percentage: 0.023213, type: "art_weapon" },
    {
        name: "iron short sword",
        percentage: 0.022189,
        type: "art_weapon",
    },
    { name: "bo stick", percentage: 0.01741, type: "art_weapon" },
    { name: "iron bastard", percentage: 0.023896, type: "art_weapon" },
    { name: "battle hammer", percentage: 0.021393, type: "art_weapon" },
    { name: "crystal wand", percentage: 0.011265, type: "art_weapon" },
    {
        name: "staff of spheres",
        percentage: 0.021962,
        type: "art_weapon",
    },
    { name: "glaive", percentage: 0.023441, type: "art_weapon" },
    { name: "gladius", percentage: 0.025262, type: "art_weapon" },
    {
        name: "greater staff of spheres",
        percentage: 0.012062,
        type: "art_weapon",
    },
    { name: "spiked mace", percentage: 0.019914, type: "art_weapon" },
    { name: "wand of curses", percentage: 0.020938, type: "art_weapon" },
    { name: "ornate hammer", percentage: 0.02162, type: "art_weapon" },
    { name: "culling scythe", percentage: 0.01832, type: "art_weapon" },
    { name: "ritual axe", percentage: 0.020369, type: "art_weapon" },
    { name: "ornate spear", percentage: 0.022303, type: "art_weapon" },
    {
        name: "legion long sword",
        percentage: 0.021051,
        type: "art_weapon",
    },
    {
        name: "wand of the claw",
        percentage: 0.013086,
        type: "art_weapon",
    },
    { name: "perfect katana", percentage: 0.022076, type: "art_weapon" },
    {
        name: "diamond heater shield",
        percentage: 0.017751,
        type: "art_shield",
    },
    { name: "legend shield", percentage: 0.009331, type: "art_shield" },
    { name: "wooden shield", percentage: 0.017865, type: "art_shield" },
    { name: "dragon shield", percentage: 0.006259, type: "art_shield" },
    { name: "lion targe", percentage: 0.017751, type: "art_shield" },
    { name: "augur targe", percentage: 0.009672, type: "art_shield" },
    { name: "knight's shield", percentage: 0.0165, type: "art_shield" },
    {
        name: "weathered shield",
        percentage: 0.015931,
        type: "art_shield",
    },
    { name: "hunter's eye", percentage: 0.011721, type: "art_special" },
    {
        name: "eyes of the dramock",
        percentage: 0.005917,
        type: "art_special",
    },
    { name: "sword scar", percentage: 0.006941, type: "art_special" },
    { name: "tear scar", percentage: 0.002503, type: "art_special" },
    {
        name: "eyes of the witness",
        percentage: 0.010696,
        type: "art_special",
    },
    { name: "dividing scar", percentage: 0.005462, type: "art_special" },
    { name: "warding runes", percentage: 0.006714, type: "art_special" },
    { name: "snarling scar", percentage: 0.003983, type: "art_special" },
    { name: "dagger scar", percentage: 0.006145, type: "art_special" },
    { name: "painted mask", percentage: 0.00569, type: "art_special" },
    { name: "stalker's eye", percentage: 0.003414, type: "art_special" },
    {
        name: "eyes of the fey",
        percentage: 0.005803,
        type: "art_special",
    },
    { type: "art_special", name: "unique", percentage: 0.001138 },
    { name: "runic vision", percentage: 0.014452, type: "art_special" },
    { name: "sign of sorrow", percentage: 0.005234, type: "art_special" },
    { name: "talon scar", percentage: 0.006259, type: "art_special" },
    { name: "runic wards", percentage: 0.002617, type: "art_special" },
    { name: "mark of fury", percentage: 0.011379, type: "art_special" },
    {
        name: "eye of the deep",
        percentage: 0.002845,
        type: "art_special",
    },
    { name: "tally tattoo", percentage: 0.004438, type: "art_special" },
    { name: "spear scar", percentage: 0.005462, type: "art_special" },
    { name: "runic scar", percentage: 0.002617, type: "art_special" },
    {
        name: "beast claw scar",
        percentage: 0.005803,
        type: "art_special",
    },
    { name: "bedroll", percentage: 0.014907, type: "art_gear" },
    {
        name: "bountiful backpack",
        percentage: 0.016727,
        type: "art_gear",
    },
    { name: "ornate quiver", percentage: 0.014907, type: "art_gear" },
    {
        name: "climber's backpack",
        percentage: 0.014793,
        type: "art_gear",
    },
    {
        name: "treasure hunter's backpack",
        percentage: 0.007283,
        type: "art_gear",
    },
];

export const traits = [
    {
        name: "Plot Armor",
        percentage: 0.001138,
    },
    {
        name: "Polymath",
        percentage: 0.003072,
    },
    {
        name: "Glitch: Ascii",
        percentage: 0.006145,
    },
    {
        name: "Oafish",
        percentage: 0.007396,
    },
    {
        name: "Troll Blood",
        percentage: 0.007738,
    },
    {
        name: "Sneaky",
        percentage: 0.007852,
    },
    {
        name: "Innocent",
        percentage: 0.008079,
    },
    {
        name: "Chosen One",
        percentage: 0.008079,
    },
    {
        name: "Lucky Strike",
        percentage: 0.008534,
    },
    {
        name: "Escape Artist",
        percentage: 0.008534,
    },
    {
        name: "Fey Touched",
        percentage: 0.008762,
    },
    {
        name: "Jeweler",
        percentage: 0.008876,
    },
    {
        name: "Insulated",
        percentage: 0.00899,
    },
    {
        name: "Safecracker",
        percentage: 0.009103,
    },
    {
        name: "Skeptic",
        percentage: 0.009331,
    },
    {
        name: "H.P. Hatecraft",
        percentage: 0.009331,
    },
    {
        name: "Lumberjack",
        percentage: 0.009672,
    },
    {
        name: "Treasure Hunter",
        percentage: 0.009786,
    },
    {
        name: "Underdog",
        percentage: 0.0099,
    },
    {
        name: "Nimble",
        percentage: 0.010241,
    },
    {
        name: "Locksmith",
        percentage: 0.010355,
    },
    {
        name: "Glitch: CGA",
        percentage: 0.010696,
    },
    {
        name: "Cutpurse",
        percentage: 0.010696,
    },
    {
        name: "Eagle Eye",
        percentage: 0.01081,
    },
    {
        name: "Glitch: Graph Paper",
        percentage: 0.011493,
    },
    {
        name: "Fisher",
        percentage: 0.011607,
    },
    {
        name: "Glitch: Terminal",
        percentage: 0.012062,
    },
    {
        name: "Glitch: Rainbow",
        percentage: 0.012403,
    },
    {
        name: "Reliable",
        percentage: 0.013541,
    },
    {
        name: "Town Watch",
        percentage: 0.014907,
    },
    {
        name: "Well-Grounded",
        percentage: 0.015589,
    },
    {
        name: "Tinkerer",
        percentage: 0.016158,
    },
    {
        name: "Paranoid",
        percentage: 0.016272,
    },
    {
        name: "Sludge Grudge",
        percentage: 0.016955,
    },
    {
        name: "People Person",
        percentage: 0.017069,
    },
    {
        name: "Stress Eater",
        percentage: 0.01741,
    },
    {
        name: "Silver Spoon",
        percentage: 0.017751,
    },
    {
        name: "Unpierceable",
        percentage: 0.017979,
    },
    {
        name: "Assassin",
        percentage: 0.017979,
    },
    {
        name: "Vivacious",
        percentage: 0.018548,
    },
    {
        name: "Apprentice",
        percentage: 0.018548,
    },
    {
        name: "Fletcher",
        percentage: 0.018662,
    },
    {
        name: "Unstoppable",
        percentage: 0.018776,
    },
    {
        name: "Clean Freak",
        percentage: 0.019003,
    },
    {
        name: "Fairy Tale Hater",
        percentage: 0.019572,
    },
    {
        name: "Rune Reader",
        percentage: 0.019572,
    },
    {
        name: "Spelunker",
        percentage: 0.019914,
    },
    {
        name: "Squire",
        percentage: 0.020141,
    },
    {
        name: "Thick Skin",
        percentage: 0.02071,
    },
    {
        name: "Smith's Apprentice",
        percentage: 0.020824,
    },
    {
        name: "Initiate",
        percentage: 0.021279,
    },
    {
        name: "Deceptive",
        percentage: 0.02162,
    },
    {
        name: "Slugger",
        percentage: 0.021962,
    },
    {
        name: "Intimidating",
        percentage: 0.022986,
    },
    {
        name: "Scribe",
        percentage: 0.028562,
    },
    {
        name: "Pauper",
        percentage: 0.028903,
    },
    {
        name: "Low Metabolism",
        percentage: 0.030155,
    },
    {
        name: "Awkward",
        percentage: 0.030269,
    },
    {
        name: "Necrophobic",
        percentage: 0.030382,
    },
    {
        name: "Procrastinator",
        percentage: 0.030838,
    },
    {
        name: "Realist",
        percentage: 0.031065,
    },
    {
        name: "Physician",
        percentage: 0.03152,
    },
    {
        name: "Goth",
        percentage: 0.031634,
    },
    {
        name: "Hunter",
        percentage: 0.031975,
    },
    {
        name: "Sanctimonious",
        percentage: 0.032089,
    },
    {
        name: "Gravedigger",
        percentage: 0.032089,
    },
    {
        name: "Fire Walker",
        percentage: 0.032772,
    },
    {
        name: "Temple Charter",
        percentage: 0.032886,
    },
    {
        name: "Trapper",
        percentage: 0.033,
    },
    {
        name: "Gourmand",
        percentage: 0.033,
    },
    {
        name: "Mountaineer",
        percentage: 0.033,
    },
    {
        name: "Naturalist",
        percentage: 0.033113,
    },
    {
        name: "Runs Hot",
        percentage: 0.033113,
    },
    {
        name: "Charming",
        percentage: 0.033113,
    },
    {
        name: "Grizzled Veteran",
        percentage: 0.033341,
    },
    {
        name: "Alchemist",
        percentage: 0.033682,
    },
    {
        name: "Focused",
        percentage: 0.033682,
    },
    {
        name: "Greenskeeper",
        percentage: 0.034137,
    },
    {
        name: "Hardy Stock",
        percentage: 0.034137,
    },
    {
        name: "Merchant",
        percentage: 0.034137,
    },
    {
        name: "Scavenger",
        percentage: 0.034251,
    },
    {
        name: "Fey Slayer",
        percentage: 0.034706,
    },
    {
        name: "Strong Metabolism",
        percentage: 0.03482,
    },
    {
        name: "Sand Crawler",
        percentage: 0.03482,
    },
    {
        name: "Big Drinker",
        percentage: 0.035048,
    },
    {
        name: "Northerner",
        percentage: 0.035162,
    },
    {
        name: "Profligate",
        percentage: 0.035162,
    },
    {
        name: "Brute",
        percentage: 0.035275,
    },
    {
        name: "Misanthrope",
        percentage: 0.035275,
    },
    {
        name: "Ruins Raider",
        percentage: 0.035958,
    },
    {
        name: "Icy Veins",
        percentage: 0.036186,
    },
    {
        name: "Librarian",
        percentage: 0.036299,
    },
    {
        name: "Hell Walker",
        percentage: 0.036641,
    },
    {
        name: "Demonslayer",
        percentage: 0.036755,
    },
    {
        name: "Oblivious",
        percentage: 0.038006,
    },
    {
        name: "Glitch Walker",
        percentage: 0.052799,
    },
];

export type Order = "asc" | "desc";

export type AdventurerQueryResponse = {
    rows: IAdventurerD[];
    count: number;
    hasNextPage: boolean;
    page: number;
};

export type SearchableFields = "name" | "tokenId" | "glitch" | "art" | "traits" | null;

export type OptionsType<T> = {
    value: T;
    label: string;
};

export type SearchOptions = OptionsType<Traits>[] | { value: string; label: string }[];
