//static Utiilty functions used by both effects AND condtions
import GlobalConst from "../types/globalConst";
import { SourceD } from "../types/globalTypes";
import Effect from "./effect";
import EntityLiving from "../base_classes/entityLiving";

export default class EffectUtil {
    static CreateSource(type: GlobalConst.SOURCE_TYPE, id: number): SourceD {
        return { type: type, id: id };
    }

    static CheckSource(source: SourceD, type: GlobalConst.SOURCE_TYPE, id: number): boolean {
        if (source == undefined || source.id <= 0) {
            return false;
        }
        if (source.type == type && source.id == id) {
            return true;
        }
        return false;
    }

    static GetEffectsFromSource(effects: Effect[], type: GlobalConst.SOURCE_TYPE, id: number): Effect[] {
        let neweffs: Effect[] = [];
        for (let i = 0; i < effects.length; i++) {
            if (effects[i].source.type == type && effects[i].source.id >= 0 && effects[i].source.id == id) {
                neweffs.push(effects[i]);
            }
        }
        return neweffs;
    }

    static FilterSourcesBySourceType(sourcesToCheck: SourceD[], stype: GlobalConst.SOURCE_TYPE): SourceD[] {
        let sources: SourceD[] = [];
        for (let i = 0; i < sourcesToCheck.length; i++) {
            if (sourcesToCheck[i].type == stype) {
                sources.push(sourcesToCheck[i]);
            }
        }
        return sources;
    }

    static RemoveEffectsBySource(target: EntityLiving, sourceType: GlobalConst.SOURCE_TYPE, sourceId: number) {
        if (sourceId < 0) {
            throw new Error("this method should only be used with a source id");
        }

        let neweffects: Effect[] = [];
        for (let e = 0; e < target.effects.length; e++) {
            if (target.effects[e].source.type == sourceType && target.effects[e].source.id == sourceId) {
                target.effects[e].Unapply(target);
            } else {
                neweffects.push(target.effects[e]);
            }
        }
        target.$effectsChanged = true;
        target.effects = neweffects;
    }

    static MergeEffectIntoEffectArray(new_eff: Effect, effects: Effect[]): Effect[] {
        // Merge a new effect into existing effects array where possible
        let effMerged: boolean = false;
        // merge damage effects only if they are the same in all relevant ways
        if (new_eff.type == GlobalConst.EFFECT_TYPES.DAMAGE) {
            let cur_effs: Effect[] = Effect.FilterEffectsListByType(effects, new_eff.type);
            for (const cur_eff of cur_effs) {
                if (
                    cur_eff.damage_type == new_eff.damage_type &&
                    cur_eff.range == new_eff.range &&
                    cur_eff.chance == new_eff.chance &&
                    cur_eff.trigger == new_eff.trigger &&
                    cur_eff.turns == new_eff.turns
                ) {
                    cur_eff.amount_base += new_eff.amount_base;
                    cur_eff.amount_max += new_eff.amount_max;
                    effMerged = true;
                }
            }
        } else if (
            new_eff.type == GlobalConst.EFFECT_TYPES.CRIT ||
            new_eff.type == GlobalConst.EFFECT_TYPES.BLOCK ||
            new_eff.type == GlobalConst.EFFECT_TYPES.TOHIT ||
            new_eff.type == GlobalConst.EFFECT_TYPES.DEFENSE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.DODGE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.HEAL ||
            new_eff.type == GlobalConst.EFFECT_TYPES.BRAWN ||
            new_eff.type == GlobalConst.EFFECT_TYPES.AGILITY ||
            new_eff.type == GlobalConst.EFFECT_TYPES.GUILE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.SPIRIT ||
            new_eff.type == GlobalConst.EFFECT_TYPES.HUNGER ||
            new_eff.type == GlobalConst.EFFECT_TYPES.MAXHP
        ) {
            let cur_effs: Effect[] = Effect.FilterEffectsListByType(effects, new_eff.type);
            for (const cur_eff of cur_effs) {
                if (
                    cur_eff.chance == new_eff.chance &&
                    cur_eff.trigger == new_eff.trigger &&
                    cur_eff.turns == new_eff.turns
                ) {
                    cur_eff.amount_base += new_eff.amount_base;
                    cur_eff.amount_max += new_eff.amount_max;
                    // console.log("combining " + new_eff.type + " effect on " + this.name);
                    effMerged = true;
                }
            }
        } else if (
            new_eff.type == GlobalConst.EFFECT_TYPES.VULNERABLE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.RESIST ||
            new_eff.type == GlobalConst.EFFECT_TYPES.IMMUNE
        ) {
            let cur_effs: Effect[] = Effect.FilterEffectsListByType(effects, new_eff.type);
            for (const cur_eff of cur_effs) {
                if (
                    cur_eff.damage_type == new_eff.damage_type &&
                    cur_eff.chance == new_eff.chance &&
                    cur_eff.trigger == new_eff.trigger &&
                    cur_eff.turns == new_eff.turns
                ) {
                    // duplicate res/vuln/imm, can skip
                    effMerged = true;
                }
            }
        } else if (new_eff.type == GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER) {
            let cur_effs: Effect[] = Effect.FilterEffectsListByType(effects, new_eff.type);
            for (const cur_eff of cur_effs) {
                if (
                    cur_eff.bonus_dam_dweller_type == new_eff.bonus_dam_dweller_type &&
                    cur_eff.trigger == new_eff.trigger &&
                    cur_eff.turns == new_eff.turns
                ) {
                    cur_eff.amount_base += new_eff.amount_base;
                    cur_eff.amount_max += new_eff.amount_max;
                    cur_eff.bonus_dam_percent += new_eff.bonus_dam_percent;
                    console.log("combining " + new_eff.type + " effect on " + this.name);
                    effMerged = true;
                }
            }
        }
        // if the new effect wasn't already merged into an existing effect, add it
        if (!effMerged) effects.push(new_eff);

        return effects;
    }
}
