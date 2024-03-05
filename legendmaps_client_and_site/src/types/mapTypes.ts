export type HoverTileD = {
    name: string;
    description: string;
    type: string;
    rarity: string | null;
    rarityScore: number | null;
    countPerMap: number | null;
    size: number;
    offset: {
        x: number;
        y: number;
    };
};

export type IMapD = {
    asciiMap: string[];
    tokenId: number;
    name: string;
    image: string;
    attributes: IAttributeD[];
    entrance: Entrance;
    biome: Biome;
    lineart: LineArt;
    exit_connections: Directions[];
    items: Item[];
    dweller: Dweller[];
    traps: Trap[];
    glitch?: Glitch;
    room_count: number;
    map: string[];
    itemRarityRank: number; //items
    enemyRarityRank: number; //dwellers + traps
    featureRarityRank: number; //spec room, glitch, lineart, biome, wall
    challengeRating: number; //1 to 5, prob
    details?: string;
    wallMaterial: Materials;
    owner: string;

    total_count: number;
    died_count: number;
    chests_opened: number;
    gold_looted: number;
    items_looted: number;

    causesOfDeath: CauseOfDeath[];
};

export type CauseOfDeath = {
    count: number;
    causeOfDeath: string;
}

export type IAttributeD = {
    trait_type: Traits;
    value: string | number;
};

export type Entrance = {
    material_type: Materials;
    rarity: Rarities;
};

export type Biome = {
    biome: Biomes;
    rarity: Rarities;
};

export type LineArt = {
    art: LineArtTypes;
    rarity: Rarities;
};

export type Dweller = {
    dweller_name: Dwellers;
    rarity: Rarities;
};

export type Item = {
    item_class: ItemClasses;
    item_type: ItemTypes;
    item_type_rarity: Rarities;
    item_drop_rarity: Rarities;
};

export type Trap = {
    trap_type: TrapTypes;
    rarity: Rarities;
};

export type Glitch = {
    glitch: GlitchTypes;
    rarity: Rarities;
};

export type Traits =
    | "Wall Material"
    | "Biome"
    | "Line Art"
    | "Rooms"
    | "Item"
    | "Dweller"
    | "Dwellers"
    | "Traps"
    | "Trap"
    | "map";
export type Materials = "stone" | "ruins" | "temple" | "desert" | "volcanic";
export type Biomes = "grasslands" | "forest" | "volcanic" | "frozen lands" | "mountains";
export type Rarities = "uncommon" | "common" | "rare" | "epic" | "legendary" | "legendary+";
export type ItemClasses = "treasure" | "consumables" | "weapon";
export type TrapTypes = "pit" | "gas" | "web" | "spiked wall" | "lightning";
export type SpecialRooms =
    | "giant hive"
    | "the spider's web"
    | "ancient tomb"
    | "collector's trap"
    | "enchanted forest"
    | "temple of the gawds"
    | "torture chamber"
    | "rat warren"
    | "carrion lair"
    | "spiral maze"
    | "ye floor is lava"
    | "flooded chamber"
    | "witch's coven"
    | "king's vault";
export type ItemTypes =
    | "coins"
    | "bag of coins"
    | "key"
    | "chest"
    | "gem"
    | "food"
    | "light armor"
    | "sword"
    | "bow"
    | "dagger"
    | "scroll"
    | "potion"
    | "wand"
    | "helm"
    | "shield"
    | "axe"
    | "heavy armor"
    | "robes"
    | "necklace"
    | "ring"
    | "hat"
    | "boots"
    | "spear"
    | "hammer"
    | "wrist"
    | "shield"
    | "staff";
export type Dwellers =
    | "skell"
    | "giant spider"
    | "hob gob"
    | "kobold"
    | "were rat"
    | "giant snake"
    | "wyrden cat"
    | "giant rat"
    | "zombie"
    | "bats"
    | "goblin"
    | "dwarv"
    | "slime"
    | "mirthcreant"
    | "giant wasp"
    | "collector"
    | "arkan"
    | "fey wing"
    | "gargoyle"
    | "crawler"
    | "dead knight"
    | "wisp"
    | "vodyanoi"
    | "ghast"
    | "ditch witch"
    | "paralisk"
    | "fomoian"
    | "brown pudding"
    | "devil bones"
    | "stachelig"
    | "shadow elf"
    | "brownie"
    | "jel cube"
    | "gains goblin"
    | "troll"
    | "cockatrice"
    | "traveler"
    | "bubble eyes"
    | "black pudding"
    | "harpy"
    | "quex"
    | "toothtube"
    | "night father"
    | "dramock"
    | "lost toad"
    | "lost punk"
    | "gem lizard"
    | "greiger"
    | "bananach"
    | "manticore";
export type GlitchTypes = "Rainbow" | "Inversion" | "Terminal: green" | "Retro lcd";
export type Directions = "north" | "south" | "east" | "west";
export type LineArtTypes =
    | "rat and ring"
    | "the tower: bats"
    | "silhouette: the warrior"
    | "three heroes"
    | "roll: critical hit"
    | "roll: miss"
    | "chest: a fortune"
    | "mystery feast"
    | "flagon, a few coppers"
    | "summoning portal"
    | "the khopesh"
    | "silhouette: lump"
    | "faun: the treasure"
    | "eyes on you"
    | "silhouette: night father"
    | "the tower: dragon"
    | "mage's tome"
    | "a dagger"
    | "bag of the rune keeper"
    | "crystal ball: dragon's tower"
    | "bag of runes"
    | "hourglass: it's early"
    | "the tower: clouds"
    | "rune reading: FCX"
    | "chest: the mimic"
    | "the chalice"
    | "rune reading: MNX"
    | "mysterious potion"
    | "ancient scroll"
    | "hourglass: in balance"
    | "enchanted axe"
    | "bag of coins"
    | "the tower: cosmic beast"
    | "silhouette: the demon"
    | "crystal ball: the portal"
    | "roll: fumble"
    | "chest: the jump scare"
    | "crystal ball: hazy"
    | "faun: the key"
    | "rune reading: ZYM"
    | "bag of bones"
    | "hourglass: later than you think"
    | "last call"
    | "roll: hit";

export type SearchableFields =
    | "silhouette: the warrior"
    | "enchanted axe"
    | "name"
    | "tokenId"
    | "dweller"
    | "wallMaterial"
    | "items"
    | "traps"
    | "glitch"
    | "biome"
    | "lineart"
    | "specialRoom"
    | null;

export type OrderByOptions =
    | "enemyRank"
    | "itemRarityRank"
    | "challengeRank"
    | "featureRarityRank"
    | "tokenId"
    | "enemyRarityRank"
    | "challengeRating";

export type Order = "asc" | "desc";

export type MapQueryResponse = {
    rows: IMapD[];
    count: number;
    hasNextPage: boolean;
    page: number;
};

export type OptionsType<T> = {
    value: T;
    label: string;
};

export type SearchOptions = OptionsType<
    Materials | Biomes | ItemTypes | TrapTypes | Dwellers | GlitchTypes | SpecialRooms | LineArtTypes
>[];
