import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";

export default class ConditionInsight extends ConditionData {
    constructor() {
        super();
        this.desc = "See detailed info about dwellers";
        this.kind = GlobalConst.CONDITION.INSIGHT;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {}
}
