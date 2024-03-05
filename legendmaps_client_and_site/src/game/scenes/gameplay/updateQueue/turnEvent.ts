import { M_TurnEvent, M_TurnEvent_Msg, M_TurnEvent_Names, M_TurnEvent_Param } from "../../../types/globalTypes";
import { GameScene } from "../GameScene";

/**
 * Wrapper class for all turn event types,
 * can be extended to do more complicated processing.
 *
 */
export default class TurnEvent {
    mEventName: M_TurnEvent_Names;
    mTurnEventParam: M_TurnEvent_Param;
    gameScene: GameScene;
    updateMapAfter: boolean = false;
    centerMapAfter: boolean = false;
    forceAppendMsg: boolean = false;

    constructor(gameScene: GameScene, eventName: M_TurnEvent_Names, eventParam: M_TurnEvent_Param) {
        this.gameScene = gameScene;
        this.mEventName = eventName;
        this.mTurnEventParam = eventParam;
    }

    initialize() {
        try {
            if (!this.parseEvent()) {
                throw new Error(
                    "Could not initialize turn event " + this.mEventName + " " + JSON.stringify(this.mTurnEventParam),
                );
            }
        } catch (e) {
            throw new Error(
                "Could not initialize turn event " + e + this.mEventName + " " + JSON.stringify(this.mTurnEventParam),
            );
        }
    }

    protected parseEvent(): boolean {
        throw new Error("Turn Event Class must be extended");
        return false;
    }

    async process() {
        throw new Error("Turn Event Class must be extended");
    }
}
