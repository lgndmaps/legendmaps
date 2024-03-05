import TurnEvent from "./turnEvent";
import { M_TurnEvent_PlayerMove } from "../../../types/globalTypes";
import { GameMapTile } from "../map/GameMapTile";

export default class TurnEventPlayerMove extends TurnEvent {
    p: M_TurnEvent_PlayerMove;
    static idcounter: number = 0;
    id: number;
    targetTile: GameMapTile;

    protected override parseEvent(): boolean {
        this.id = ++TurnEventPlayerMove.idcounter;
        this.p = this.mTurnEventParam as M_TurnEvent_PlayerMove;
        if (this.p == undefined) {
            throw new Error("NO PARAMS " + JSON.stringify(this.mTurnEventParam));
        }
        this.targetTile = this.gameScene.map.GetTile(this.p.x, this.p.y);
        if (this.targetTile == undefined) {
            throw new Error("NO TILE FOUND AT " + this.p.x + "," + this.p.y);
        }
        this.updateMapAfter = true;
        this.centerMapAfter = true;

        return true;
    }

    override async process() {
        if (this.targetTile == undefined) {
            throw new Error("!!!!!!!!!!!!!!!!!!!!!! NO TILE FOUND AT " + this.p.x + "," + this.p.y);
        }
        this.gameScene.player.MoveTo(this.targetTile);
        //await TimeUtil.sleep(100);
    }
}
