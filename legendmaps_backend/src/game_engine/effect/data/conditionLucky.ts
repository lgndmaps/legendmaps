import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import ConditionManager from "../conditionManager";
import Effect from "../effect";
import EffectUtil from "../effectUtil";
import Character from "../../character/character";

export default class ConditionLucky extends ConditionData {
    LUCK_BONUS: number = 20;

    constructor() {
        super();
        this.desc = "+" + this.LUCK_BONUS + " luck";
        this.kind = GlobalConst.CONDITION.LUCKY;
    }

    Apply(
        target: EntityLiving,
        sourceType: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
        turns: number = -1,
    ): Condition {
        let condition = super.Apply(target, sourceType, source_id, turns);

        let luckEffect: Effect = new Effect(target.game);
        luckEffect.amount_base = this.LUCK_BONUS;
        luckEffect.condition = this.kind;
        luckEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        luckEffect.type = GlobalConst.EFFECT_TYPES.LUCK;
        luckEffect.turns = -1;
        luckEffect.trigger = GlobalConst.EFFECT_TRIGGERS.NONE;
        luckEffect.Apply(target);

        return condition;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {}
}
