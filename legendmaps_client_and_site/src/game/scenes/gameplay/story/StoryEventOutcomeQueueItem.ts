import { M_StoryEventOutcome, M_StoryEventReveal } from "../../../types/globalTypes";

export default class StoryEventOutcomeQueueItem {
    outcome: M_StoryEventOutcome;
    message: string;

    constructor(params: M_StoryEventOutcome, message: string = "") {
        this.outcome = params;
        this.message = message;
    }

    GetText(): string {
        if (
            (this.message == undefined || this.message == "") &&
            (this.outcome.text == undefined || this.outcome.text == "")
        ) {
            return "";
        }
        return this.message + " " + this.outcome.text;
    }
}
