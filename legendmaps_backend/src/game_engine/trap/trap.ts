import Entity from "../base_classes/entity";
import Game from "../game";
import GlobalConst from "../types/globalConst";
import FlagUtil from "../utils/flagUtil";
import { TrapD } from "../types/globalTypes";
import TrapData from "./data/TrapData";
import ENTITY_FLAGS = GlobalConst.ENTITY_FLAGS;
import ObjectUtil from "../utils/objectUtil";
import StoryEventFactory from "../story/storyEventFactory";
import MapEntity from "../map/mapEntity";
import TrapFactory from "./trapFactory";
import StoryEvent from "../story/storyEvent";

export default class Trap extends Entity {
    $data: TrapData;

    constructor(game: Game, json: TrapD | "" = "", kind: GlobalConst.TRAP_TYPES | "" = "") {
        super(game, json);
        this.flags = FlagUtil.Set(this.flags, ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.Set(this.flags, ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.BLOCKS_VISION);
        this.flags = FlagUtil.Set(this.flags, ENTITY_FLAGS.IS_HIDDEN);
        this.cname = GlobalConst.ENTITY_CNAME.TRAP;

        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            this.$data = TrapFactory.instance.GetTrapData(this.kind as GlobalConst.TRAP_TYPES);
            if (json.mapEntity != undefined) {
                this.mapEntity = new MapEntity(this.game, json.mapEntity);
                this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "_";
            }
        } else {
            if (kind == "" || !ObjectUtil.enumContainsString(GlobalConst.TRAP_TYPES, kind)) {
                throw new Error("trying to construct trap with no valid key/kind " + kind);
            }
            this.kind = kind;
            this.$data = TrapFactory.instance.GetTrapData(this.kind as GlobalConst.TRAP_TYPES);

            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "_";
        }
    }

    Trigger(game: Game) {
        this.$data.Trigger(game, this);
    }

    RemoveMeAndSpawnStoryEventVersion(game: Game) {
        this.$ObjectCache = {};
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);

        //1 to 1 naming between trap names and story event keys, little clunky so maybe figure out better solution later.
        let se: StoryEvent = StoryEventFactory.instance.CreateStoryEvent(
            game,
            this.kind.toString() as GlobalConst.STORY_EVENT_KEYS,
        );
        se.Spawn(this.mapPos.x, this.mapPos.y);
    }
}
