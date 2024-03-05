import { Model } from "sequelize";
import { StatCampaign } from "../game_engine/types/globalTypes";

export class RunRecord extends Model {
    public id!: number;
    public advId: number;
    public mapId: number;
    public died: boolean;
    public runNumber: number;
    public dwellersKilled: string[];
    public chestsOpened: number;
    public foodEaten: number;
    public goldLooted: number;
    public itemsLooted: number;
    public itemsPurchased: number;
    public potionsDrunk: number;
    public scrollsRead: number;
    public storyEventsCompleted: number;
    public trapsTriggered: number;
    public turns: number;
    public causeOfDeath: string;
}
