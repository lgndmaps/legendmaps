import { Model } from "sequelize";
import { GameDataD } from "../game_engine/types/globalTypes";

export class GameSession extends Model {
    public id!: number;
    //@ts-ignore
    public sessionData!: GameDataD;
    public campaignId: number | null;
}
