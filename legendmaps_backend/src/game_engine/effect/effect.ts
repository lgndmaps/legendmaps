import SerializableGameObject from "../base_classes/serializableGameObject";
import Game from "../game";
import GlobalConst from "../types/globalConst";
import {EffectD, M_TurnEvent_HPEffectTick, M_TurnEvent_Names, SourceD} from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import ObjectUtil from "../utils/objectUtil";
import RandomUtil from "../utils/randomUtil";
import Character from "../character/character";
import Dweller from "../dweller/dweller";
import EntityLiving from "../base_classes/entityLiving";
import EffectUtil from "./effectUtil";
import ConditionManager from "./conditionManager";
import Spells from "./spells";
import Item from "../item/item";
import GameUtil from "../utils/gameUtil";

/**
 * Effects can be owned by items, dwellers, or story events/traps (but only Applied on EntityLivings)
 */
export default class Effect extends SerializableGameObject implements EffectD {
    name: string = "";
    type: GlobalConst.EFFECT_TYPES;
    amount_base: number = 0;
    amount_max?: number = 0;
    bonus_dam_percent?: number; // for things like +20% dam vs Undead (would be 20 not .2)
    bonus_dam_dweller_type?: GlobalConst.DWELLER_PHYLUM; // for things like +20% dam vs Undead
    condition?: GlobalConst.CONDITION;
    chance?: number; // % chance of effect firing when triggered (expressed as number from 1-100)
    turns?: number; // number of turns effect should last
    damage_type?: GlobalConst.DAMAGE_TYPES;
    cooldown?: number; // number of turns before effect can be used again
    trigger: GlobalConst.EFFECT_TRIGGERS = GlobalConst.EFFECT_TRIGGERS.NONE;
    range?: number = 1; // range for single target effects
    aoe?: number; // range for 'area of effect' effects
    source: SourceD;
    flags: number = 0; //GlobalConst.EFFECT_FLAGS
    $amount?: number; //temp value for last amount roll
    $rollChanceFailed?: boolean = false; //temp value used by messaging to know if an effect failed to apply.

