import { Model } from "sequelize";

export class AdventurerDescriptionVersions extends Model {
    public tokenId: number;
    public description!: Text;
    public version: number;
    public authorAddressOrEns: string;
    public createdAt: any;
}
