import StoryEventOption from "../storyEventOption";
import StoryEventData from "../storyEventData";
import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import StoryEvent from "../../storyEvent";
import FlagUtil from "../../../utils/flagUtil";
import GlobalConst from "../../../types/globalConst";
import {
    EffectD,
    M_StoryEventOption,
    M_StoryEventOutcome,
    M_StoryEventReveal,
    M_TurnEvent_Names,
} from "../../../types/globalTypes";

export default class StoryEffectEndEvent extends StoryEventEffect {
    public destroyEvent: boolean = true; //Note if "can-reenter" is set, event will NOT be destroyed

    constructor(destroy: boolean = true) {
        super();
        this.destroyEvent = destroy;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let se: StoryEvent = game.$activeEvent as StoryEvent;
        if (this.destroyEvent && !se.$data.canReEnter) {

            game.data.stats.storyEventsCompleted++;

            let t = game.data.map.GetTileIfExists(game.$activeEvent.mapEntity.pos.x, game.$activeEvent.mapEntity.pos.y);

            //game.$activeEvent.mapEntity = null;
            game.$activeEvent.$ObjectCache = {};
            // game.$activeEvent.flags = FlagUtil.Set(game.$activeEvent.flags, GlobalConst.ENTITY_FLAGS.IS_HIDDEN);
            game.$activeEvent.flags = FlagUtil.Set(
                game.$activeEvent.flags,
                GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL,
            );
        }

        let eventDetails: M_StoryEventOutcome = {
            text: "",
            isFinal: true,
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);

        game.$activeEvent = null;
    }
}
