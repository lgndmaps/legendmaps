import StoryEventOption from "../storyEventOption";
import StoryEventData from "../storyEventData";
import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import StoryEvent from "../../storyEvent";
import Effect from "../../../effect/effect";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import EffectUtil from "../../../effect/effectUtil";
import NumberRange from "../../../utils/numberRange";
import MapPos from "../../../utils/mapPos";

export default class StoryEffectPositionOnEvent extends StoryEventEffect {
    constructor() {
        super();
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        game.dungeon.character.mapEntity.Move(new MapPos(storyEvent.mapPos.x, storyEvent.mapPos.y));
        game.dungeon.PickupItemsInTile(storyEvent.mapPos.x, storyEvent.mapPos.y);
        let eventDetails: M_StoryEventOutcome = {
            text: "",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
