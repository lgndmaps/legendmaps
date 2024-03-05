import type Game from "../game";
import GlobalConst from "../types/globalConst";
import MapEntity from "./mapEntity";
import { ItemD, MapPortalD } from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import ObjectUtil from "../utils/objectUtil";
import Entity from "../base_classes/entity";
import MapTile from "./mapTile";

//MapPortal type used for entrance and exit
export default class MapPortal extends Entity implements MapPortalD {
    isOpen: boolean = false;
    type: GlobalConst.SPECIAL_TILE_TYPE;

    constructor(game: Game, json: MapPortalD | "" = "") {
        super(game, json);

        this.cname = "MapPortal";

        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.BLOCKS_VISION);
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.ALWAYS_VIS_AFTER_REVEAL);
        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            if (json.mapEntity != undefined) {
                this.mapEntity = new MapEntity(this.game, json.mapEntity);
            } else {
                throw new Error("portals must have a map entity");
            }
        } else {
            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = this.ascii;
        }

        if (this.type == GlobalConst.SPECIAL_TILE_TYPE.EXIT) {
            this.game.data.map.exitTile = this;
        } else if (this.type == GlobalConst.SPECIAL_TILE_TYPE.ENTRANCE) {
            this.game.data.map.entranceTile = this;
        }
    }

    private triggerUpdate() {
        this.$ObjectCache = {};
        this.mapEntity.$ObjectCache = {};
    }

    public open() {
        this.isOpen = true;
        this.kind = "gateway";
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.BLOCKS_VISION);
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.mapEntity.ascii = this.ascii;
        this.triggerUpdate();
    }

    public close() {
        this.isOpen = false;
        this.kind = "gateway_closed";
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.BLOCKS_VISION);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.mapEntity.ascii = this.ascii;
        this.triggerUpdate();
    }

    public get ascii(): string {
        if (this.isOpen) {
            return "∩";
        } else {
            return "∩"; //⩀ - not in our file
        }
    }

    CreateAndSpawn(x: number, y: number, type: GlobalConst.SPECIAL_TILE_TYPE) {
        if (type != GlobalConst.SPECIAL_TILE_TYPE.EXIT && type != GlobalConst.SPECIAL_TILE_TYPE.ENTRANCE) {
            throw new Error("Portal must be entrance or exit");
        }

        this.type = type;
        this.kind = "gateway";
        this.mapEntity = new MapEntity(this.game);
        this.mapEntity.ascii = this.ascii;
        this.Spawn(x, y);
        let baseTile: MapTile = this.game.data.map.GetTileIfExists(x, y);
        if (baseTile == null) {
            baseTile = this.game.data.map.CreateMapTileAtPos(x, y);
        }

        baseTile.ascii = ".";
        baseTile.flags = FlagUtil.Set(baseTile.flags, GlobalConst.TILE_FLAGS.IS_WALKABLE);
        baseTile.flags = FlagUtil.UnSet(baseTile.flags, GlobalConst.TILE_FLAGS.BLOCKS_VISION);
    }
}
