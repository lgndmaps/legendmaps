import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import ConditionManager from "../../../effect/conditionManager";
import StoryEvent from "../../storyEvent";
import StringUtil from "../../../utils/stringUtil";

export default class StoryEffectGiveCondition extends StoryEventEffect {
    duration: number;
    condition: GlobalConst.CONDITION;

    constructor(duration: number, condition: GlobalConst.CONDITION) {
        super();
        this.duration = duration;
        this.condition = condition;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        ConditionManager.instance.GiveCondition(
            game.dungeon.character,
            this.condition,
            GlobalConst.SOURCE_TYPE.TEMPORARY,
            -1,
            this.duration,
        );

        let eventDetails: M_StoryEventOutcome = {
            text: StringUtil.titleCase(this.condition) + " for " + this.duration + " turns",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
