import GlobalConst from "../types/globalConst";
import Environment from "./Environment";

class EnvironmentManager {
    private biomes: Array<Environment>;
    private walls: Array<Environment>;

    constructor() {
        this.biomes = new Array();
        this.walls = new Array();

        let biome: Environment = new Environment(GlobalConst.BIOME.MOUNTAIN);
        biome.addType("gravel", ".", "floor_stone", false, false);
        biome.addType("rocky path", "#", "path_dark", false, false);
        biome.addType("tree", "î", "pine_darkness", false, false);
        biome.addType("mountain peak", "^", "mountain_darkness", false, false);
        biome.addType("water", "~", "water", true, false);
        this.biomes.push(biome);

        biome = new Environment(GlobalConst.BIOME.FOREST);
        biome.addType("leafy soil", ".", "floor_dirt", false, false);
        biome.addType("dirt path", "#", "path_dirt", false, false);
        biome.addType("tree", "î", "pine", false, false);
        biome.addType("water", "~", "water", true, false);
        this.biomes.push(biome);

        biome = new Environment(GlobalConst.BIOME.GRASSLANDS);
        biome.addType("grass", ".", "floor_dirt", false, false);
        biome.addType("dirt path", "#", "path_dirt", false, false);
        biome.addType("tall grass", "„", "grass_green", false, false);
        biome.addType("water", "~", "water", true, false);
        this.biomes.push(biome);

        biome = new Environment(GlobalConst.BIOME.GRAVEYARD);
        biome.addType("muddy soil", ".", "floor_stone", false, false);
        biome.addType("dirt path", "#", "path_dirt", false, false);
        biome.addType("grave", "±", "grave_1", false, false, ["grave_2"]);
        biome.addType("dead grass", "„", "grass_dead", false, false);
        biome.addType("water", "~", "water", true, false);
        this.biomes.push(biome);

        biome = new Environment(GlobalConst.BIOME.HELL);
        biome.addType("burning soil", ".", "floor_hell", false, false);
        biome.addType("brimstone path", "#", "path_hell", false, false);
        biome.addType("burning peak", "^", "mountain_red", false, false);
        biome.addType("lava", "~", "lava", true, false);
        biome.addType("devil statue", "¥", "statue_hell", false, false);
        this.biomes.push(biome);

        biome = new Environment(GlobalConst.BIOME.DESERT);
        biome.addType("sand", ".", "floor_desert", false, false);
        biome.addType("sandstone path", "#", "path_dirt", false, false);
        biome.addType("sand dune", "≈", "hills_desert", false, false);
        biome.addType("water", "~", "water", true, false);
        this.biomes.push(biome);

        biome = new Environment(GlobalConst.BIOME.ICE);
        biome.addType("icy path", "#", "path_ice", false, false);
        biome.addType("frozen soil", ".", "floor_ice_1", false, false, ["floor_ice_2"]);
        biome.addType("icy peak", "^", "mountain_ice", false, false);
        biome.addType("water", "~", "water", true, false);
        this.biomes.push(biome);

        biome = new Environment(GlobalConst.BIOME.VOLCANO);
        biome.addType("rocky ground", ".", "floor_fire_1", false, false, ["floor_fire_2", "floor_fire_3"]);
        biome.addType("lava rock path", "#", "path_fire", false, false);
        biome.addType("volcanic peak", "^", "mountain_volcano", false, false);
        biome.addType("lava", "~", "lava", true, false);
        this.biomes.push(biome);

        let wall: Environment = new Environment(GlobalConst.WALL.STONE);
        wall.addType("gate", "∩", "gateway", false, false);
        wall.addType("nw", "┌", "wall_nw_stone", true, true);
        wall.addType("ne", "┐", "wall_ne_stone", true, true);
        wall.addType("sw", "└", "wall_sw_stone", true, true);
        wall.addType("se", "┘", "wall_se_stone", true, true);
        wall.addType("v", "│", "wall_v_stone", true, true);
        wall.addType("h", "─", "wall_h_stone", true, true);
        this.walls.push(wall);

        wall = new Environment(GlobalConst.WALL.RUIN);
        wall.addType("gate", "∩", "gateway", false, false);
        wall.addType("nw", "┌", "wall_nw_ruin", true, true);
        wall.addType("ne", "┐", "wall_ne_ruin", true, true);
        wall.addType("sw", "└", "wall_sw_ruin", true, true);
        wall.addType("se", "┘", "wall_se_ruin", true, true);
        wall.addType("v", "│", "wall_v_ruin", true, true);
        wall.addType("h", "─", "wall_h_ruin", true, true);
        this.walls.push(wall);

        wall = new Environment(GlobalConst.WALL.TEMPLE);
        wall.addType("gate", "∩", "gateway", false, false);
        wall.addType("nw", "┌", "wall_nw_temple", true, true);
        wall.addType("ne", "┐", "wall_ne_temple", true, true);
        wall.addType("sw", "└", "wall_sw_temple", true, true);
        wall.addType("se", "┘", "wall_se_temple", true, true);
        wall.addType("v", "│", "wall_v_temple", true, true);
        wall.addType("h", "─", "wall_h_temple", true, true);
        this.walls.push(wall);

        wall = new Environment(GlobalConst.WALL.DESERT);
        wall.addType("gate", "∩", "gateway", false, false);
        wall.addType("nw", "┌", "wall_nw_desert", true, true);
        wall.addType("ne", "┐", "wall_ne_desert", true, true);
        wall.addType("sw", "└", "wall_sw_desert", true, true);
        wall.addType("se", "┘", "wall_se_desert", true, true);
        wall.addType("v", "│", "wall_v_desert_1", true, true);
        wall.addType("v cols", ":", "wall_v_desert_2", true, true);
        wall.addType("h", "─", "wall_h_desert_1", true, true);
        this.walls.push(wall);

        wall = new Environment(GlobalConst.WALL.HELL);
        wall.addType("gate", "∩", "gateway", false, false);
        wall.addType("nw", "┌", "wall_nw_hell", true, true);
        wall.addType("ne", "┐", "wall_ne_hell", true, true);
        wall.addType("sw", "└", "wall_sw_hell", true, true);
        wall.addType("se", "┘", "wall_se_hell", true, true);
        wall.addType("v", "│", "wall_v_hell", true, true);
        wall.addType("v cols", "…", "wall_h_hell_2", true, true);
        wall.addType("h", "─", "wall_h_hell_1", true, true);
        this.walls.push(wall);

        wall = new Environment(GlobalConst.WALL.ICE);
        wall.addType("gate", "∩", "gateway", false, false);
        wall.addType("nw", "┌", "wall_nw_ice", true, true);
        wall.addType("ne", "┐", "wall_ne_ice", true, true);
        wall.addType("sw", "└", "wall_sw_ice", true, true);
        wall.addType("se", "┘", "wall_se_ice", true, true);
        wall.addType("v", "│", "wall_v_ice_1", true, true);
        wall.addType("v edge", "<", "wall_v_ice_2", true, true);
        wall.addType("h", "─", "wall_h_ice", true, true);
        this.walls.push(wall);

        wall = new Environment(GlobalConst.WALL.VOLCANO);
        wall.addType("gate", "∩", "gateway", false, false);
        wall.addType("nw", "┌", "wall_nw_volcano", true, true);
        wall.addType("ne", "┐", "wall_ne_volcano", true, true);
        wall.addType("sw", "└", "wall_sw_volcano", true, true);
        wall.addType("se", "┘", "wall_se_volcano", true, true);
        wall.addType("v", "│", "wall_v_volcano_1", true, true);
        wall.addType("v edge", "<", "wall_v_volcano_2", true, true);
        wall.addType("h", "─", "wall_h_volcano", true, true);
        wall.addType("lava", "~", "lava", true, true);
        this.walls.push(wall);
    }

    public GetBiome(biomeName: string): Environment {
        for (let i = 0; i < this.biomes.length; i++) {
            if (this.biomes[i].name == biomeName) {
                return this.biomes[i];
            }
        }
        throw new Error("Biome not found: " + biomeName);
    }

    public GetWall(wallName: string): Environment {
        for (let i = 0; i < this.walls.length; i++) {
            if (this.walls[i].name == wallName) {
                return this.walls[i];
            }
        }
        throw new Error("Wall not found: " + wallName);
    }
}

namespace EnvironmentManager {
    export class ENV_TILE_TYPES {
        public description: string;
        public ascii: string;
        public graphic: string;
        public flags: number = 0;
        public altgraphics: string[] = [];
    }
}

export default EnvironmentManager;
