import { DamageResult } from "../types/types";
import GlobalConst from "../types/globalConst";
import RandomUtil from "../utils/randomUtil";
import FlagUtil from "../utils/flagUtil";
import Item from "../item/item";
import Effect from "../effect/effect";
import CombatAttackResult from "./combatAttackResult";
import {
    M_Tile,
    M_TurnEvent_AttackResult,
    M_TurnEvent_Names,
    M_TurnEventAttackInit,
    M_TurnEventAttackStep,
    MapPosD,
} from "../types/globalTypes";
import Dweller from "../dweller/dweller";
import Character from "../character/character";
import EntityLiving from "../base_classes/entityLiving";
import Game from "../game";
import ObjectUtil from "../utils/objectUtil";
import ConditionManager from "../effect/conditionManager";
import MapPos from "../utils/mapPos";
import CombatAttack from "./combatAttack";
import MathUtil from "../utils/mathUtil";

export default class CombatAttackStep {
    game: Game;
    parentAttack: CombatAttack;
    defender: EntityLiving;
    hitRoll: number = 0;
    hitBonus: number = 0;
    defense: number = 0;
    dodge: number = 0;
    flags: number = 0;
    stepEvent: M_TurnEventAttackStep;
    results: CombatAttackResult[];

    constructor(game: Game, attack: CombatAttack, defender: EntityLiving) {
        this.game = game;
        this.parentAttack = attack;
        this.results = [];
        this.defender = defender;
    }

