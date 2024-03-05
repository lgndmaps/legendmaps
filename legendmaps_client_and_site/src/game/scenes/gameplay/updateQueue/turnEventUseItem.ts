import TurnEvent from "./turnEvent";
import InventoryItem from "../entities/InventoryItem";
import GlobalConst from "../../../types/globalConst";
import { M_TurnEvent_Names, M_TurnEvent_UseItem } from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";
import TurnEventMessage from "./turnEventMessage";

export default class TurnEventUseItem extends TurnEvent {
    useParams: M_TurnEvent_UseItem;
    childTurnEvents: TurnEvent[] = [];
    isClosed: boolean = false;

    protected override parseEvent(): boolean {
        let p: M_TurnEvent_UseItem = this.mTurnEventParam as M_TurnEvent_UseItem;
        this.useParams = p;
        return true;
    }

    public AddChildTurnEvent(te) {
        this.childTurnEvents.push(te);
    }

    public AddClose(evt: M_TurnEvent_UseItem) {
        this.useParams = evt;
        this.isClosed = true;
    }

    override async process() {
        this.gameScene.ui.charSheetStats.close();

        let item: InventoryItem = this.gameScene.player.GetInventoryItemById(this.useParams.itemId);
        let msg: string = "";
        if (this.useParams.desc != undefined && this.useParams.desc != "") {
            msg = this.useParams.desc;
        } else if (item != undefined) {
            msg = "Used " + item.name + ". ";
        } else {
            console.log("no item found of user id " + this.useParams.itemId);
        }

        await this.gameScene.turnText.showWithFlags(msg, [GlobalConst.MESSAGE_FLAGS.ELLIPSES]);

        for (let e = 0; e < this.childTurnEvents.length; e++) {
            let evt = this.childTurnEvents[e];
            evt.forceAppendMsg = true;
            await evt.process();
        }
        //  await TimeUtil.sleep(100);
    }
}
