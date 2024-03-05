import GlobalConst from "../../../../types/globalConst";

export type TrapSpawn = {
    type: GlobalConst.TRAP_TYPES;
    spot?: number;
};

export type DwellerSpawn = {
    type: GlobalConst.DWELLER_KIND;
    spot?: number;
};

export type ItemSpawn = {
    type: GlobalConst.ITEM_BASE_TYPE;
    rarity?: GlobalConst.RARITY; //if rarity not set uses rarity of equivalent item in NFT data
    spot?: number;
};

export type StoryEventSpawn = {
    type: GlobalConst.STORY_EVENT_KEYS;
    spot?: number;
};
