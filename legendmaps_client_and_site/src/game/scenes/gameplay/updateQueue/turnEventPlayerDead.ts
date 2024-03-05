import TurnEvent from "./turnEvent";
import { M_TurnEvent_PlayerDead } from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";

export default class TurnEventPlayerDead extends TurnEvent {
    p: M_TurnEvent_PlayerDead;
    msg: string = "";
    protected override parseEvent(): boolean {
        this.p = this.mTurnEventParam as M_TurnEvent_PlayerDead;
        this.msg = this.p.deathMessage;
        return true;
    }

    override async process(noText: Boolean = false) {
        if (this.gameScene == undefined || this.gameScene.turnText == undefined) return;
        if (!noText) {
            this.gameScene.turnText.show(this.msg, 0);
        }
        await TimeUtil.sleep(600);
        this.gameScene.ui.ShowDeathScreen(this.msg);
    }
}
