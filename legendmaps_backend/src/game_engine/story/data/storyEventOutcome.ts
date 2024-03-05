import StoryEventEffect from "./storyEventEffect";
import StoryEffectEndEvent from "./effects/seEndEvent";
import Game from "../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../types/globalTypes";
import StoryEvent from "../storyEvent";

export default class StoryEventOutcome {
    outcomeText: string;
    outcomeEffects: StoryEventEffect[] = [];

    constructor(text: string = "") {
        this.outcomeText = text;
    }

    AddStoryEffect(eff: StoryEventEffect) {
        this.outcomeEffects.push(eff);
    }

    AddEndEvent(destroyEvent: boolean = true) {
        this.outcomeEffects.push(new StoryEffectEndEvent(destroyEvent));
    }

    DoOutcome(game: Game, storyEvent: StoryEvent) {
        if (this.outcomeEffects == undefined || this.outcomeEffects.length == 0) {
            // throw new Error("Story event outcome has no effect!");
        }
        if (this.outcomeText != "") {
            let eventDetails: M_StoryEventOutcome = {
                text: this.outcomeText,
            };
            game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
        }

        for (let i = 0; i < this.outcomeEffects.length; i++) {
            this.outcomeEffects[i].Apply(game, storyEvent);
        }
    }
}
