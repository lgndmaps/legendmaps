import TurnEvent from "./turnEvent";
import {M_MerchantReveal, M_StoryEventOutcome, M_StoryEventReveal, M_TurnEvent_Msg} from "../../../types/globalTypes";

export default class TurnEventMerchantStart extends TurnEvent {
    reveal: M_MerchantReveal;

    protected override parseEvent(): boolean {
        let p: M_MerchantReveal = this.mTurnEventParam as M_MerchantReveal;
        this.reveal = p;
        return true;
    }

    override async process() {
        this.gameScene.ui.OpenMerchant(this.reveal);
    }
}
