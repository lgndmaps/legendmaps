import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import EffectUtil from "../effectUtil";
import { SourceD } from "../../types/globalTypes";
import Effect from "../effect";

export default class ConditionData {
    kind: GlobalConst.CONDITION;
    isHidden: boolean = false; //hidden conditions are not shown in client
    desc: string = "";

    constructor() {}

    //Aggressively Validates parameters on a condition to check for possible illegal combos
    Validate(condition: Condition, target: EntityLiving) {
        if (condition.turns > 0) {
            if (
                EffectUtil.FilterSourcesBySourceType(condition.sources, GlobalConst.SOURCE_TYPE.EQUIPMENT).length > 0 ||
                EffectUtil.FilterSourcesBySourceType(condition.sources, GlobalConst.SOURCE_TYPE.INNATE).length > 0
            ) {
                throw new Error(
                    "Condition " +
                        this.kind +
                        " on " +
                        target.name +
                        " had both a temp and innate/equip source, this should not be allowed",
                );
            }
        }

        let tempLength: number = EffectUtil.FilterSourcesBySourceType(
            condition.sources,
            GlobalConst.SOURCE_TYPE.TEMPORARY,
        ).length;
        if (tempLength > 1) {
            throw new Error("Condition " + this.kind + " on " + target.name + " has multiple temporary conditions");
        }

        if (tempLength == 1 && condition.turns <= -1) {
            throw new Error(
                "Condition " + this.kind + " on " + target.name + " has temporary condition with no turns value",
            );
        }
    }

    Apply(
        target: EntityLiving,
        sourceType: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
        turns: number = -1,
    ): Condition {
        // console.log("APPLYING " + sourceType + " " + this.kind + " FOR " + turns);
        if (target.conditions == undefined) {
            throw new Error("Can't apply condition " + target + " has no conditions array.");
        }
        if (sourceType != GlobalConst.SOURCE_TYPE.TEMPORARY && turns > -1) {
            throw new Error("Only temporary sources can have a turn count.");
        }
        if (sourceType == GlobalConst.SOURCE_TYPE.TEMPORARY && turns <= 0) {
            throw new Error("Temporary sources MUST have a turn count.");
        }
        if (sourceType == GlobalConst.SOURCE_TYPE.EQUIPMENT && source_id < 0) {
            throw new Error("EQUIPMENT sources MUST have a source_id.");
        }

        target.$conditionsChanged = true;
        let condition: Condition;

        // if target already has this condition, get the pre-existing condition instead of a new one
        for (let i = 0; i < target.conditions.length; i++) {
            if (target.conditions[i].kind == this.kind) {
                condition = target.conditions[i];
            }
        }

        // condition isn't currently on the target, so let's make a new one
        if (!condition) {
            condition = new Condition(target.game, "", this.kind);
            if (turns > 0) {
                condition.turns = turns;
            }
            condition.sources.push(EffectUtil.CreateSource(sourceType, source_id));
            target.conditions.push(condition);
            return condition;
        }
        //Make sure this condition doesn't have any data issues.
        this.Validate(condition, target);

        if (turns > 0 && condition.turns < 0) {
            //condition already has a fixed effect, ignore temps
            return condition;
        }
        // This is handled in ConditionManager.GiveCondition() now:
        //
        // if (turns > 0 && condition.turns >= 0) {
        //     condition.turns += turns;
        //     return condition; //trusting validate to have already confirmed we've only got 1 temp on this.
        // }
        //

        //clearing any temp effects since new condition is INNATE/EQUIP
        let newSources: SourceD[];
        for (let s: number; s < condition.sources.length; s++) {
            if (condition.sources[s].type != GlobalConst.SOURCE_TYPE.TEMPORARY) {
                newSources.push(condition.sources[s]);
            }
        }
        condition.turns = -1;

        //Note, possible to have multiple innate/equip condition sources here, allowing this because its potentially useful for messaging.
        condition.sources.push(EffectUtil.CreateSource(sourceType, source_id));

        return condition;
    }

    //Remove Source, source_id is only needed for equip types, deletes condition if no sources left
    RemoveSource(
        target: EntityLiving,
        condition: Condition,
        sourceType: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
    ) {
        if (sourceType == GlobalConst.SOURCE_TYPE.INNATE) {
            console.log("WARNING: removing an innate condition, sure you want to do this?");
        }

        let newconds: Condition[] = [];
        let newsources: SourceD[] = [];
        let targetcond: Condition;
        for (let c = 0; c < target.conditions.length; c++) {
            if (target.conditions[c].kind == condition.kind) {
                targetcond = target.conditions[c];
                for (let s = 0; s < targetcond.sources.length; s++) {
                    let keepsource: boolean = true;
                    if (sourceType == GlobalConst.SOURCE_TYPE.TEMPORARY && targetcond.sources[s].type == sourceType) {
                        keepsource = false;
                    }
                    if (sourceType == GlobalConst.SOURCE_TYPE.INNATE && targetcond.sources[s].type == sourceType) {
                        keepsource = false;
                    }
                    if (
                        sourceType == GlobalConst.SOURCE_TYPE.EQUIPMENT &&
                        targetcond.sources[s].type == sourceType &&
                        targetcond.sources[s].id == source_id
                    ) {
                        keepsource = false;
                    }
                    if (keepsource) {
                        newsources.push(targetcond.sources[s]);
                    }
                }
            } else {
                newconds.push(target.conditions[c]);
            }
        }
        if (newsources.length > 0) {
            targetcond.sources = newsources;
            newconds.push(targetcond);
        } else {
            //condition is getting removed entirely
            EffectUtil.RemoveEffectsBySource(target, GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        }
        target.$conditionsChanged = true;
        target.conditions = newconds;
    }

    TurnUpdate(target: EntityLiving, condition: Condition) {
        let conditionTurnsComplete: boolean = false;

        if (condition.turns > -1) {
            target.$conditionsChanged = true; //TODO: Change turns back to former system so we dont have to do this everytime.
            condition.turns--;
            if (condition.turns <= 0) {
                conditionTurnsComplete = true;
            }
        }

        this.ProcessTurnUpdate(target, condition);
        if (conditionTurnsComplete) {
            this.RemoveSource(target, condition, GlobalConst.SOURCE_TYPE.TEMPORARY);
        }
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {
        console.log(
            "PROCESS TURN UPDATE FOR CONDITION " + condition.kind + " on " + target.name + " NOT IMPLEMENTED YET",
        );
    }
}
