import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import ConditionManager from "../../../effect/conditionManager";
import StoryEvent from "../../storyEvent";

export default class StoryEffectPoison extends StoryEventEffect {
    duration: number;

    constructor(duration: number) {
        super();
        this.duration = duration;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        ConditionManager.instance.GiveCondition(
            game.dungeon.character,
            GlobalConst.CONDITION.POISONED,
            GlobalConst.SOURCE_TYPE.TEMPORARY,
            -1,
            this.duration,
        );

        let eventDetails: M_StoryEventOutcome = {
            text: "Poisoned for " + this.duration + " turns. ",
            vfx: "placeholderpoisoneffect",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
