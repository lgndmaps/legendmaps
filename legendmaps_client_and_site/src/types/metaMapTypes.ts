export type HoverTileD = {
    name: string;
    type: string;
    rarity: Rarities | null;
    size: number;
    offset: {
        x: number;
        y: number;
    };
};

export type IMapMetaD = {
    items: Item[];
    dwellers: Dweller[];
    traps: Trap[];
    specialRooms: SpecialRoom[];
    globals: Global[];
    map: Array<MapTile>[];
};

export type IAttributeD = {
    trait_type: Traits;
    value: string | number;
};

export type Global = {
    type: GlobalType;
    countPerMap: number;
    rarityString: Rarities;
    rarityScore: number;
    description: string;
};

export type GlobalType = "biome" | "wall" | "lineart" | "roomcount" | "glitch";

export type MapTile = {
    countPerMap?: number;
    countTotal?: number;
    description: string;
    name?: string;
    objectIdentifier?: string;
    rarityCounterRefIndex?: number;
    rarityScore?: number;
    rarityString?: string;
    type?: string;
    x?: number;
    y?: number;
};

export type SpecialRoom = {
    name: string;
    countPerMap: number;
    rarityString: Rarities;
    description: string;
};

export type Dweller = {
    name: Dwellers;
    description: string;
    rarityString: Rarities;
    countPerMap: number;
    countTotal: number;
    x: number;
    y: number;
};

export type Item = {
    type: ItemClasses;
    name: ItemTypes;
    description: string;
    rarityString: Rarities;
    countPerMap: number;
    countTotal: number;
    x: number;
    y: number;
};

export type Trap = {
    name: TrapTypes;
    description: string;
    rarityString: Rarities;
    countPerMap: number;
    countTotal: number;
    x: number;
    y: number;
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
    | "coinbag"
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
