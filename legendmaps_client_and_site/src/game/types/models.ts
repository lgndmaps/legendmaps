import { IAdventurerD } from "../../types/adventurerTypes";
import { CharacterD, GameDataD, StatCampaign } from "./globalTypes";

export type SerializedCampaignResponse = {
    campaign: SerializedCampaignD;
    character: SerializedCharacterD;
    gameSession: SerializedGameSessionD;
    adventurer?: IAdventurerD;
};

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

export type SerializedCharacterD = {
    id: number;
    level: number;
    adventurerId: number;
    campaignId: number;
    userId: number;
    data: CharacterD & { skillOptionIds: number[] };
};

export type SerializedGameSessionD = {
    id: number;
    sessionData: GameDataD;
    campaignId: number;
};
