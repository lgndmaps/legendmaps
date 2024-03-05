import GlobalConst from "../types/globalConst";
import FlagUtil from "../utils/flagUtil";
import EnvironmentManager from "./EnvironmentManager";
import RandomUtil from "../utils/randomUtil";
import ArrayUtil from "../utils/arrayUtil";

export default class Environment {
    public name: string;
    public tileTypes: Array<EnvironmentManager.ENV_TILE_TYPES>;
    //TODO: Add gameplay bonus/impacts here.

    constructor(name) {
        this.name = name;
        this.tileTypes = new Array();
    }

    addType(
        desc: string,
        ascii: string,
        graphic: string,
        isWall: boolean,
        blocksVis: boolean,
        altgraphics: string[] | null = null,
    ) {
        let type: EnvironmentManager.ENV_TILE_TYPES = new EnvironmentManager.ENV_TILE_TYPES();
        type.ascii = ascii;
        type.description = desc;
        type.graphic = graphic;
        type.flags = 0;
        if (altgraphics != null) {
            type.altgraphics = altgraphics;
        }
        if (!isWall) {
            type.flags = FlagUtil.Set(type.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE);

            //console.log("TYPE " + type.flags + " walkable now");
        } else {
            type.flags = FlagUtil.UnSet(type.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE);
        }

        if (blocksVis) {
            type.flags = FlagUtil.Set(type.flags, GlobalConst.TILE_FLAGS.BLOCKS_VISION);
        } else {
            type.flags = FlagUtil.UnSet(type.flags, GlobalConst.TILE_FLAGS.BLOCKS_VISION);
        }

        this.tileTypes.push(type);
    }

    GetRandomTileType() {
        let r: number = RandomUtil.instance.int(1, 100);
        if (r < 60) {
            return this.GetTileType(".");
        }
        this.tileTypes = ArrayUtil.Shuffle(this.tileTypes);

        for (let i = 0; i < this.tileTypes.length; i++) {
            if (this.tileTypes[i].ascii != "~" && this.tileTypes[i].ascii != "#") {
                // console.log("found : " + ascii + " in " + this.name);
                return this.tileTypes[i];
            }
        }
    }

    GetTileType(ascii: string): EnvironmentManager.ENV_TILE_TYPES | null {
        for (let i = 0; i < this.tileTypes.length; i++) {
            if (this.tileTypes[i].ascii == ascii) {
                // console.log("found : " + ascii + " in " + this.name);
                return this.tileTypes[i];
            }
        }
        return null; //null is ok since we have to cross check wall and biome
    }
}
