export const SEARCH_FIELDS = {
    TOKEN_ID: "tokenId",
    NAME: "name",
    TRAIT: "traits",
};

export const ORDER_BY_OPTIONS = {
    ART_RARITY: "art_rarity",
    BAGS_TOTAL: "bags_total",
    AGILITY: "agility",
    GUILE: "guile",
    SPIRIT: "spirit",
    BRAWN: "brawn",
    TOKEN_ID: "tokenId",
};

export type ADVENTURER_PROJECTS_TYPES = "LM" | "FRWC" | "CC" | "LOOT";

export const ADVENTURER_PROJECTS = {
    LEGEND_MAPS: "LM",
    FORGOTTEN_RUNES_WIZARDCULT: "FRWC",
    CRYPTO_COVEN: "CC",
    LOOT: "LOOT",
};

export const PROJECT_TOKEN_ID_OFFSETS = {
    [ADVENTURER_PROJECTS.LEGEND_MAPS]: 0,
    [ADVENTURER_PROJECTS.FORGOTTEN_RUNES_WIZARDCULT]: 100000,
    [ADVENTURER_PROJECTS.CRYPTO_COVEN]: 200000,
    [ADVENTURER_PROJECTS.LOOT]: 300000,
};

export const ARRAY_COLUMNS = [SEARCH_FIELDS.TRAIT];
