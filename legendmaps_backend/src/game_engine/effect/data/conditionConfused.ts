import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";

export default class ConditionConfused extends ConditionData {
    constructor() {
        super();
        this.desc = "You are confused.";
        this.kind = GlobalConst.CONDITION.CONFUSED;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {}
}
