import { Model } from "sequelize";
import { StatCampaign } from "../game_engine/types/globalTypes";

export class Campaign extends Model {
    public id!: number;
    public sessionId: number | null;
    public characterId: number | null;
    public activeStep: "level up" | "map select" | "gameplay" | "rewards" | "campaign end" | null;
    public runNumber: number;
    public campaignLength: number;
    public userId: number;
    public mapSeeds: number[];
    public createdAt: Date;
    public updatedAt: Date;
    public campaignRunStats: StatCampaign;
}
