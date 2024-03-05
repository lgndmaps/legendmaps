import TurnEvent from "./turnEvent";
import { M_TurnEvent_PlayerEscape } from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";
import InputManager from "../InputManager";
import { websocketManager } from "../../../util/websockets";

export default class TurnEventPlayerEscape extends TurnEvent {
    p: M_TurnEvent_PlayerEscape;
    msg: string = "";
    protected override parseEvent(): boolean {
        this.p = this.mTurnEventParam as M_TurnEvent_PlayerEscape;
        this.msg = this.p.escapeMessage;
        return true;
    }

    override async process() {
        if (this.gameScene == undefined || this.gameScene.turnText == undefined) return;
        this.gameScene.turnText.show(this.msg, 0);
        await TimeUtil.sleep(250);
        this.gameScene.ui.confirmModal.Show(
            this.gameScene.ui,
            "You Escaped!",
            "You beat the boss and escaped the dungeon, click continue.",
            "Continue",
            this.goSummary.bind(this),
        );
    }

    goSummary() {
        console.log("go to summary");

        this.gameScene.input.removeAllListeners();
        this.gameScene.scale.removeAllListeners();
        InputManager.instance.clearActiveController();
        websocketManager.close();
        let gameStore = this.gameScene.store.gameStore;
        gameStore.completeRun();
    }
}
