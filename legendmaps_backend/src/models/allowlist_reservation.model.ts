import { Model } from "sequelize";

export class AllowlistReservation extends Model {
    public publicAddress!: string;
    public project!: string;
}
