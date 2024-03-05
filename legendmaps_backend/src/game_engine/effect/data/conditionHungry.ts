import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import ConditionManager from "../conditionManager";
import Effect from "../effect";
import EffectUtil from "../effectUtil";

export default class ConditionHungry extends ConditionData {
    constructor() {
        super();
        this.desc = "-3 to Spirit & Brawn.";
        this.kind = GlobalConst.CONDITION.HUNGRY;
    }

    Apply(
        target: EntityLiving,
        sourceType: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
        turns: number = -1,
    ): Condition {
        //REMOVES STARVING WHEN APPLIED
        ConditionManager.instance.RemoveConditionSource(
            target,
            GlobalConst.CONDITION.STARVING,
            GlobalConst.SOURCE_TYPE.INNATE,
        );

        let condition = super.Apply(target, sourceType, source_id, turns);

        let spiritEffect: Effect = new Effect(target.game);
        spiritEffect.amount_base = -3;
        spiritEffect.condition = this.kind;
        spiritEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        spiritEffect.type = GlobalConst.EFFECT_TYPES.SPIRIT;
        spiritEffect.turns = -1;
        spiritEffect.trigger = GlobalConst.EFFECT_TRIGGERS.NONE;
        spiritEffect.Apply(target);

        let brawnEffect: Effect = new Effect(target.game);
        brawnEffect.amount_base = -3;
        brawnEffect.condition = this.kind;
        brawnEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        brawnEffect.type = GlobalConst.EFFECT_TYPES.BRAWN;
        brawnEffect.turns = -1;
        brawnEffect.trigger = GlobalConst.EFFECT_TRIGGERS.NONE;
        brawnEffect.Apply(target);

        return condition;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {
        //hungry
    }
}
