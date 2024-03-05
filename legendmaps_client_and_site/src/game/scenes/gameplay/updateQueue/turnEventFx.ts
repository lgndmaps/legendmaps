import TurnEvent from "./turnEvent";
import { M_TurnEvent_FX, M_TurnEvent_Msg } from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";
import FlagUtil from "../../../util/flagUtil";
import GlobalConst from "../../../types/globalConst";
import MagicPuff from "../effects/MagicPuff";
import EntityManager from "../entities/EntityManager";
import HealEffect from "../effects/HealEffect";

export default class TurnEventFx extends TurnEvent {
    params: M_TurnEvent_FX;
    msg: string = "";

    protected override parseEvent(): boolean {
        this.params = this.mTurnEventParam as M_TurnEvent_FX;
        this.msg = this.params.text;
        return true;
    }

    override async process() {
        if (this.forceAppendMsg) {
            this.params.mflags = FlagUtil.Set(this.params.mflags, GlobalConst.MESSAGE_FLAGS.APPEND);
        }
        this.params.mflags = FlagUtil.Set(this.params.mflags, GlobalConst.MESSAGE_FLAGS.DELAY_AFTER); //always delay after an fx
        if (this.params.fx == GlobalConst.CLIENTFX.ENTER_DUNGEON) {
            this.gameScene.cameras.main.shake(150);
            this.params.mflags = FlagUtil.UnSet(this.params.mflags, GlobalConst.MESSAGE_FLAGS.DELAY_AFTER);
        } else if (this.params.fx == GlobalConst.CLIENTFX.EXIT_OPEN) {
            this.gameScene.cameras.main.shake(150);
            this.params.mflags = FlagUtil.UnSet(this.params.mflags, GlobalConst.MESSAGE_FLAGS.DELAY_AFTER);
        } else if (this.params.fx == GlobalConst.CLIENTFX.TELEPORT) {
            let tile = this.gameScene.player.tile;
            let delay = 0;
            if (this.params.dwellers != undefined && this.params.dwellers.length > 0) {
                let dw = EntityManager.instance.GetDwellerByID(this.params.dwellers[0]);
                if (dw != undefined) {
                    tile = dw.tile;
                    delay = 500;
                }
            }
            new MagicPuff().Init(this.gameScene, tile, delay).Play();
        } else if (this.params.fx == GlobalConst.CLIENTFX.HEAL) {
            let tile = this.gameScene.player.tile;
            let delay = 0;
            if (this.params.dwellers != undefined && this.params.dwellers.length > 0) {
                let dw = EntityManager.instance.GetDwellerByID(this.params.dwellers[0]);

                if (dw != undefined) {
                    tile = dw.tile;
                    delay = 500;
                }

                this.gameScene.ui.dwellerPanel.adjustHP(this.params.dwellers[0], this.params.amount);
            } else {
                this.gameScene.ui.adventurerPortrait.updateHP(this.gameScene.player.hp + this.params.amount);
            }
            new HealEffect().Init(this.gameScene, tile, delay).Play();
        }
        await this.gameScene.turnText.show(this.msg, this.params.mflags);
    }
}