    constructor(game: Game, json: EffectD | "" = "") {
        super(game, json);
        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            if (json.source != undefined) {
                this.source = EffectUtil.CreateSource(json.source.type, json.source.id);
            }
        }
    }

    static FilterEffectsListByType(effects: Effect[], type: GlobalConst.EFFECT_TYPES): Effect[] {
        let new_effs: Effect[] = [];
        for (let i = 0; i < effects.length; i++) {
            if (effects[i].type == type) {
                new_effs.push(effects[i]);
            }
        }
        return new_effs;
    }

    static FilterEffectListByTrigger(effects: Effect[], trigger: GlobalConst.EFFECT_TRIGGERS): Effect[] {
        let new_effs: Effect[] = [];
        for (let i = 0; i < effects.length; i++) {
            if (effects[i].trigger == trigger) {
                new_effs.push(effects[i]);
            }
        }
        return new_effs;
    }

    HasDuration(): boolean {
        if (this.turns != undefined && this.turns >= 0) {
            return true;
        } else {
            return false;
        }
    }

    RollChance(): boolean {
        // if this effect has a chance specified, roll to see if it fires

        // is chance specified? If not, return true
        if (this.chance == undefined || this.chance == 0) {
            return true;
        }
        const char = this.game.dungeon.character;
        let bonus = 0;
        // Skill Check
        // Staff Attunement - id 16
        if (char.skillIds.includes(16)) {
            if (this.source.type == GlobalConst.SOURCE_TYPE.EQUIPMENT) {
                if (char.GetInvItemById(this.source.id).item.baseType == GlobalConst.ITEM_BASE_TYPE.STAFF) {
                    bonus += GameUtil.GetSkillById(16).modifiers.custom;
                }
            }
        }
        return RandomUtil.instance.percentChance(this.chance + bonus);
    }

    Validate(target: EntityLiving) {
        if (
            this.type == GlobalConst.EFFECT_TYPES.DAMAGE ||
            this.type == GlobalConst.EFFECT_TYPES.GOLD ||
            this.type == GlobalConst.EFFECT_TYPES.HEAL
        ) {
            if (this.HasDuration()) {
                throw new Error("Instant Effect With Duration Parameter " + JSON.stringify(this));
            }
        }

        if (this.trigger == GlobalConst.EFFECT_TRIGGERS.EQUIP) {
            if (!(target instanceof Character)) {
                throw new Error("Only Player May Equip Items " + JSON.stringify(target));
            }
            if (this.HasDuration()) {
                throw new Error("Equipped items may not have a duration thisect " + JSON.stringify(this));
            }
            // PICKUP and EQUIP triggered effect shouldn't randomize each time
            // REMOVED because this is now handled in the effect constructor
            // this.amount_base = this.$amount;
            // this.amount_max = 0;
        }

        if (this.trigger == GlobalConst.EFFECT_TRIGGERS.PICKUP) {
            if (!(target instanceof Character)) {
                throw new Error("Only Player May Pickup Items " + JSON.stringify(target));
            }
        }

        if (this.type == GlobalConst.EFFECT_TYPES.SPELL) {
            if (!Spells.ValidateSpellName(this.name)) {
                // if the effect name doesn't match a spell name, throw an error
                throw new Error("Attempted to cast spell '" + this.name + "' which isn't in GlobalConst.SPELLS");
            }
        }
    }

    Apply(target: EntityLiving): Effect {
        if (!(target instanceof Character || target instanceof Dweller)) {
            throw new Error("Invalid Effect Target " + JSON.stringify(target));
        }

        let applyMessage: string = "";
        // if this effect has a chance specified, roll to see if it fires
        if (!this.RollChance()) {
            this.$rollChanceFailed = true;
            return this;
        }

        if (this.type == GlobalConst.EFFECT_TYPES.MAXHP && this.amount_max > 0) {
            console.warn("WARNING: MAXHP EFFECT CAN NOT HAVE AN RANGE/amount_max, removing!");
            this.amount_max = 0;
        }

        // determine amount, randomizing if there's an amount_max set > 0
        this.$amount = RandomUtil.instance.int(
            this.amount_base,
            this.amount_max > 0 ? this.amount_max : this.amount_base,
        );

        this.Validate(target);

        if (this.type == GlobalConst.EFFECT_TYPES.DEBUGWIN) {
            this.game.dungeon.character.Escape();
            return this;
        }

        //Dealing with new Condition Causes
        if (this.type == GlobalConst.EFFECT_TYPES.GIVES_CONDITION) {
            target.$conditionsChanged = true;
            ConditionManager.instance.GiveCondition(
                target,
                this.condition,
                this.source.type,
                this.source.id,
                this.turns,
            );
            if (target instanceof Character) {
                applyMessage = "You now have condition: " + this.condition + ". ";
            } else {
                applyMessage = target.name + " now has condition: " + this.condition + ". ";
            }
            if (applyMessage != "") {
                this.game.dungeon.AddMessageEvent(applyMessage, [GlobalConst.MESSAGE_FLAGS.APPEND]);
            }
            return this;
        }

        //Timed effect must be type TIMED, so create copy effect
        if (this.HasDuration() && this.trigger != GlobalConst.EFFECT_TRIGGERS.TIMED) {
            let new_eff: Effect = new Effect(this.game);
            new_eff = Object.assign(new_eff, this);
            new_eff.trigger = GlobalConst.EFFECT_TRIGGERS.TIMED;
            new_eff.source = this.source;
            new_eff.FixRandomizedAmount();


            return new_eff.Apply(target);
        }

        if (this.trigger == GlobalConst.EFFECT_TRIGGERS.TIMED) {
            this.turns = this.turns;
        }

        //NOW APPLY EFFECT
        //TODO: Lot of missing cases here!
        if (this.type == GlobalConst.EFFECT_TYPES.HEAL) {
            target.doHeal(this.$amount);

        } else if (this.type == GlobalConst.EFFECT_TYPES.GOLD) {
            let c: Character = target as Character;
            c.ModifyGold(this.$amount);
            if (target instanceof Character) {
                applyMessage = "You gain " + this.$amount + " gold. ";
            }
        } else if (this.type == GlobalConst.EFFECT_TYPES.KEYS) {
            let c: Character = target as Character;
            c.keys += this.$amount;
            if (target instanceof Character) {
                applyMessage = "You gain " + this.$amount + " key(s). ";
            }
        } else if (this.type == GlobalConst.EFFECT_TYPES.HUNGER) {
            if (target instanceof Character) {
                let c: Character = target as Character;
                c.ModifyHunger(this.$amount);

                if (this.$amount < 0) {
                    applyMessage = "You feel more hungry ";
                } else if (this.$amount > 0) {
                    applyMessage = "You feel less hungry ";
                }
            }
        } else if (this.type == GlobalConst.EFFECT_TYPES.DAMAGE) {
            target.doDamage(this.$amount, this.damage_type, GlobalConst.DAMAGE_SOURCE.PLAYER, "DEATH"); // might be nice if effect.source had a name
        } else if (this.type == GlobalConst.EFFECT_TYPES.SPELL) {

            Spells.CastSpellByName(this.name, target, this.game, this);
        } else {
            if (this.type == GlobalConst.EFFECT_TYPES.MAXHP) {
                if (target instanceof Character) {
                    applyMessage = "You gain " + this.amount_base + " max health. ";
                }
                target.setHPMax(target.hpmax + this.amount_base);
            }

            //Dealing with all the messaging for character effects
            if (target instanceof Character) {

                let dirword: string = (this.$amount > 0) ? "gain" : "lose";
                let suffix: string = (this.turns > 0) ? " for " + this.turns + " turns. " : ". ";

                if (this.type == GlobalConst.EFFECT_TYPES.SPIRIT) {
                    applyMessage = "You " + dirword + " " + this.$amount + " spirit " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.GUILE) {
                    applyMessage = "You " + dirword + " " + this.$amount + " guile " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.AGILITY) {
                    applyMessage = "You " + dirword + " " + this.$amount + " agility " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.BRAWN) {
                    applyMessage = "You " + dirword + " " + this.$amount + " brawn " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.BLOCK) {
                    applyMessage = "You " + dirword + " " + this.$amount + " block " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.DODGE) {
                    applyMessage = "You " + dirword + " " + this.$amount + " dodge " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.CRIT) {
                    applyMessage = "You " + dirword + " " + this.$amount + " crit " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.RESIST) {
                    applyMessage = "You gain resistance to " + this.damage_type + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.VULNERABLE) {
                    applyMessage = "You are vulnerable to " + this.damage_type + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.IMMUNE) {
                    applyMessage = "You gain immunity to " + this.damage_type + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.TOHIT) {
                    applyMessage = "You " + dirword + " " + this.$amount + " to hit " + suffix;
                } else if (this.type == GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER) {
                    applyMessage = "You gain bonus damage against " + this.bonus_dam_dweller_type + " " + suffix;
                }
            }

            if (target instanceof Character) {
                target.$effectsChanged = true;
            }

            target.effects.push(this);
        }

        if (applyMessage != "" && this.game.data.turn > 0) { //0 test to avoid equip spam on game start.
            this.game.dungeon.AddMessageEvent(applyMessage, [GlobalConst.MESSAGE_FLAGS.APPEND]);
        }

        return this;
    }

    Unapply(target: EntityLiving) {
        // this usually isn't needed, except in certain cases where an Apply-time change needs to be undone
        if (this.type == GlobalConst.EFFECT_TYPES.MAXHP) {
            target.setHPMax(target.hpmax - this.amount_base);
        }
    }

    FixRandomizedAmount() {
        // Fix randomized values for effects, run at creation time for PICKUP and EQUIP triggered effects, and
        // at apply time for effects that get added to the character's effects array
        //
        // TODO can probably get rid of that $amount handling code in Validate, and maybe don't need to save $amount at all
        this.amount_base = RandomUtil.instance.int(
            this.amount_base,
            this.amount_max > 0 ? this.amount_max : this.amount_base,
        );
        this.amount_max = 0;
        // console.log(`fixed amount for ${this.type} eff on item id ${this.source_item_id} to ${this.amount_base}`);
    }

    ApplyTimedAndSendMessage(target: EntityLiving): void {
        if (this.trigger == GlobalConst.EFFECT_TRIGGERS.TIMED && this.turns >= 0) {
            //DO NOT FIRE ON TURN APPLIED
            this.turns--;
            target.$effectsChanged = true;
            if (this.turns <= 0) {
                this.flags = FlagUtil.Set(this.flags, GlobalConst.EFFECT_FLAGS.ENDED);
                this.Unapply(target);
            }
            let sendTurnEvent: boolean = true;

            /*
            if (this.type == GlobalConst.EFFECT_TYPES.HOT) {
                throw new Error("HOT effect deprecated, implement condition");
                let flags: number = 0;

                target.doHeal(this.amount_base);

                if (!sendTurnEvent) {
                    return;
                }
                let id: number = 0;
                let evtName: M_TurnEvent_Names = M_TurnEvent_Names.PLAYER_HP_EFFECT_TICK;
                if (target instanceof Dweller) {
                    id = target.GetId();
                    evtName = M_TurnEvent_Names.DWELLER_HP_EFFECT_TICK;
                }

                this.game.dungeon.AddTurnEvent(evtName, {
                    targetId: id,
                    hpChange: this.amount_base,
                    hp: target.hp,
                    flags: flags,
                } as M_TurnEvent_HPEffectTick);
            } else
            */
        }
    }
}
