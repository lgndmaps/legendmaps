import GlobalConst from "../types/globalConst";
import ConditionData from "./data/conditionData";
import ConditionPoison from "./data/conditionPoison";
import EntityLiving from "../base_classes/entityLiving";
import Condition from "./condition";
import SOURCE_TYPE = GlobalConst.SOURCE_TYPE;
import ConditionHungry from "./data/conditionHungry";
import ConditionStarving from "./data/conditionStarving";
import ConditionHeld from "./data/conditionHeld";
import ConditionLowHP from "./data/conditionLowHP";
import ConditionLucky from "./data/conditionLucky";
import ConditionRegen from "./data/conditionRegen";
import ConditionDiseased from "./data/conditionDiseased";

import ConditionStun from "./data/conditionStun";
import ConditionInsight from "./data/conditionInsight";
import ConditionConfused from "./data/conditionConfused";
import ConditionBurning from "./data/conditionBurning";
import ConditionBleeding from "./data/conditionBleeding";
import ConditionHasted from "./data/conditionHasted";

export default class ConditionManager {
    private static _instance: ConditionManager;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }
    conditionData: Map<GlobalConst.CONDITION, ConditionData>;

    constructor() {
        this.conditionData = new Map();
        this.conditionData.set(GlobalConst.CONDITION.POISONED, new ConditionPoison());
        this.conditionData.set(GlobalConst.CONDITION.BLEEDING, new ConditionBleeding());
        this.conditionData.set(GlobalConst.CONDITION.BURNING, new ConditionBurning());
        this.conditionData.set(GlobalConst.CONDITION.HUNGRY, new ConditionHungry());
        this.conditionData.set(GlobalConst.CONDITION.STARVING, new ConditionStarving());
        this.conditionData.set(GlobalConst.CONDITION.HELD, new ConditionHeld());
        this.conditionData.set(GlobalConst.CONDITION.STUNNED, new ConditionStun());
        this.conditionData.set(GlobalConst.CONDITION.LOWHP, new ConditionLowHP());
        this.conditionData.set(GlobalConst.CONDITION.LUCKY, new ConditionLucky());
        this.conditionData.set(GlobalConst.CONDITION.REGEN, new ConditionRegen());
        this.conditionData.set(GlobalConst.CONDITION.DISEASED, new ConditionDiseased());
        this.conditionData.set(GlobalConst.CONDITION.INSIGHT, new ConditionInsight());
        this.conditionData.set(GlobalConst.CONDITION.CONFUSED, new ConditionConfused());
        this.conditionData.set(GlobalConst.CONDITION.HASTED, new ConditionHasted());
    }

    public GetConditionData(kind: GlobalConst.CONDITION): ConditionData {
        return this.conditionData.get(kind);
    }

    HasCondition(target: EntityLiving, cond: GlobalConst.CONDITION): boolean {
        for (let c = 0; c < target.conditions.length; c++) {
            if (target.conditions[c].kind == cond) {
                return true;
            }
        }
        return false;
    }

    HasConditionOfSourceType(
        target: EntityLiving,
        cond: GlobalConst.CONDITION,
        type: GlobalConst.SOURCE_TYPE,
    ): boolean {
        for (let c = 0; c < target.conditions.length; c++) {
            if (target.conditions[c].kind == cond) {
                for (let s = 0; s < target.conditions[c].sources.length; s++) {
                    if (target.conditions[c].sources[s].type == type) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    HasConditionInnate(target: EntityLiving, cond: GlobalConst.CONDITION) {
        // legacy method keeping for backwards compatibility
        return this.HasConditionOfSourceType(target, cond, GlobalConst.SOURCE_TYPE.INNATE);
    }

    AddDuration(target: EntityLiving, cond: GlobalConst.CONDITION, addedTurns: number): Condition {
        let updatedCondition: Condition;
        // get existing condition
        updatedCondition = target.GetConditionByKind(cond);
        // add new turns to existing cond
        if (updatedCondition) {
            console.log("adding " + addedTurns + " turns to condition " + cond);
            updatedCondition.turns += addedTurns;
        }
        return updatedCondition;
    }

    GiveCondition(
        target: EntityLiving,
        cond: GlobalConst.CONDITION,
        type: GlobalConst.SOURCE_TYPE,
        id: number = -1,
        turns: number = -1,
    ): Condition {
        if (this.HasConditionOfSourceType(target, cond, GlobalConst.SOURCE_TYPE.INNATE)) {
            //NOTE: If we already have INNATE condition, we do not apply again.
            return;
        } else if (this.HasConditionOfSourceType(target, cond, GlobalConst.SOURCE_TYPE.TEMPORARY)) {
            // if we have the condition but it's temporary
            // if this new one is also temp, just add turns
            if (turns > 0) this.AddDuration(target, cond, turns);
            return; // go no further
        }

        let condData = this.GetConditionData(cond);

        if (condData) {
            return condData.Apply(target, type, id, turns);
        } else {
            console.error("No condition data found for condition " + cond);
            throw new Error("No condition data found for condition " + cond);
        }
    }

    //Removes a condition of source type if present, for EQUIPMENT expects id, for others will remove ALL of type so use with care.
    RemoveConditionSource(
        target: EntityLiving,
        cond: GlobalConst.CONDITION,
        source: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
    ) {
        for (let c = 0; c < target.conditions.length; c++) {
            if (cond && target.conditions[c].kind == cond) {
                target.conditions[c].$data.RemoveSource(target, target.conditions[c], source, source_id);
            }
        }
    }

    RemoveAllConditionsBySource(target: EntityLiving, source: GlobalConst.SOURCE_TYPE, source_id: number = -1) {
        // Used to remove conditions added by equipping items, called on unequip
        // TODO combine with RemoveConditionSource() function, was easier just to add this for now
        for (let c = 0; c < target.conditions.length; c++) {
            target.conditions[c].$data.RemoveSource(target, target.conditions[c], source, source_id);
        }
    }
}
