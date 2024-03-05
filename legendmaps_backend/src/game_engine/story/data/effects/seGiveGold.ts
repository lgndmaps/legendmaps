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

export default class StoryEffectGiveGold extends StoryEventEffect {
    amountRange: NumberRange;

    constructor(min: number, max: number) {
        super();
        this.amountRange = new NumberRange(min, max);
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let amount: number = this.amountRange.roll();
        game.dungeon.character.gold += amount;
        let eventDetails: M_StoryEventOutcome = {
            text: "Gained " + amount + " gold!",
            vfx: "placeholdergoldgain",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
