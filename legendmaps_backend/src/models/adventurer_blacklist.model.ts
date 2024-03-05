import { Model } from "sequelize";

export class AdventurerBlacklist extends Model {
    public tokenId!: number;
    public walletAddress!: string;
}
