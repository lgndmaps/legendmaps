import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";

export default class ConditionRegen extends ConditionData {
    REGEN_RATE: number = 3;
    REGEN_AMT: number = 3;
    turn_counter: number = 1;

    constructor() {
        super();
        this.desc = "Regain " + this.REGEN_AMT + " HP every " + this.REGEN_RATE + " turns";
        this.kind = GlobalConst.CONDITION.REGEN;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {
        if (this.turn_counter % this.REGEN_RATE == 0) {
            target.doHeal(this.REGEN_AMT);
        }
        this.turn_counter++;
    }
}
