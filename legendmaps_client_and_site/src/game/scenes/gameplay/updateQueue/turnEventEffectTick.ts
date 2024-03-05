import TurnEvent from "./turnEvent";
import { M_TurnEvent_HPEffectTick, M_TurnEvent_Names } from "../../../types/globalTypes";
import EffectManager from "../EffectManager";
import TimeUtil from "../../../util/timeUtil";
import { PlayerCharacter } from "../entities/PlayerCharacter";
import Dweller from "../entities/Dweller";
import EntityManager from "../entities/EntityManager";

export default class TurnEventEffectTick extends TurnEvent {
    p: M_TurnEvent_HPEffectTick;
    target: PlayerCharacter | Dweller;

    protected override parseEvent(): boolean {
        let p: M_TurnEvent_HPEffectTick = this.mTurnEventParam as M_TurnEvent_HPEffectTick;
        this.p = p;
        if (this.mEventName == M_TurnEvent_Names.PLAYER_HP_EFFECT_TICK) {
            this.target = this.gameScene.player;
        } else if (this.mEventName == M_TurnEvent_Names.DWELLER_HP_EFFECT_TICK) {
            let dweller: Dweller = EntityManager.instance.GetDwellerByID(p.targetId);
            if (dweller == null) {
                throw new Error("dweller not found");
            }
            this.target = dweller;
        } else {
            throw new Error("illegal event name");
        }
        return true;
    }

    override async process() {
        EffectManager.instance.ShowTickEffect(this.target, this.p.hpChange, this.p.hp, this.p.damType, this.p.flags);
        await TimeUtil.sleep(100);
    }
}
