import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import { M_TurnEvent_HPEffectTick, M_TurnEvent_Names } from "../../types/globalTypes";
import Dweller from "../../dweller/dweller";
import { DamageResult } from "../../types/types";

export default class ConditionStun extends ConditionData {
    constructor() {
        super();
        this.desc = "Stunned, You can not act";
        this.kind = GlobalConst.CONDITION.STUNNED;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {}
}
