import TurnEvent from "./turnEvent";
import { M_StoryEventOutcome, M_StoryEventReveal, M_TurnEvent_Msg } from "../../../types/globalTypes";

export default class TurnEventStoryKickoff extends TurnEvent {
    reveal: M_StoryEventReveal;

    protected override parseEvent(): boolean {
        let p: M_StoryEventReveal = this.mTurnEventParam as M_StoryEventReveal;
        this.reveal = p;
        return true;
    }

    override async process() {
        this.gameScene.ui.OpenStoryEvent(this.reveal);
    }
}
