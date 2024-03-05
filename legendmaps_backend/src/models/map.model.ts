import {Model} from "sequelize";
import {Biomes, Dwellers, GlitchTypes, ItemTypes, Materials, SpecialRooms, TrapTypes} from "../types/mapTypes";

export class LegendMap extends Model {
    public tokenId: number;
    public name: string;
    public image: string;
    public items: ItemTypes[];
    public wallMaterial: Materials;
    public biome: Biomes;
    public traps: TrapTypes[] | [];
    public lineart: string;
    public dweller: Dwellers[];
    public roomCount: number;
    public asciiMap: string[];
    public glitch: GlitchTypes | null;
    public challengeRating: number;
    public itemRarityRank: number;
    public enemyRarityRank: number;
    public featureRarityRank: number;
    public specialRoom: SpecialRooms | null;
    public owner: string;
}
