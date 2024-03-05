import TurnEvent from "./turnEvent";
import { M_TurnEvent_DwellerMove } from "../../../types/globalTypes";
import Dweller from "../entities/Dweller";
import EntityManager from "../entities/EntityManager";
import { GameMapTile } from "../map/GameMapTile";

export default class TurnEventDwellerMove extends TurnEvent {
    p: M_TurnEvent_DwellerMove;
    targetTile: GameMapTile;
    dweller: Dweller;

    protected override parseEvent(): boolean {
        this.p = this.mTurnEventParam as M_TurnEvent_DwellerMove;

        if (this.p.x == -1 && this.p.y == -1) {
            //server is tell us to hide this dweller.
            this.targetTile = null;
            this.updateMapAfter = true;
            this.dweller = EntityManager.instance.GetOrCreateDweller(this.p.id, this.p.kind, this.p.name);
            return true;
        }

        this.targetTile = this.gameScene.map.GetTile(this.p.x, this.p.y);
        if (this.targetTile == undefined) {
            throw new Error("NO TILE FOUND AT " + this.p.x + "," + this.p.y);
        }
        this.updateMapAfter = true;

        this.dweller = EntityManager.instance.GetOrCreateDweller(this.p.id, this.p.kind, this.p.name);
        if (this.dweller == null) {
            throw new Error("Can't find or create updated dweller");
        }

        return true;
    }

    override async process() {
        if (this.targetTile == null) {
            this.dweller.RemoveFromTile();
        } else {
            this.dweller.CreateMoveGhost(this.gameScene);
            this.dweller.MoveTo(this.targetTile);
        }

        //await TimeUtil.sleep(100);
    }
}
