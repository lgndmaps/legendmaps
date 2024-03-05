import TurnEvent from "./turnEvent";
import { M_TurnEvent_Msg } from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";
import FlagUtil from "../../../util/flagUtil";
import GlobalConst from "../../../types/globalConst";

export default class TurnEventMessage extends TurnEvent {
    msg: string = "";
    flags: number = 0;

    protected override parseEvent(): boolean {
        let p: M_TurnEvent_Msg = this.mTurnEventParam as M_TurnEvent_Msg;
        this.msg = p.text;
        this.flags = p.mflags;

        return true;
    }

    override async process() {
        if (this.forceAppendMsg) {
            this.flags = FlagUtil.Set(this.flags, GlobalConst.MESSAGE_FLAGS.APPEND);
        }
        await this.gameScene.turnText.show(this.msg, this.flags);
    }
}
