import { Model } from "sequelize";
import { ADVENTURER_PROJECTS_TYPES } from "../constants/adventurers";
import { CharacterD, CharacterDExtended, SkillD } from "../game_engine/types/globalTypes";

export class Character extends Model {
    public id!: number;
    public level: number;
    public adventurerId: number;
    public nativeTokenId?: number;
    public project: ADVENTURER_PROJECTS_TYPES;
    public userId: number;
    public campaignId: number;
    public data: CharacterDExtended & { skillOptionIds: number[]; powerupId: number | null };
}
