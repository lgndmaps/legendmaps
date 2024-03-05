import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import { M_TurnEvent_HPEffectTick, M_TurnEvent_Names } from "../../types/globalTypes";
import Dweller from "../../dweller/dweller";
import { DamageResult } from "../../types/types";

export default class ConditionBurning extends ConditionData {
    static PERCENT_DAMAGE: number = 0.04;

    constructor() {
        super();
        this.desc = ConditionBurning.PERCENT_DAMAGE * 100 + "% of max hp fire dam/turn";
        this.kind = GlobalConst.CONDITION.BURNING;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {
        let damage: number = Math.ceil(target.hpmax * ConditionBurning.PERCENT_DAMAGE);
        let damageResult: DamageResult = target.doDamage(
            damage,
            GlobalConst.DAMAGE_TYPES.FIRE,
            GlobalConst.DAMAGE_SOURCE.CONDITION,
            condition.kind,
        );
        let id: number = 0;
        let evtName: M_TurnEvent_Names = M_TurnEvent_Names.PLAYER_HP_EFFECT_TICK;
        if (target instanceof Dweller) {
            id = target.GetId();
            evtName = M_TurnEvent_Names.DWELLER_HP_EFFECT_TICK;
        }
        target.game.dungeon.AddTurnEvent(evtName, {
            targetId: id,
            hpChange: damageResult.final_damage,
            hp: target.hp,
            damType: GlobalConst.DAMAGE_TYPES.FIRE,
            flags: damageResult.flags,
        } as M_TurnEvent_HPEffectTick);
    }
}
