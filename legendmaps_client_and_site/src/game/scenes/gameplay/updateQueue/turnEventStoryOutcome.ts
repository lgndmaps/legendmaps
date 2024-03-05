import TurnEvent from "./turnEvent";
import { M_StoryEventOutcome, M_TurnEvent_Msg } from "../../../types/globalTypes";

export default class TurnEventStoryOutcome extends TurnEvent {
    outcome: M_StoryEventOutcome;

    protected override parseEvent(): boolean {
        let p: M_StoryEventOutcome = this.mTurnEventParam as M_StoryEventOutcome;
        this.outcome = p;
        return true;
    }

    override async process() {
        this.gameScene.ui.storyEventModal.ProcessStoryEventOutcome(this.outcome);
    }
}
