import MapObject from "./mapObject";
import SerializableGameObject from "./serializableGameObject";
import Game from "../game";
import { EntityD, MapEntityD, M_TurnEvent, EntityLivingD } from "../types/globalTypes";
import MapEntity from "../map/mapEntity";
import MapPos from "../utils/mapPos";
import FlagUtil from "../utils/flagUtil";
import { DamageResult } from "../types/types";
import Entity from "./entity";
import GlobalConst from "../types/globalConst";
import Effect from "../effect/effect";
import Character from "../character/character";
import Condition from "../effect/condition";
import ObjectUtil from "../utils/objectUtil";
import InventoryItem from "../item/inventoryItem";
import CONDITION = GlobalConst.CONDITION;
import character from "../character/character";
import ConditionManager from "../effect/conditionManager";
import GameUtil from "../utils/gameUtil";
import ArrayUtil from "../utils/arrayUtil";
import RandomUtil from "../utils/randomUtil";
import Spells from "../effect/spells";

/**
 */
abstract class EntityLiving extends Entity implements EntityLivingD {
    effects: Effect[];
    conditions: Condition[];
    $conditionsChanged: boolean = true;
    $effectsChanged: boolean = true;

    constructor(game: Game, json: EntityLivingD | "" = "") {
        super(game, json);
        this.effects = [];
        this.conditions = [];

        if (json) {
            try {
                ObjectUtil.copyAllCommonPrimitiveValues(json, this, [
                    "brawn",
                    "agility",
                    "spirit",
                    "guile",
                    "hpmax",
                    "luck",
                ]);
            } catch (e) {
                console.log("entity copy error, expected in some cases");
            }

            for (let i = 0; i < json.effects?.length; i++) {
                this.effects.push(new Effect(this.game, json.effects[i]));
            }

            for (let i = 0; i < json.conditions?.length; i++) {
                this.conditions.push(new Condition(this.game, json.conditions[i]));
            }

            this.mapEntity = new MapEntity(this.game, json.mapEntity);
        } else {
            ///CampaignUtil.fetch(this.game.data.campaignId+"");

            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = "@";
            this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE);
            this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        }
    }

    /**
     * All Damaged to living entites goes through this function.
     * @param amount Unmodified base damage
     * @param type Damage Type
     * @param source Source of damage, must be set for any damage to player so we can show cause of death
     * @param initialFlags optional flags value to start with (used with attacks to set pass in if attack was a crit or blocked)
     */
    doDamage(
        amount: number,
        type: GlobalConst.DAMAGE_TYPES,
        source: GlobalConst.DAMAGE_SOURCE,
        sourceName: string = "",
        initialFlags: number = 0,
        delayDeathCheck: boolean = false,
    ): DamageResult {
        if (amount <= 0) {
            // throw new Error("doDamage expects a positive value");
            // Amount may legitimately be less than 0 because of a negative damage bonus.
            // Set minimum damage of 1
            amount = 1;
        } else if (sourceName == "" && this instanceof Character) {
            throw new Error("Damage to character must have a damage source for messaging death causes");
        }
        let flags: number = initialFlags;
        let base_damage: number = amount;
        let damage: number = amount;

        if (this.isImmune(type)) {
            damage = 0;
            //Clearing unnecessary flags since target immune
            flags = FlagUtil.UnSet(flags, GlobalConst.ATTACK_FLAGS.BLOCKED);
            flags = FlagUtil.UnSet(flags, GlobalConst.ATTACK_FLAGS.CRIT);
            flags = FlagUtil.Set(flags, GlobalConst.ATTACK_FLAGS.IMMUNE);

            return {
                base_damage: base_damage,
                final_damage: 0,
                damage_type: type,
                sourceDescrip: source,
                flags: flags,
            } as DamageResult;
        }

        if (this.isResistant(type)) {
            damage *= 0.5;
            flags = FlagUtil.UnSet(flags, GlobalConst.ATTACK_FLAGS.CRIT); //Can't crit resistant targets
            flags = FlagUtil.Set(flags, GlobalConst.ATTACK_FLAGS.RESISTED);
        } else if (this.isVulnerable(type)) {
            flags = FlagUtil.Set(flags, GlobalConst.ATTACK_FLAGS.VULN);
            damage *= 1.5;
        }

        if (FlagUtil.IsSet(flags, GlobalConst.ATTACK_FLAGS.BLOCKED)) {
            flags = FlagUtil.UnSet(flags, GlobalConst.ATTACK_FLAGS.CRIT); //Can't crit blocked attack
            damage *= 0.5;
        }

        if (FlagUtil.IsSet(flags, GlobalConst.ATTACK_FLAGS.CRIT)) {
            damage *= 2;
        }

        damage = Math.round(damage);

        this._hp -= damage;

        if (this._hp <= 0) {
            flags = FlagUtil.Set(flags, GlobalConst.ATTACK_FLAGS.FATAL);
            if (!delayDeathCheck) {
                this.checkForDeath(source, sourceName);
            }
        }

        // check for low HP condition
        if (this instanceof Character && (this.hp < 10 || this.hp < this.hpmax / 10) && this.hp > 0) {
            // check for miscreant's escape
            // Mirthcreant's escape skill - id 35
            if (this instanceof Character && this.skillIds.includes(35)) {
                const skill = GameUtil.GetSkillById(35);
                if (RandomUtil.instance.percentChance(skill.modifiers.custom)) {
                    // teleport!
                    this.game.dungeon.AddMessageEvent(skill.name + " kicks in!", [GlobalConst.MESSAGE_FLAGS.APPEND]);

                    Spells.Teleport(this.game, this);
                }
            }
            // add low HP condition if it isn't already set
            if (!ConditionManager.instance.HasConditionInnate(this, GlobalConst.CONDITION.LOWHP)) {
                this.game.dungeon.AddMessageEvent("Careful! You are dangerously close to death!");
                ConditionManager.instance.GiveCondition(
                    this,
                    GlobalConst.CONDITION.LOWHP,
                    GlobalConst.SOURCE_TYPE.INNATE,
                );
            }
        }

        return {
            base_damage: base_damage,
            final_damage: damage,
            damage_type: type,
            flags: flags,
        } as DamageResult;
    }

    //used with delayed death checks (combat attack)
    checkForDeath(source: GlobalConst.DAMAGE_SOURCE, sourceName: string): boolean {
        if (this._hp <= 0) {
            if (this instanceof Character && this.game.dungeon.character.skillIds.includes(53)) {
                ArrayUtil.remove(this.game.dungeon.character.skillIds, 53);
                this.game.dungeon.AddMessageEvent("You have died, but your Zombie's Bile skill has saved you!");
                this._hp = Math.round(this._hpmax / 2);
                return false;
            }

            this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.IS_DEAD);
            this.Die(source, sourceName);

            return true;
        }
        return false;
    }

    doHeal(amount: number): void {
        if (amount < 0) {
            throw new Error("doHeal expects a positive value");
        }

        if (this._hp >= this._hpmax) {
            return;
        }

        // Physician trait +10% heal (min of +1)
        if (this instanceof Character && this.traitIds.includes(19)) {
            let bonus: number = Math.ceil(amount * 0.1);
            this.game.dungeon.AddMessageEvent("Physician trait boosts healing by " + bonus);
            amount += bonus;
        }

        // Quex's Blessing - id 32
        if (this instanceof Character && this.skillIds.includes(32)) {
            const skill = GameUtil.GetSkillById(32);
            let bonus: number = Math.ceil(amount * (skill.modifiers.custom / 100));
            this.game.dungeon.AddMessageEvent(skill.name + " skill boosts healing by " + bonus);
            amount += bonus;
        }

        if (amount + this._hp > this.hpmax) {
            // adjust the amount so it won't exceed hpmax
            // doing it this way instead of previous way so we can report the amount applied correctly
            amount = this.hpmax - this._hp;
        }

        this._hp += amount;

        // check for exiting low HP condition
        if (
            this instanceof Character &&
            this.hp > 10 &&
            this.hp > this.hpmax / 10 &&
            ConditionManager.instance.HasConditionInnate(this, GlobalConst.CONDITION.LOWHP)
        ) {
            this.game.dungeon.AddMessageEvent("You are no longer on death's door.");
            ConditionManager.instance.RemoveConditionSource(
                this,
                GlobalConst.CONDITION.LOWHP,
                GlobalConst.SOURCE_TYPE.INNATE,
            );
        }

        if (this instanceof Character) {
            // don't need message for 0 or 1 heals
            if (amount > 1)
                this.game.dungeon.AddFXEvent("Healed for " + amount, GlobalConst.CLIENTFX.HEAL, [], true, [], amount);
        } else {
            this.game.dungeon.AddFXEvent(
                this.name + " healed for " + amount,
                GlobalConst.CLIENTFX.HEAL,
                [],
                false,
                [this.id],
                amount,
            );
        }
    }

    protected _hp: number = -1;
    protected _hpmax: number = -1;
    public setBaseHP(value: number) {
        this._hpmax = value;
        this._hp = value;
    }

    public setHPMax(value: number) {
        //  adjust hp proportionally, so if HP is 10 and MAXHP is 20 (50%), and MAXHP is raised to 30 -> new HP is 15 (still 50%)
        let hp_pct = this.hp / this.hpmax;
        this._hpmax = value;
        this._hp = Math.round(hp_pct * this.hpmax);
    }

    public get hp(): number {
        // return MathUtil.clamp(this._hp, 0, this.hpmax); this might be better but don't want to risk introducing issues
        return Math.max(this._hp, 0);
    }

    public get hpmax(): number {
        return this._hpmax;
    }

    public get defense(): number {
        throw new Error("Method not implemented.");
    }

    public get block(): number {
        throw new Error("Method not implemented.");
    }

    public get dodge(): number {
        throw new Error("Method not implemented.");
    }

    public get range(): number {
        throw new Error("Method not implemented.");
    }

    public get tohit(): number {
        throw new Error("Method not implemented.");
    }

    public get luck(): number {
        throw new Error("Method not implemented.");
    }

    public get damageBonusAdditive(): number {
        throw new Error("Method not implemented.");
    }

    public GetDamageBonusMultiplier(defender: EntityLiving): number {
        throw new Error("Method not implemented.");
    }

    public get crit(): number {
        throw new Error("Method not implemented.");
    }

    public get immunities(): GlobalConst.DAMAGE_TYPES[] {
        throw new Error("implemented by dweller/character");
    }

    public get resistances(): GlobalConst.DAMAGE_TYPES[] {
        throw new Error("implemented by dweller/character");
    }

    public get vulnerabilities(): GlobalConst.DAMAGE_TYPES[] {
        throw new Error("implemented by dweller/character");
    }

    public isImmune(type: GlobalConst.DAMAGE_TYPES) {
        return this.immunities.includes(type) ? true : false;
    }

    //NOTE FOR NEXT TWO HANDLES VULN + RES CANCELLING EACH OTHER OUT
    public isVulnerable(type: GlobalConst.DAMAGE_TYPES) {
        return this.vulnerabilities.includes(type) && !this.resistances.includes(type) ? true : false;
    }

    public isResistant(type: GlobalConst.DAMAGE_TYPES) {
        return !this.vulnerabilities.includes(type) && this.resistances.includes(type) ? true : false;
    }

    public get name(): string {
        return "NO NAME";
    }

    protected Die(killerType: GlobalConst.DAMAGE_SOURCE, killerName: string) {
        throw new Error("Death not implemented in EntityLiving");
    }

    public GetConditionByKind(cond_kind: GlobalConst.CONDITION): Condition {
        let cond: Condition;
        for (let i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i].kind == cond_kind) {
                cond = this.conditions[i];
            }
        }
        return cond;
    }

    protected CheckTimed() {
        //CONDITIONS PROCESSING
        for (let e = 0; e < this.conditions.length; e++) {
            let c: Condition = this.conditions[e];
            c.$data.TurnUpdate(this, c);
        }

        //EFFECTS PROCESSING
        let newEffects: Effect[] = [];
        for (let e = 0; e < this.effects.length; e++) {
            if (this.effects[e].trigger == GlobalConst.EFFECT_TRIGGERS.TIMED) {
                this.effects[e].ApplyTimedAndSendMessage(this);
                if (FlagUtil.IsNotSet(this.effects[e].flags, GlobalConst.EFFECT_FLAGS.ENDED)) {
                    newEffects.push(this.effects[e]);
                } else {
                    if (this instanceof Character) {
                        this.$effectsChanged = true;
                    }
                }
            } else {
                newEffects.push(this.effects[e]);
            }
        }
        this.effects = newEffects;
    }
}

export default EntityLiving;
