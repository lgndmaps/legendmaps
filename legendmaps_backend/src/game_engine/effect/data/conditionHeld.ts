import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import { M_TurnEvent_HPEffectTick, M_TurnEvent_Names } from "../../types/globalTypes";
import Dweller from "../../dweller/dweller";
import { DamageResult } from "../../types/types";

export default class ConditionHeld extends ConditionData {
    constructor() {
        super();
        this.desc = "You can not move";
        this.kind = GlobalConst.CONDITION.HELD;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {}
}
