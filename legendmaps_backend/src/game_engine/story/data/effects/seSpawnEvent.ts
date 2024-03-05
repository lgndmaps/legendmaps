import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import {M_StoryEventOutcome, M_TurnEvent_Names} from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import Dweller from "../../../dweller/dweller";
import Spells from "../../../effect/spells";
import DwellerFactory from "../../../dweller/dwellerFactory";
import StoryEvent from "../../storyEvent";
import FlagUtil from "../../../utils/flagUtil";
import StoryEventFactory from "../../storyEventFactory";
import MapPos from "../../../utils/mapPos";

export default class StoryEffectSpawnEvent extends StoryEventEffect {
    event_type: GlobalConst.STORY_EVENT_KEYS;
    move_player_to_event: boolean = false;

    constructor(
        event_type?: GlobalConst.STORY_EVENT_KEYS,
        movePlayerToEvent?: boolean,
    ) {
        super();
        this.move_player_to_event = movePlayerToEvent;
        this.event_type = event_type;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {

        if (this.move_player_to_event) {
            game.dungeon.character.mapEntity.Move(new MapPos(storyEvent.mapPos.x, storyEvent.mapPos.y));
        }


        if (game.$activeEvent != undefined) {
            game.$activeEvent.$ObjectCache = {};
        }


        storyEvent.$ObjectCache = {};
        storyEvent.flags = FlagUtil.Set(storyEvent.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);
        game.$activeEvent = null;

        let eventDetails2: M_StoryEventOutcome = {
            text: "",
            isFinal: true,
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails2);

        //1 to 1 naming between trap names and story event keys, little clunky so maybe figure out better solution later.
        let se: StoryEvent = StoryEventFactory.instance.CreateStoryEvent(
            game,
            this.event_type.toString() as GlobalConst.STORY_EVENT_KEYS,
        );
        se.Spawn(storyEvent.mapPos.x, storyEvent.mapPos.y);
    }
}
