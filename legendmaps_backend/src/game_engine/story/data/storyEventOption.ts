import StoryEventData from "./storyEventData";
import StoryEvent from "../storyEvent";
import StoryEventCondition from "./storyEventCondition";
import StoryEventOutcome from "./storyEventOutcome";
import StoryEventEffect from "./storyEventEffect";
import Game from "../../game";

export default class StoryEventOption {
    parentEvent: StoryEventData;
    optionText: string = "";
    outcomeHint?: string;
    prereqs?: StoryEventCondition[]; //optional, if present must pass for event to appear.
    successConditions?: StoryEventCondition[]; //conditions to check for success
    outcomeSuccess?: StoryEventOutcome; //if outcome is not set, there MUST be an onSelect, so something happens.
    outcomeFail?: StoryEventOutcome;
    onSelect?: StoryEventEffect[]; //optional, effect to trigger when option is selected, before outcome called
    index: number = -1;

    constructor(parentEvent: StoryEventData) {
        this.parentEvent = parentEvent;
    }

    AddSuccessCondition(successCondition: StoryEventCondition) {
        if (this.successConditions == undefined) {
            this.successConditions = [];
        }
        this.successConditions.push(successCondition);
    }

    GetHint(game: Game, storyEvent: StoryEvent): string {
        if (this.successConditions == undefined || this.successConditions.length == 0) {
            return this.outcomeHint;
        } else {
            console.log("Doing Hint");
            let desc = "";
            if (this.outcomeHint != undefined && this.outcomeHint != "") {
                desc = this.outcomeHint;
            }
            const condText = this.successConditions[0].GetDescription(game, storyEvent);
            if (condText != undefined && condText != "") {
                desc += condText;
            }

            return desc;
        }
    }

    private CheckSuccess(game: Game): boolean {
        if (this.successConditions == undefined) {
            return true;
        }
        for (let i = 0; i < this.successConditions.length; i++) {
            if (!this.successConditions[i].Check(game)) {
                return false;
            }
        }
        return true;
    }

    DoOption(game: Game, storyEvent: StoryEvent) {
        this.DoSelectEffects(game, storyEvent);
        if (this.CheckSuccess(game)) {
            if (this.outcomeSuccess != undefined) {
                this.outcomeSuccess.DoOutcome(game, storyEvent);
            }
        } else {
            if (this.outcomeFail == undefined) {
                throw new Error("Event option not successful, no fail outcome provided.");
            }
            this.outcomeFail.DoOutcome(game, storyEvent);
        }
    }

    DoSelectEffects(game: Game, storyEvent: StoryEvent) {
        if (this.onSelect == undefined) return;
        for (let i = 0; i < this.onSelect.length; i++) {
            this.onSelect[i].Apply(game, storyEvent);
        }
    }
}
