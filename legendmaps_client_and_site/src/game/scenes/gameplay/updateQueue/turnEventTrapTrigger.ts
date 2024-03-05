import TurnEvent from "./turnEvent";
import { M_TrapTrigger } from "../../../types/globalTypes";

export default class TurnEventTrapTrigger extends TurnEvent {
    reveal: M_TrapTrigger;

    protected override parseEvent(): boolean {
        let p: M_TrapTrigger = this.mTurnEventParam as M_TrapTrigger;
        this.reveal = p;
        return true;
    }

    override async process() {
        this.gameScene.ui.OpenGeneralModal(this.reveal.title, this.reveal.result, "evt_" + this.reveal.trap + ".png");
    }
}
