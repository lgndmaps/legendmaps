import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import { M_TurnEvent_HPEffectTick, M_TurnEvent_Names } from "../../types/globalTypes";
import Effect from "../effect";
import EffectUtil from "../effectUtil";

export default class ConditionDisease extends ConditionData {
    TO_HIT_PENALTY: number = -30;
    DAMAGE_PENALTY_PERCENT: number = -30;

    constructor() {
        super();
        this.desc = "Reduces combat effectiveness";
        this.kind = GlobalConst.CONDITION.DISEASED;
    }

    Apply(
        target: EntityLiving,
        sourceType: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
        turns: number = -1,
    ): Condition {
        let condition = super.Apply(target, sourceType, source_id, turns);

        // To-hit penalty effect
        let eff1 = new Effect(target.game);
        eff1.amount_base = this.TO_HIT_PENALTY;
        eff1.condition = this.kind;
        eff1.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        eff1.type = GlobalConst.EFFECT_TYPES.TOHIT;
        eff1.trigger = GlobalConst.EFFECT_TRIGGERS.NONE;
        eff1.Apply(target);

        // damage % penalty effect
        let eff2 = new Effect(target.game);
        // eff2.amount_base = this.DAMAGE_PENALTY_PERCENT;
        eff2.bonus_dam_percent = this.DAMAGE_PENALTY_PERCENT;
        eff2.condition = this.kind;
        eff2.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        eff2.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
        eff2.trigger = GlobalConst.EFFECT_TRIGGERS.NONE;
        eff2.Apply(target);

        return condition;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {
        // TODO see if I can reduce the effect each turn
        // let eff1_reduction_rate: number = Math.floor(this.TO_HIT_PENALTY / condition.turns);
        // let eff2_reduction_rate: number = Math.floor(this.DAMAGE_PENALTY_PERCENT / condition.turns);
        // this.eff1.amount_base += eff1_reduction_rate;
        // this.eff2.bonus_dam_percent += eff2_reduction_rate;
    }
}
