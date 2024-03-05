import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import StoryEvent from "../../storyEvent";

export default class StoryEffectChangeMaxHP extends StoryEventEffect {
    amount: number = 0;

    constructor(amt: number) {
        super();
        this.amount = amt;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        game.dungeon.character.setHPMax(game.dungeon.character.hpmax + this.amount);

        let msgtext = this.amount > 0 ? "Gained " : "Lost ";
        msgtext += Math.abs(this.amount) + " max HP. ";

        let eventDetails: M_StoryEventOutcome = {
            text: msgtext,
            vfx: "placeholderheal",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
