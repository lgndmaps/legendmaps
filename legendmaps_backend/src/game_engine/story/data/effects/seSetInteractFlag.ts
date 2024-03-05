import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import {M_StoryEventOutcome, M_TurnEvent_Names} from "../../../types/globalTypes";
import StoryEvent from "../../storyEvent";
import GlobalConst from "../../../types/globalConst";
import FlagUtil from "../../../utils/flagUtil";

export default class StoryEffectSetInteractFlag extends StoryEventEffect {

    constructor() {
        super();

    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        storyEvent.flags = FlagUtil.Set(storyEvent.flags, GlobalConst.ENTITY_FLAGS.PLAYER_INTERACTED);
    }
}
