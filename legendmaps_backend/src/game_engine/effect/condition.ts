import SerializableGameObject from "../base_classes/serializableGameObject";
import { ConditionD, EffectD, SourceD, StoryEventD } from "../types/globalTypes";
import EntityLiving from "../base_classes/entityLiving";
import Effect from "./effect";
import GlobalConst from "../types/globalConst";
import CONDITION = GlobalConst.CONDITION;
import ConditionData from "./data/conditionData";
import Game from "../game";
import FlagUtil from "../utils/flagUtil";
import ObjectUtil from "../utils/objectUtil";
import ConditionManager from "./conditionManager";
import EffectUtil from "./effectUtil";

export default class Condition extends SerializableGameObject implements ConditionD {
    //NOTE: global .kind holds CONDITION type
    turns?: number;
    sources: SourceD[] = [];
    $data: ConditionData;

    constructor(game: Game, json: ConditionD | "" = "", kind: GlobalConst.CONDITION | "" = "") {
        super(game, json);
        this.cname = GlobalConst.ENTITY_CNAME.CONDITION;
        this.sources = [];

        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            this.$data = ConditionManager.instance.GetConditionData(this.kind as GlobalConst.CONDITION);
            if (json.sources != undefined && json.sources.length > 0) {
                for (let i = 0; i < json.sources.length; i++) {
                    if (json.sources[i] != undefined) {
                        this.sources.push(EffectUtil.CreateSource(json.sources[i].type, json.sources[i].id));
                    }
                }
            }
        } else {
            if (kind == "" || !ObjectUtil.enumContainsString(GlobalConst.CONDITION, kind)) {
                throw new Error("trying to create condition with no valid key/kind " + kind);
            }
            this.kind = kind;
            this.$data = ConditionManager.instance.GetConditionData(this.kind as GlobalConst.CONDITION);
        }
    }
}

/*
[Condition]
A grouping for effect[] objects. Assumptions about conditions:
-Conditions are boolean, you either have them or you don't.
-The only variable son a particular condition are how many turns left (if timed,

A Condition has the following parameters:
type:CONDITION=const that can be used to tie to a data file.
turn_applied=same as effects
turns?=number of turns it will last for
effect[]=private effects array the condition manages, these get added to LivingEntity effects array as well.

[ConditionData]
Following the pattern set by Dwellers/Story, we move the bulk of work into Data files that are not serializable. Each type of Condition will have it's own data file, e.g. ConditionPoison, ConditionStarving, etc.
type:CONDITION=used to load
name=display name (might be redundant with type, TBD)
isHidden=boolean. Hidden conditions work the same, but are not revealed to player on client.
GetDescription(condition:Condition)=gets the condition description for sending to client, this will include turns left if applicable.
Apply(target:LivingEntity, turns?:number):Condition=gives this condition to the target (or if it already has adds more turns).
TurnUpdate(condition:Condition)=update condition called each turn, will autoremove if time is done.
Remove(condition:Condition)=removes condition from target.

[Effects]
The Effects system remains as is more or less, with a few changes:
EFFECT_TRIGGER.CONDITION=type will be used for all Effects which are managed by a Condition.
EFFECT_TYPE.CONDITION=type used for Effects which *cause* a condition.
condtion?:CONDITION=condition type to apply, will also check turns.
So a weapon which applies poison for 3 turns would look like: {EFFECT_TRIGGER.HIT, EFFECT_TYPE.CONDITION, condition=CONDITION.POISON, turns=3}

[Character/Dweller/LivingEntity]
Condition[]=New condition array on all LivingEntity will hold active conditions. This does not replace Effects.
All the get methods currently in Character that grab things like crit, dodge, damage bonus, etc need to move up to LivingEntity and be generalized (some will still need to be overwritten in Dweller or Character). These functions will need to poll the Effects array as before, which will include those applied by Conditions.
 */
