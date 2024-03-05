import { Model } from "sequelize";
import { ADVENTURER_PROJECTS_TYPES } from "../constants/adventurers";

export class Adventurer extends Model {
    public tokenId: number;
    public name: string;
    public first_name: string;
    public last_name: string;
    public image: string;
    public image_transparent: string;
    public image_card: string;
    public brawn: number;
    public agility: number;
    public guile: number;
    public spirit: number;
    public bags_total: number;
    public traits: string[];
    public art_background: string;
    public art_armor: string;
    public art_head: string;
    public art_weapon: string;
    public art_gear: string;
    public art_shield: string;
    public art_special: string;
    public art_rarity: number;
    public description_version: number;
    public nativeTokenId?: number;
    public project: ADVENTURER_PROJECTS_TYPES;
    public owner: string;
}
