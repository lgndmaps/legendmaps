import { Model } from "sequelize";

export class CampaignRecord extends Model {
    public id!: number;
    public advId: number | null;
    public died: boolean;
    public runNumber: number;
    public campaignLength: number;
    public userId: number;
    public campaignStats: string;
    public createdAt: Date;
    public updatedAt: Date;
}
