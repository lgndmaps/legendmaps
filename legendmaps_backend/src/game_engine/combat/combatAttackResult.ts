import Effect from "../effect/effect";
import { ConditionD, M_TurnEvent_AttackResult } from "../types/globalTypes";
import CombatAttack from "./combatAttack";
import ObjectUtil from "../utils/objectUtil";
import Dweller from "../dweller/dweller";
import GlobalConst from "../types/globalConst";
import CONDITION = GlobalConst.CONDITION;
import CombatAttackStep from "./combatAttackStep";

export default class CombatAttackResult {
    flags: number = 0;
    unmodifiedDamage: number = 0;
    finalDamage: number = 0;
    effect?: Effect;
    condition?: CONDITION;
    conditionTurns?: number;
    parentStep: CombatAttackStep;
    $turnEvent: M_TurnEvent_AttackResult;

    constructor(parentAttack: CombatAttackStep, eff: Effect) {
        this.parentStep = parentAttack;
        this.effect = eff;
    }

    ApplyNonDamageEffects() {
        this.effect.Apply(this.parentStep.defender);
    }

    //Stores the turn event data with character update info.
    CreateResultTurnEvent(): M_TurnEvent_AttackResult {
        let evt: M_TurnEvent_AttackResult = {
            flags: 0,
        };
        ObjectUtil.copyAllCommonPrimitiveValues(this, evt);
        // console.log("FLAG CHECK: " + this.flags + " to " + evt.flags);
        evt.effect = this.effect;

        //TODO: Status Effect updates here!
        if (this.finalDamage > 0) {
            evt.targetUpdate = { hp: this.parentStep.defender.hp };
        }

        this.$turnEvent = evt;
        return evt;
    }
}
