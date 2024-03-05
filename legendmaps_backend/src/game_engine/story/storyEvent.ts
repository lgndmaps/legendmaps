import Entity from "../base_classes/entity";
import Game from "../game";
import GlobalConst from "../types/globalConst";
import FlagUtil from "../utils/flagUtil";
import ObjectUtil from "../utils/objectUtil";
import MapEntity from "../map/mapEntity";
import StoryEventData from "./data/storyEventData";
import {
    M_StoryEventOption,
    M_StoryEventReveal,
    M_TurnEvent,
    M_TurnEvent_Names,
    StoryEventD,
} from "../types/globalTypes";
import StoryEventFactory from "./storyEventFactory";
import ENTITY_FLAGS = GlobalConst.ENTITY_FLAGS;

export default class StoryEvent extends Entity {
    $data: StoryEventData; //reference to dweller file in data/ with all dweller powers and stats, this must be reloaded on restore
    //hidden state set with ENTITY_FLAGS.isHidden
    hasTriggered: boolean = false; //tracks if player has interacted with this event event

    constructor(game: Game, json: StoryEventD | "" = "", kind: GlobalConst.STORY_EVENT_KEYS | "" = "") {
        super(game, json);
        this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.BLOCKS_VISION);

        this.cname = GlobalConst.ENTITY_CNAME.STORYEVENT;

        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            this.$data = StoryEventFactory.instance.GetStoryEventData(this.kind as GlobalConst.STORY_EVENT_KEYS);
            if (json.mapEntity != undefined) {
                this.mapEntity = new MapEntity(this.game, json.mapEntity);

                //manual handling for secret door ascii
                if (
                    this.kind == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_H ||
                    this.kind == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V
                ) {
                    this.mapEntity.ascii = "-";
                } else {
                    this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "_";
                }
            }
        } else {
            if (kind == "" || !ObjectUtil.enumContainsString(GlobalConst.STORY_EVENT_KEYS, kind)) {
                throw new Error("trying to construct story event with no valid key/kind " + kind);
            }
            this.kind = kind;
            this.$data = StoryEventFactory.instance.GetStoryEventData(this.kind as GlobalConst.STORY_EVENT_KEYS);

            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "_";
        }

        if (
            this.$data.category == GlobalConst.STORY_EVENT_CATEGORY.DOOR &&
            kind != GlobalConst.STORY_EVENT_KEYS.DOOR_UNLOCKED
        ) {
            this.flags = FlagUtil.Set(this.flags, ENTITY_FLAGS.BLOCKS_VISION);
        }

        // // Apply any onTrigger story event effects - TODO this isn't verified to work
        // if (this.$data.onTrigger) {
        //     for (let i = 0; i < this.$data.onTrigger.length; i++) {
        //         this.$data.onTrigger[i].Apply(this.game, this);
        //         console.log("applying ontrigger effects");
        //     }
        // }
    }

    StartEvent() {
        if (this.game.$activeEvent != null) {
            throw new Error("Attempt to start a story event when a story event already exists.");
        }
        this.game.$activeEvent = this;

        let eventOptions: M_StoryEventOption[] = [];

        for (let i = 0; i < this.$data.options.length; i++) {
            eventOptions.push({
                idx: this.$data.options[i].index,
                text: this.$data.options[i].optionText,
                hint: this.$data.options[i].GetHint(this.game, this),
            });
        }

        let eventDetails: M_StoryEventReveal = {
            title: this.$data.titleCopy,
            body: this.$data.bodyCopy,
            key: this.$data.kind,
            options: eventOptions,
        };

        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_KICKOFF, eventDetails);
    }

    SelectOption(idx: number) {
        if (idx == undefined || idx < 0 || idx >= this.$data.options.length) {
            throw new Error("index " + idx + " is outside range of story event options");
        }
        this.$data.options[idx].DoOption(this.game, this);
    }

    Spawn(x: number, y: number) {
        super.Spawn(x, y);
        //manual fix for  secret doors
        if (
            this.kind == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V ||
            this.kind == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_H
        ) {
            let w = this.game.data.map.GetTileIfExists(x - 1, y);
            let e = this.game.data.map.GetTileIfExists(x + 1, y);
            let n = this.game.data.map.GetTileIfExists(x, y + 1);
            let s = this.game.data.map.GetTileIfExists(x, y - 1);

            if (
                (w != null && w.kind == GlobalConst.WALL_TYPES.H) ||
                (e != null && e.kind == GlobalConst.WALL_TYPES.H)
            ) {
                this.kind = GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_H;
                this.mapEntity.ascii = "─";
            } else {
                this.kind = GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V;
                this.mapEntity.ascii = "│";
            }
        }

        if (this.$data.dwellerWalkable) {
            this.flags = FlagUtil.Set(this.flags, ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        } else {
            this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        }

        if (this.$data.blocksVision) {
            this.flags = FlagUtil.Set(this.flags, ENTITY_FLAGS.BLOCKS_VISION);
        } else {
            this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.BLOCKS_VISION);
        }
    }

    GetMapGraphic(): string {
        if (this.kind == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V) {
            return "door_secret_v";
        } else if (this.kind == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_H) {
            return "door_secret_h";
        }
        return this.$data.mapGraphic;
    }
}
