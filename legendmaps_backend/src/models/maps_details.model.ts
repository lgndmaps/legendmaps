import { Model } from "sequelize";

export class LegendMapDetails extends Model {
    public tokenId: number;
    public details: string;
}
