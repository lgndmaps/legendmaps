import { Model } from "sequelize";
import { SiweMessage } from "../packages/siwe/client";

export class Session extends Model {
    sid: string;
    expires: Date;
    data: string;
}
