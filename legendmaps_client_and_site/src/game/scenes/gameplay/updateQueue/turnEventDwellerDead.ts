import TurnEvent from "./turnEvent";
import { M_TurnEvent_DwellerKilled } from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";
import Dweller from "../entities/Dweller";
import EntityManager from "../entities/EntityManager";

export default class TurnEventDwellerDead extends TurnEvent {
    p: M_TurnEvent_DwellerKilled;
    dweller: Dweller;

    protected override parseEvent(): boolean {
        let p: M_TurnEvent_DwellerKilled = this.mTurnEventParam as M_TurnEvent_DwellerKilled;
        this.p = p;
        this.dweller = EntityManager.instance.GetDwellerByID(this.p.id);
        if (this.dweller == null) {
            console.log(
                "dweller not found -- may be off screen, need to handle offscreen dweller death sent to client",
            );
            this.dweller = EntityManager.instance.GetOrCreateDweller(this.p.id, this.p.kind, this.p.name);
        }
        this.updateMapAfter = true;

        return true;
    }

    override async process(blockMessagesAndRedraw:Boolean=false) {
        if (!blockMessagesAndRedraw) {
            this.gameScene.turnText.show(this.dweller.name + " is ded.", 0);
            this.updateMapAfter = true;
        } else {
            this.updateMapAfter = false;
        }
        this.dweller.isDead = true;
        this.gameScene.uiCombat.DoDie(this.dweller);
        await TimeUtil.sleep(250);
        EntityManager.instance.RemoveEntity(this.dweller);
    }
}
