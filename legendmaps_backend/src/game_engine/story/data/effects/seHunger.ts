import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import StoryEvent from "../../storyEvent";
import GlobalConst from "../../../types/globalConst";

export default class StoryEffectHunger extends StoryEventEffect {
    amount: number = 100;

    constructor(amt?: number) {
        super();
        if (amt) this.amount = amt;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let msg = "";
        if (this.amount < 0) {
            msg = "You feel hungry.";
        } else {
            msg = "You feel full.";
        }
        console.log("CHANGING HUNGER BY " + this.amount);
        game.dungeon.character.ModifyHunger(this.amount);
        let eventDetails: M_StoryEventOutcome = {
            text: msg,
            vfx: "",
        };
        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
