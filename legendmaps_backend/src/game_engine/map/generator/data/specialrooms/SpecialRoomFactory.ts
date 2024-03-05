import SpecialRoomData from "./SpecialRoomData";
import RatWarrenData from "./RatWarrenData";
import GlobalConst from "../../../../types/globalConst";
import FloodedChamberData from "./FloodedChamberData";
import SpiderWebData from "./SpiderWebData";
import TortureChamberData from "./TortureChamberData";
import TempleGawdsData from "./TempleGawdsData";
import AncientTombData from "./AncientTombData";
import GiantHiveData from "./GiantHiveData";
import KingVaultData from "./KingVaultData";
import CarrionLairData from "./CarrionLairData";
import CollectorTrapData from "./CollectorTrapData";
import LavaFloorData from "./LavaFloorData";
import WitchCovenData from "./WitchCovenData";
import EnchantForestData from "./EnchantForestData";
import SpiralMazeData from "./SpiralMazeData";

export default class SpecialRoomFactory {
    private static _instance: SpecialRoomFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public static GetSpecialRoom(name: string): SpecialRoomData {
        let kind: GlobalConst.SPECIAL_ROOM;
        if (name == "rat warren") {
            kind = GlobalConst.SPECIAL_ROOM.RAT_WARREN;
        } else if (name == "flooded chamber") {
            kind = GlobalConst.SPECIAL_ROOM.FLOODED_CHAMBER;
        } else if (name == "ancient tomb") {
            kind = GlobalConst.SPECIAL_ROOM.ANCIENT_TOMB;
        } else if (name == "giant hive") {
            kind = GlobalConst.SPECIAL_ROOM.GIANT_HIVE;
        } else if (name == "carrion lair") {
            kind = GlobalConst.SPECIAL_ROOM.CARRION_LAIR;
        } else if (name == "witch's coven") {
            kind = GlobalConst.SPECIAL_ROOM.WITCH_COVEN;
        } else if (name == "enchanted forest") {
            kind = GlobalConst.SPECIAL_ROOM.ENCHANTED_FOREST;
        } else if (name == "collector's trap") {
            kind = GlobalConst.SPECIAL_ROOM.COLLECTOR_TRAP;
        } else if (name == "temple of the gawds") {
            kind = GlobalConst.SPECIAL_ROOM.TEMPLE_GAWDS;
        } else if (name == "torture chamber") {
            kind = GlobalConst.SPECIAL_ROOM.TORTURE_CHAMBER;
        } else if (name == "spiral maze") {
            kind = GlobalConst.SPECIAL_ROOM.SPIRAL_MAZE;
        } else if (name == "king's vault") {
            kind = GlobalConst.SPECIAL_ROOM.KING_VAULT;
        } else if (name == "ye floor is lava") {
            kind = GlobalConst.SPECIAL_ROOM.LAVA_FLOOR;
        } else if (name == "the spider's web") {
            kind = GlobalConst.SPECIAL_ROOM.SPIDERS_WEB;
        }
        if (kind != undefined) {
            return SpecialRoomFactory.GetSpecialRoomByKind(kind);
        }
        throw new Error("unknown special room : " + name);
    }

    public static GetSpecialRoomByKind(kind: GlobalConst.SPECIAL_ROOM): SpecialRoomData {
        if (kind == GlobalConst.SPECIAL_ROOM.RAT_WARREN) {
            return new RatWarrenData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.FLOODED_CHAMBER) {
            return new FloodedChamberData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.SPIDERS_WEB) {
            return new SpiderWebData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.TORTURE_CHAMBER) {
            return new TortureChamberData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.TEMPLE_GAWDS) {
            return new TempleGawdsData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.ANCIENT_TOMB) {
            return new AncientTombData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.GIANT_HIVE) {
            return new GiantHiveData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.KING_VAULT) {
            return new KingVaultData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.CARRION_LAIR) {
            return new CarrionLairData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.COLLECTOR_TRAP) {
            return new CollectorTrapData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.LAVA_FLOOR) {
            return new LavaFloorData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.WITCH_COVEN) {
            return new WitchCovenData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.ENCHANTED_FOREST) {
            return new EnchantForestData();
        } else if (kind == GlobalConst.SPECIAL_ROOM.SPIRAL_MAZE) {
            return new SpiralMazeData();
        }
        throw new Error("unknown special room : " + name);
    }
}
