import { Model } from "sequelize";

export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public nonce!: number;
    public publicAddress!: string;
    public username?: string; // for nullable fields
    public discordId?: string;
    public ens?: string;
    public role?: "admin" | "adv-owner" | "early-access" | "user" | "scribe" | "lore-keeper" | "blessed";
    public roles?: "admin" | "adv-owner" | "early-access" | "user" | "scribe" | "lore-keeper" | "blessed"[];
    public lastRefresh: Date;
}
