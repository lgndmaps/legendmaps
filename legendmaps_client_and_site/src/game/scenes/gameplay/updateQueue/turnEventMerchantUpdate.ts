import TurnEvent from "./turnEvent";
import {
    M_MerchantResponse,
    M_MerchantReveal,
    M_StoryEventOutcome,
    M_StoryEventReveal,
    M_TurnEvent_Msg
} from "../../../types/globalTypes";

export default class TurnEventMerchantUpdate extends TurnEvent {
    upd: M_MerchantResponse;

    protected override parseEvent(): boolean {
        let p: M_MerchantResponse = this.mTurnEventParam as M_MerchantResponse;
        this.upd = p;
        return true;
    }

    override async process() {
        this.gameScene.ui.merchantModal.updateReceived(this.upd);
    }
}
