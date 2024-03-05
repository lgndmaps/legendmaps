import { Model } from "sequelize";
import { PendingRewards } from "./index";
export class RewardRequests extends Model {
    public userId: number;
    public userAddress: string;
    public type?: "powerup" | "gold";
    public consumedRewards: PendingRewards[];
    public signature: string;
    public nonce: string;
}
