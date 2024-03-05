import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import StoryEvent from "../../storyEvent";

export default class StoryEffectHeal extends StoryEventEffect {
    percentage: number = 100;

    constructor(pct?: number) {
        super();
        if (pct) this.percentage = pct;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let amount: number = Math.round(
            ((game.dungeon.character.hpmax - game.dungeon.character.hp) * this.percentage) / 100,
        );
        game.dungeon.character.doHeal(amount);
        let eventDetails: M_StoryEventOutcome = {
            text: "Healed " + amount + " hp",
            vfx: "placeholderheal",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
