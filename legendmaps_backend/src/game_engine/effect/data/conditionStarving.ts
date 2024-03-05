import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import { M_TurnEvent_HPEffectTick, M_TurnEvent_Names } from "../../types/globalTypes";
import Dweller from "../../dweller/dweller";
import { DamageResult } from "../../types/types";
import ConditionManager from "../conditionManager";
import Effect from "../effect";
import EffectUtil from "../effectUtil";

export default class ConditionStarving extends ConditionData {
    constructor() {
        super();
        this.desc = "-6 to Spirit & Brawn. -1 hp/turn";
        this.kind = GlobalConst.CONDITION.STARVING;
    }

    Apply(
        target: EntityLiving,
        sourceType: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
        turns: number = -1,
    ): Condition {
        //REMOVES HUNGRY WHEN APPLIED
        ConditionManager.instance.RemoveConditionSource(
            target,
            GlobalConst.CONDITION.HUNGRY,
            GlobalConst.SOURCE_TYPE.INNATE,
        );

        let condition = super.Apply(target, sourceType, source_id, turns);

        let spiritEffect: Effect = new Effect(target.game);
        spiritEffect.amount_base = -6;
        spiritEffect.condition = this.kind;
        spiritEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        spiritEffect.type = GlobalConst.EFFECT_TYPES.SPIRIT;
        spiritEffect.turns = -1;
        spiritEffect.Apply(target);

        let brawnEffect: Effect = new Effect(target.game);
        brawnEffect.amount_base = -6;
        brawnEffect.condition = this.kind;
        brawnEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        brawnEffect.type = GlobalConst.EFFECT_TYPES.BRAWN;
        brawnEffect.turns = -1;
        brawnEffect.Apply(target);

        return condition;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {
        console.log("STARVING");
        if (target.hp > 1) {
            target.game.dungeon.AddMessageEvent("You're Starving! (-1 HP)");
            target.doDamage(1, GlobalConst.DAMAGE_TYPES.NECROTIC, GlobalConst.DAMAGE_SOURCE.CONDITION, condition.kind);
        } else {
            target.game.dungeon.AddMessageEvent("You're Starving!");
        }
    }
}
