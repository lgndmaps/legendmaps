import GlobalConst from "./globalConst";
import {Campaign, Character} from "../../models";
import {CharacterD, StatCampaign} from "./globalTypes";

/* #region Combat */

export type DamageResult = {
    base_damage: number;
    final_damage: number;
    damage_type: GlobalConst.DAMAGE_TYPES;
    flags: number; //GlobalConst.ATTACK_FLAGS
};

/* #endregion */

/* #region Server Response */
export type GameServerResponse = {
    message: string;
    error?: {
        type: GameServerErrors;
        message?: string;
    };
    gameData?: any; //TODO: fix the any here
};

export type GameServerErrors = "campaign not found" | "session not found" | "game null";
/* #endregion */

/* #region Campaign */
export type SerializedCampaignD = {
    id: number;
    sessionId: number | null;
    runNumber: number;
    campaignLength: number;
    userId: number;
    mapSeeds: number[];
    createdAt: Date;
    updatedAt: Date;
    campaignRunStats: StatCampaign;
    activeStep: "level up" | "map select" | "gameplay" | "rewards" | "campaign end" | null;
};

export type CampaignUpdateData = {
    sessionId?: number | null;
    runNumber?: number;
    mapSeeds?: number[];
};

export type SerializedGameSessionD = {
    id: number;
    sessionData: string;
    campaignId: number;
};

export type SerializedCharacterD = {
    id: number;
    level: number;
    adventurerId: number;
    campaignId: number;
    userId: number;
    data: CharacterDataType;
};

export type CharacterDataType = CharacterD & { skillOptionIds: number[] };

export type CampaignStartResponse = {
    campaign?: Campaign;
    character?: Character;
    error?: {
        type: ErrorTypes;
    };
};

export type ErrorTypes = "already exists" | "invalid adventurer" | "invalid ownership";
/* #endregion */

/* #region ItemGen */
export type WeaponsList = {
    [key in GlobalConst.WEAPON_BASE_TYPE]: String[];
};

export type ArmorList = {
    [key in GlobalConst.ARMOR_BASE_TYPE]: String[];
};

export type EnhancementChanceTable = {
    [key in GlobalConst.RARITY]: number[];
};

export type EnhancementD = {
    pre?: string;
    basename?: string;
    id: GlobalConst.ITEM_ENHANCEMENTS;
    post?: string;
    type?: GlobalConst.EFFECT_TYPES;
    trigger?: GlobalConst.EFFECT_TRIGGERS; // assumed to be equip if not specified
    base_amount?: number[];
    max_amount?: number[];
    item_type?: GlobalConst.ITEM_BASE_TYPE; // if unspecified, assume all types
    dam_type?: GlobalConst.DAMAGE_TYPES;
    bonus_dam_percent?: number[];
    bonus_dam_dweller_type?: GlobalConst.DWELLER_PHYLUM;
    chance?: number[];
    cooldown?: number[];
    turns?: number[];
    min_cr?: number;
    min_rarity?: number;
    range?: number;
    aoe?: number;
    condition?: GlobalConst.CONDITION;
    spell?: GlobalConst.SPELLS;
    itemFlags?: number;
};

/* #endregion */

export type PendingRewardD = {
    userId?: number;
    spendId: number;
    spendAmount: number;
    issueId: number;
    issueAmount: number;
    source: "Dungeon Victory" | "Adventurer Defeated" | "Adventurer Escaped";
    sourceDetails: string;
    userAddress: string;
    signature?: string;
    nonce?: string;
    claimed?: boolean;
    // runRecordId?: number;
};