    doAttackStep(): void {
        this.stepEvent = {
            targetName: this.defender.cname == GlobalConst.ENTITY_CNAME.DWELLER ? this.defender.name : "you",
            tile: { x: this.defender.mapPos.x, y: this.defender.mapPos.y },
            hitRoll: 0,
            hitBonus: 0,
            defense: 0,
            flags: 0,
        };

        if (
            FlagUtil.IsSet(this.flags, GlobalConst.ATTACK_FLAGS.IS_AOE) &&
            this.defender.cname != GlobalConst.ENTITY_CNAME.DWELLER
        ) {
            //player probably hit themselves.
            this.stepEvent.targetId = 0;
        } else if (this.parentAttack.attacker instanceof Character) {
            this.stepEvent.targetId = this.defender.id;
            this.stepEvent.dwellerKind = this.defender.kind;
        } else {
            this.stepEvent.targetId = 0;
        }

        this.results = [];

        this.hitRoll = RandomUtil.instance.int(1, 100);
        this.hitBonus = this.parentAttack.attacker.tohit;
        this.dodge = this.defender.dodge;
        let hitPenaltyMultiplier = 1; //hit penalty is a percentage reduction in hit roll + hit bonus combo
        //Point blank weapon penalty
        if (this.parentAttack.attacker.range > 1) {
            if (this.game.dungeon.GetTileDistance(this.parentAttack.attacker.mapPos, this.defender.mapPos) == 1) {
                var applyPBPenalty = true;
                // check for relevant globalSkills
                if (this.parentAttack.attacker instanceof Character) {
                    // archery expert - id 28
                    if (this.parentAttack.attacker.skillIds.includes(28)) applyPBPenalty = false;

                    // wand expert - id 29
                    if (this.parentAttack.attacker.skillIds.includes(29)) applyPBPenalty = false;
                }

                if (applyPBPenalty) {
                    this.flags = FlagUtil.Set(this.flags, GlobalConst.ATTACK_FLAGS.POINT_BLANK_PENALTY);
                    hitPenaltyMultiplier = 0.75; //-25% chance to hit}
                }
            }

            if (this.defender instanceof Character) {
                //kobold evasion
                if (this.defender.skillIds.includes(23)) {
                    this.dodge += 25;
                }
            }
        }

        this.dodge = MathUtil.clamp(this.dodge, 0, GlobalConst.COMBAT_DODGE_CAP); //hard cap on dodge
        this.defense = this.defense = MathUtil.clamp(this.defense, 0, GlobalConst.COMBAT_DEFENSE_CAP); //hard cap on defense
        let dodgeRoll = RandomUtil.instance.int(1, 100);
        if ((this.hitRoll + this.hitBonus) * hitPenaltyMultiplier < this.defense) {
            this.flags = FlagUtil.Set(this.flags, GlobalConst.ATTACK_FLAGS.MISSED);
        } else if (dodgeRoll <= this.dodge) {
            this.flags = FlagUtil.Set(this.flags, GlobalConst.ATTACK_FLAGS.DODGED);
        } else {
            this.parentAttack.$isHit = true;
            //BLOCK/CRIT APPLIES TO ALL DAMAGE EFFECTS
            if (
                RandomUtil.instance.int(1, 100) <= MathUtil.clamp(this.defender.block, 0, GlobalConst.COMBAT_BLOCK_CAP)
            ) {
                this.flags = FlagUtil.Set(this.flags, GlobalConst.ATTACK_FLAGS.BLOCKED);
            } else if (RandomUtil.instance.int(1, 100) <= this.parentAttack.attacker.crit) {
                this.flags = FlagUtil.Set(this.flags, GlobalConst.ATTACK_FLAGS.CRIT);
            }

            for (let i = 0; i < this.parentAttack.attackItem.effects.length; i++) {
                let eff: Effect = this.parentAttack.attackItem.effects[i];

                if (eff.trigger == GlobalConst.EFFECT_TRIGGERS.HIT) {
                    // if chance roll fails, move on to next effect
                    if (!eff.RollChance()) continue;

                    let result: CombatAttackResult = new CombatAttackResult(this, eff);

                    if (eff.type == GlobalConst.EFFECT_TYPES.DAMAGE) {
                        //console.log("ABOUT TO DO DAMAGE: " + eff.amount_base + " to " + eff.amount_max);
                        if (eff.amount_max < eff.amount_base) {
                        }
                        result.unmodifiedDamage = RandomUtil.instance.int(eff.amount_base, eff.amount_max);
                        // only apply additive damage bonus on main (first) damage effect
                        if (i == 0) {
                            result.unmodifiedDamage += this.parentAttack.attacker.damageBonusAdditive;
                        }
                        result.unmodifiedDamage *= this.parentAttack.attacker.GetDamageBonusMultiplier(this.defender);
                        result.unmodifiedDamage = Math.round(result.unmodifiedDamage);
                        //console.log("unmodified damage: " + result.unmodifiedDamage);
                        let damageResult: DamageResult = this.defender.doDamage(
                            result.unmodifiedDamage,
                            eff.damage_type,
                            this.parentAttack.$damageSource,
                            this.parentAttack.$damageSourceName,
                            this.flags,
                            true,
                        );
                        //console.log("final damage: " + damageResult.final_damage);
                        result.flags = damageResult.flags;
                        result.finalDamage = damageResult.final_damage;

                        if (FlagUtil.IsSet(this.flags, GlobalConst.ATTACK_FLAGS.FATAL)) {
                            result.flags = FlagUtil.Set(this.flags, GlobalConst.ATTACK_FLAGS.FATAL);
                        }
                    } else {
                        eff.Apply(this.defender);

                        if (!eff.$rollChanceFailed) {
                            if (eff.type == GlobalConst.EFFECT_TYPES.GIVES_CONDITION) {
                                result.condition = eff.condition;
                                result.conditionTurns = eff.turns;
                            } else {
                                console.log("WARNING: unimplemented effect in attack " + eff.type);
                            }

                            //TODO: OTHER EFFECTS THAT ARENT DAMAGE AND ARENT CONDITIONS SHOULD BE PROCESSED HERE! (e.g. HUNGER).
                        }
                    }
                    result.CreateResultTurnEvent();

                    this.results.push(result);
                }
            }
        }
        ObjectUtil.copyAllCommonPrimitiveValues(this, this.stepEvent);
        this.sendTurnEvents();
    }

    private sendTurnEvents(): void {
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.ATTACK_STEP, this.stepEvent);
        for (let i = 0; i < this.results.length; i++) {
            let r: M_TurnEvent_AttackResult = this.results[i].$turnEvent;
            this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.ATTACK_RESULT, r);
        }
        this.defender.checkForDeath(this.parentAttack.$damageSource, this.parentAttack.$damageSourceName);
    }
}
