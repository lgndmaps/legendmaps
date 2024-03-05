import {Model} from "sequelize";

export class PendingRewards extends Model {
    public userId?: number;
    public spendId: number;
    public spendAmount: number;
    public issueId: number;
    public issueAmount: number;
    public source: "Dungeon Victory" | "Adventurer Defeated" | "Adventurer Escaped";
    public sourceDetails: string;
    public userAddress: string;
    public claimed: boolean;
    //Add string for source details.

}
