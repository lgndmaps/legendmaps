import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import ConditionManager from "../../../effect/conditionManager";
import StoryEvent from "../../storyEvent";
import Effect from "../../../effect/effect";
import EffectUtil from "../../../effect/effectUtil";

export default class StoryEffectLuck extends StoryEventEffect {
    duration: number = 0;
    amount: number = 1;

    constructor(amount: number) {
        //PERMANANT!
        super();
        this.amount = amount;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        game.dungeon.character.ModifyBaseLuck(this.amount);

        let eventDetails: M_StoryEventOutcome = {
            text: "Luck changed by " + this.amount + ". ",
            //vfx: "placeholderheal",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
