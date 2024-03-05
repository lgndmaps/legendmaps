import GlobalConst from "../../types/globalConst";
import EntityLiving from "../../base_classes/entityLiving";
import Condition from "../condition";
import ConditionData from "./conditionData";
import ConditionManager from "../conditionManager";
import Effect from "../effect";
import EffectUtil from "../effectUtil";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import GameUtil from "../../utils/gameUtil";
import Spells from "../spells";

export default class ConditionLowHP extends ConditionData {
    AGI_BONUS: number = 3;

    constructor() {
        super();
        this.desc = "Adrenaline rush boosts Agility +" + this.AGI_BONUS;
        this.kind = GlobalConst.CONDITION.LOWHP;
    }

    Apply(
        target: EntityLiving,
        sourceType: GlobalConst.SOURCE_TYPE,
        source_id: number = -1,
        turns: number = -1,
    ): Condition {
        let condition = super.Apply(target, sourceType, source_id, turns);

        // This condition is needed for traits like "procrastinator" which boost combat ability if char is near death
        // Also useful to pop a condition icon in this case as a warning to the player, even if we don't want to keep the agility eff

        let agilityEffect: Effect = new Effect(target.game);
        agilityEffect.amount_base = this.AGI_BONUS;
        agilityEffect.condition = this.kind;
        agilityEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id);
        agilityEffect.type = GlobalConst.EFFECT_TYPES.AGILITY;
        agilityEffect.turns = -1;
        agilityEffect.Apply(target);

        // Handle Procrastinator trait id 18 -- +30 to hit and 2x damage when low HP
        if (target instanceof Character && target.traitIds.includes(18)) {
            // console.log("Procrastinator gets combat boost from lowHP condition");
            target.game.dungeon.AddMessageEvent(
                "Procrastinator Trait: Close to death, your survival instinct kicks into gear!",
            );

            let hitEffect: Effect = new Effect(target.game);
            hitEffect.amount_base = 30; // +30 to hit
            hitEffect.condition = this.kind;
            hitEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id); // not sure I fully understand the difference between INNATE and TEMPORARY
            hitEffect.type = GlobalConst.EFFECT_TYPES.TOHIT;
            hitEffect.turns = -1;
            hitEffect.trigger = GlobalConst.EFFECT_TRIGGERS.NONE;
            hitEffect.Apply(target);

            let damEffect: Effect = new Effect(target.game);
            damEffect.bonus_dam_percent = 100; // 2x damage!
            damEffect.condition = this.kind;
            damEffect.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, condition.id); // not sure I fully understand the difference between INNATE and TEMPORARY
            damEffect.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
            damEffect.turns = -1;
            damEffect.trigger = GlobalConst.EFFECT_TRIGGERS.NONE;
            damEffect.Apply(target);
        }

        return condition;
    }

    protected ProcessTurnUpdate(target: EntityLiving, condition: Condition) {}
}
