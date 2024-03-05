import type Game from "../game";
import GlobalConst from "../types/globalConst";
import MapEntity from "../map/mapEntity";
import {ItemD, M_TurnEvent_InstantPickup, M_TurnEvent_Names, M_TurnEvent_UseItem} from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import ObjectUtil from "../utils/objectUtil";
import Entity from "../base_classes/entity";
import Effect from "../effect/effect";
import Character from "../character/character";
import Dweller from "../dweller/dweller";
import ItemGenCommon from "./itemgen/itemGenCommon";
import EffectUtil from "../effect/effectUtil";
import SOURCE_TYPE = GlobalConst.SOURCE_TYPE;
import EntityLiving from "../base_classes/entityLiving";
import RandomUtil from "../utils/randomUtil";
import GameUtil from "../utils/gameUtil";
import InventoryItem from "./inventoryItem";
import WeaponFactory from "./itemgen/weaponFactory";

export default class Item extends Entity implements ItemD {
    // Public getter name assembles from these -> Nifty Pole-ax of Death
    public nameBase: string = "Item"; // "Pole-ax"
    public namePre: string = ""; // "Nifty"
    public namePost: string = ""; // "[of] Death" (the "of " gets added automatically)

    public get name() {
        let n: string = this.nameBase;
        if (this.namePre != "") n = this.namePre + " " + n;
        if (this.namePost != "") n += " of " + this.namePost;
        // if (this.uses > 1) n += "(" + this.uses + ")";
        // if (this.isWeapon()) {
        //     n += "(" + this.AverageDamagePerTurn() + ")";
        // }
        return n;
    }

    public set name(newName: string) {
        this.nameBase = newName;
    }

    public baseType: GlobalConst.ITEM_BASE_TYPE;
    public baseTypeDweller?: GlobalConst.DWELLER_ATTACK_TYPE;
    public slot: GlobalConst.EQUIPMENT_SLOT = GlobalConst.EQUIPMENT_SLOT.NONE;
    public cooldown: number = -1;
    public uses: number = -1;
    public ascii: string = "";
    public rarity: GlobalConst.RARITY = GlobalConst.RARITY.NONE;
    public cr: number;
    public effects: Effect[] = [];
    public value: number = 0;
    public itemFlags: number = 0;

    constructor(game: Game, json: ItemD | "" = "") {
        super(game, json);

        this.cname = GlobalConst.ENTITY_CNAME.ITEM;
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.BLOCKS_VISION);
        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            if (json.mapEntity != undefined) {
                this.mapEntity = new MapEntity(this.game, json.mapEntity);
            }
            this.effects = [];
            for (let i = 0; i < json.effects.length; i++) {
                this.effects.push(new Effect(this.game, json.effects[i]));
            }
        } else {
            /* map character is not required on items
            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = " ";
            */
        }
    }

    //Returns first Effect on item of given type
    GetFirstEffectByType(type: GlobalConst.EFFECT_TYPES): Effect {
        for (let i = 0; i < this.effects.length; i++) {
            if (this.effects[i].type == type) {
                return this.effects[i];
            }
        }
        console.warn("No effect of type " + type + " found on item " + this.name);
        return null;
    }

    //Returns all Effects on item of given type
    GetEffectsByType(type: GlobalConst.EFFECT_TYPES): Effect[] {
        return Effect.FilterEffectsListByType(this.effects, type);
    }

    //Returns all Effects on item for a given trigger
    GetEffectsByTrigger(trigger: GlobalConst.EFFECT_TRIGGERS): Effect[] {
        return Effect.FilterEffectListByTrigger(this.effects, trigger);
    }

    //Adds an effect for the item to trigger a condition
    public AddCondition(
        condition: GlobalConst.CONDITION,
        trigger: GlobalConst.EFFECT_TRIGGERS,
        sourceType: SOURCE_TYPE,
        item_id: number,
        turns: number = -1,
        chance?: number,
    ): Effect {
        if (sourceType == SOURCE_TYPE.TEMPORARY && turns < 0) {
            throw new Error("Temp condition must have turn count");
        } else if (sourceType != SOURCE_TYPE.TEMPORARY && turns >= 0) {
            throw new Error(this.name + ": INNATE/EQUIP condition must NOT have turn count");
        } else if (sourceType == SOURCE_TYPE.EQUIPMENT && item_id <= 0) {
            throw new Error("EQUIP condition must have a valid item_id");
        }
        let conditionEffect: Effect = new Effect(this.game);
        conditionEffect.turns = turns;
        conditionEffect.trigger = trigger;
        conditionEffect.type = GlobalConst.EFFECT_TYPES.GIVES_CONDITION;
        conditionEffect.condition = condition;
        conditionEffect.source = EffectUtil.CreateSource(sourceType, item_id);
        if (chance) {
            conditionEffect.chance = chance;
        }
        this.effects.push(conditionEffect);
        return conditionEffect;
    }

    public AddEffect(new_eff: Effect): Effect {
        // fix randomized amounts for EQUIP and PICKUP triggered effects
        if (
            new_eff.trigger == GlobalConst.EFFECT_TRIGGERS.EQUIP ||
            new_eff.trigger == GlobalConst.EFFECT_TRIGGERS.PICKUP
        ) {
            new_eff.FixRandomizedAmount();
        }

        // try merging mergable effects
        this.effects = EffectUtil.MergeEffectIntoEffectArray(new_eff, this.effects);

        //update item value
        ItemGenCommon.UpdateValue(this);

        // if item is equipped, and new_eff.trigger == EQUIP, apply the effect
        if (
            new_eff.trigger == GlobalConst.EFFECT_TRIGGERS.EQUIP &&
            this.game.dungeon.character &&
            this.game.dungeon.character.IsItemEquipped(this)
        ) {
            // this.game.dungeon.character.UnequipByItemID(this.id);
            new_eff.Apply(this.game.dungeon.character);
        }

        return new_eff;
    }

    public AddNewEffect(
        eff_type: GlobalConst.EFFECT_TYPES,
        trigger: GlobalConst.EFFECT_TRIGGERS,
        amount_base: number,
        amount_max?: number,
        chance?: number,
        cooldown?: number,
        range?: number,
        aoe?: number,
        damage_type?: GlobalConst.DAMAGE_TYPES,
        turns?: number,
        bonus_dam_percent?: number,
        bonus_dam_dweller_type?: GlobalConst.DWELLER_PHYLUM,
        condition?: GlobalConst.CONDITION,
    ): Effect {
        if (amount_max == undefined) {
            amount_max = 0;
        }
        // for certain types which require an amount, if amount is always 0, don't add the effect
        if (amount_base == 0 && amount_max == 0) {
            if (
                [
                    GlobalConst.EFFECT_TYPES.BLOCK,
                    GlobalConst.EFFECT_TYPES.DAMAGE,
                    GlobalConst.EFFECT_TYPES.DODGE,
                    GlobalConst.EFFECT_TYPES.CRIT,
                    GlobalConst.EFFECT_TYPES.TOHIT,
                    GlobalConst.EFFECT_TYPES.DEFENSE,
                ].includes(eff_type)
            ) {
                return;
            }
        }

        // TODO if effect_type, trigger, damage type, etc are already present, consider combining the two instead of making a new one
        // might only be meaningful for passive effect on armor and weapons (basically don't want a Block +10 and a Block +5 on a shield of blocking)

        // okay, since effect is meaningful, add it
        let eff = new Effect(this.game);
        eff.type = eff_type;
        eff.chance = chance;
        eff.cooldown = cooldown;
        eff.range = range;
        eff.aoe = aoe;
        eff.damage_type = damage_type;
        eff.turns = turns;
        eff.amount_base = amount_base;
        eff.amount_max = amount_max;
        eff.bonus_dam_percent = bonus_dam_percent;
        eff.bonus_dam_dweller_type = bonus_dam_dweller_type;
        eff.trigger = trigger;
        eff.source = EffectUtil.CreateSource(SOURCE_TYPE.EQUIPMENT, this.id);
        eff.condition = condition;

        return this.AddEffect(eff);
    }

    ApplyEffectsByTrigger(
        trigger: GlobalConst.EFFECT_TRIGGERS,
        target: Character | Dweller,
        source: GlobalConst.SOURCE_TYPE = GlobalConst.SOURCE_TYPE.TEMPORARY,
        source_id: number = -1,
    ) {
        this.GetEffectsByTrigger(trigger).forEach((eff) => {
            eff.Apply(target);
        });
    }

    Use(targetDweller: Dweller = undefined) {
        if (this.uses == 0) {
            this.game.dungeon.AddMessageEvent("That item has no uses left!", [
                GlobalConst.MESSAGE_FLAGS.EMPHASIZE,
                GlobalConst.MESSAGE_FLAGS.DELAY_AFTER,
            ]);
            return;
        }
        let desc: string = "You use the " + this.name + ". ";
        if (this.kind == GlobalConst.ITEM_BASE_TYPE.POTION) {
            this.game.data.stats.potionsDrunk++;
            desc = "You quaff the " + this.name + ". ";
        } else if (this.kind == GlobalConst.ITEM_BASE_TYPE.FOOD) {
            this.game.data.stats.foodEaten++;
            desc = "You eat the " + this.name + ". ";
        } else if (this.kind == GlobalConst.ITEM_BASE_TYPE.SCROLL) {
            this.game.data.stats.scrollsRead++;
            desc = "You read the " + this.name + ". ";
        }

        let target: EntityLiving = this.game.dungeon.character;
        let isDwellerTarget: boolean = false;

        let evt: M_TurnEvent_UseItem = {
            itemId: this.GetId(),
            desc: "",
        } as M_TurnEvent_UseItem;

        let evtEnd: M_TurnEvent_UseItem = {
            itemId: this.GetId(),
            desc: "",
        } as M_TurnEvent_UseItem;

        if (targetDweller != undefined) {
            isDwellerTarget = true;
            target = targetDweller;
            evt.dwellerId = target.id;
            evt.dwellerKind = target.kind;
        }

        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.USED_ITEM, evt);
        evtEnd.effects = [];
        if (
            this.game.dungeon.character.skillIds.includes(50) &&
            (this.baseType == GlobalConst.ITEM_BASE_TYPE.POTION || this.baseType == GlobalConst.ITEM_BASE_TYPE.SCROLL)
        ) {
            this.uses = -1; //make sure other skills don't recycle it.
            this.game.dungeon.character.RemoveItem(this.game.dungeon.character.GetInvItemById(this.id));
            this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);
            this.game.dungeon.AddMessageEvent(
                this.name + " has no effect, the magic fizzles (skill: Gem Lizard's Scales)",
                [GlobalConst.MESSAGE_FLAGS.APPEND],
            );
        } else {
            for (let e = 0; e < this.effects.length; e++) {
                if (this.effects[e].trigger == GlobalConst.EFFECT_TRIGGERS.USE) {

                    let eff: Effect = this.effects[e].Apply(target);
                    
                    evtEnd.effects.push(eff);
                }
            }
        }

        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.USED_ITEM_COMPLETE, evtEnd);
        this.game.dungeon.character.$inventoryChanged = true;
        if (this.uses > 0) {
            // Skill Check -- NightFather's Spellbook - id 26
            if (
                this.baseType == GlobalConst.ITEM_BASE_TYPE.SCROLL &&
                this.game.dungeon.character.skillIds.includes(26)
            ) {
                let amount = GameUtil.GetSkillById(26).modifiers.custom;
                // not using target here since this should apply even on dweller-targetted scrolls; presuming for now that dwellers can't read their own scrolls
                if (RandomUtil.instance.percentChance(amount)) {
                    // increment the uses by 1 to negate the decrementing that's about to happen
                    this.uses++;
                    // notify the player
                    const skillName = GameUtil.GetSkillById(26).name;
                    this.game.dungeon.AddMessageEvent(
                        skillName + ": Your skillful usage allowed you to preserve the scroll!",
                        [GlobalConst.MESSAGE_FLAGS.APPEND],
                    );
                }
            } else if (
                this.baseType == GlobalConst.ITEM_BASE_TYPE.POTION &&
                this.game.dungeon.character.skillIds.includes(25)
            ) {
                let amount = GameUtil.GetSkillById(25).modifiers.custom;
                // not using target here since this should apply even on dweller-targetted scrolls; presuming for now that dwellers can't read their own scrolls
                if (RandomUtil.instance.percentChance(amount)) {
                    // increment the uses by 1 to negate the decrementing that's about to happen
                    this.uses++;
                    // notify the player
                    const skillName = GameUtil.GetSkillById(25).name;
                    this.game.dungeon.AddMessageEvent(skillName + ": You wrest another use from the potion!", [
                        GlobalConst.MESSAGE_FLAGS.APPEND,
                    ]);
                }
            }

            this.uses--;

            if (this.uses <= 0) {
                this.game.dungeon.character.RemoveItem(this.game.dungeon.character.GetInvItemById(this.id));
                this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);
            }
        }
    }

    Spawn(x: number, y: number) {
        this.mapEntity = new MapEntity(this.game);
        this.mapEntity.ascii = this.ascii;
        super.Spawn(x, y);
    }

    doPlayerPickup(char: Character): void {
        this.game.dungeon.AddMessageEvent("You picked up a " + this.name, [GlobalConst.MESSAGE_FLAGS.APPEND]);
        let addToInventory: boolean = true;
        let pickup_effects: Effect[] = this.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.PICKUP);
        for (let i = 0; i < pickup_effects.length; i++) {
            pickup_effects[i].Apply(char);
            if (this.isTreasure()) {
                addToInventory = false;
                this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.GOLD_PICKUP, {
                    amount: pickup_effects[i].$amount,
                    newtotal: this.game.dungeon.character.gold,
                } as M_TurnEvent_InstantPickup);
            } else if (this.baseType == GlobalConst.ITEM_BASE_TYPE.KEY) {
                addToInventory = false;
                this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.KEY_PICKUP, {
                    amount: pickup_effects[i].$amount,
                    newtotal: this.game.dungeon.character.keys,
                } as M_TurnEvent_InstantPickup);
            }
        }

        if (addToInventory) {
            char.GiveItem(this);
        }

        // ...and remove from floor
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);
    }

    isTreasure(): boolean {
        return (
            this.baseType == GlobalConst.ITEM_BASE_TYPE.COINBAG ||
            this.baseType == GlobalConst.ITEM_BASE_TYPE.COINS ||
            this.baseType == GlobalConst.ITEM_BASE_TYPE.GEM
        );
    }

    isKey(): boolean {
        return this.baseType == GlobalConst.ITEM_BASE_TYPE.KEY;
    }

    isConsumable(): boolean {
        return (
            this.baseType == GlobalConst.ITEM_BASE_TYPE.POTION ||
            this.baseType == GlobalConst.ITEM_BASE_TYPE.SCROLL ||
            this.baseType == GlobalConst.ITEM_BASE_TYPE.FOOD
        );
    }

    isWeapon(): boolean {
        return Object.values(GlobalConst.WEAPON_BASE_TYPE).includes(this.baseType as GlobalConst.WEAPON_BASE_TYPE);
    }

    //Weapon range is always based on first HIT/DAMAGE EFFECT
    GetRange(): number {
        // non-weapons will have a range of -1
        let damEff: Effect = this.GetFirstEffectByType(GlobalConst.EFFECT_TYPES.DAMAGE);
        let range: number = -1;
        if (damEff) {
            range = damEff.range;
        }
        return range;
    }

    SetRange(newRange: number) {
        let damEffect: Effect = this.GetFirstEffectByType(GlobalConst.EFFECT_TYPES.DAMAGE);
        if (damEffect) damEffect.range = newRange;
        console.log("Setting range for " + this.name + " to:  " + newRange);
    }

    isArmor(): boolean {
        return Object.values(GlobalConst.ARMOR_BASE_TYPE).includes(this.baseType as GlobalConst.ARMOR_BASE_TYPE);
    }

    AverageDamagePerTurn(): number {
        let avgDam: number = 0;

        if (this.isWeapon) {
            for (let eff of this.effects) {
                if (eff.type == GlobalConst.EFFECT_TYPES.DAMAGE) {
                    // damage
                    let incrementalDam: number = (eff.amount_base + eff.amount_max) / 2;
                    if (eff.chance && eff.chance > 0) incrementalDam *= eff.chance / 100;
                    avgDam += incrementalDam;
                } else if (eff.type == GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER) {
                    if (eff.amount_base > 0) {
                        //additive damage bonus
                        avgDam += eff.amount_base;
                    }
                    if (eff.bonus_dam_percent > 0) {
                        // divide by 8 (* .125) because these damage bonus multipliers are only for one dweller phylum
                        avgDam += (eff.bonus_dam_percent / 100) * 0.125 * avgDam;
                    }
                } else if (eff.type == GlobalConst.EFFECT_TYPES.CRIT) {
                    avgDam += avgDam * (eff.amount_base / 100);
                }
            }
        }
        return avgDam;
    }

    static GetEquipSlotByType(baseType: GlobalConst.ITEM_BASE_TYPE): GlobalConst.EQUIPMENT_SLOT {
        // Tried to use this as a getter method for this.slot, but it was causing problems on the frontend,
        // so am using this workaround. Since slot is always based on base_item_type, probably don't need to store it on a per item basis

        if (Object.values(GlobalConst.WEAPON_BASE_TYPE).includes(baseType as GlobalConst.WEAPON_BASE_TYPE)) {
            // weapons
            return GlobalConst.EQUIPMENT_SLOT.WEAPON;
        } else if (Object.values(GlobalConst.ARMOR_BASE_TYPE).includes(baseType as GlobalConst.ARMOR_BASE_TYPE)) {
            // armor slot depends on type
            switch (baseType) {
                case GlobalConst.ITEM_BASE_TYPE.HAT:
                case GlobalConst.ITEM_BASE_TYPE.HELM:
                    return GlobalConst.EQUIPMENT_SLOT.HEAD;
                    break;
                case GlobalConst.ITEM_BASE_TYPE.BOOTS:
                    return GlobalConst.EQUIPMENT_SLOT.FEET;
                    break;
                case GlobalConst.ITEM_BASE_TYPE.SHIELD:
                    return GlobalConst.EQUIPMENT_SLOT.SHIELD;
                    break;
                default:
                    // otherwise it's on the body
                    return GlobalConst.EQUIPMENT_SLOT.BODY;
                    break;
            }
        } else if (Object.values(GlobalConst.JEWELRY_BASE_TYPE).includes(baseType as GlobalConst.JEWELRY_BASE_TYPE)) {
            // jewelry
            return GlobalConst.EQUIPMENT_SLOT.JEWELRY;
        } else {
            return GlobalConst.EQUIPMENT_SLOT.NONE;
        }
    }

    public GetTotalOfEffectsByType(eff_type: GlobalConst.EFFECT_TYPES): number {
        let totalEffect: number = 0;
        this.effects.forEach((eff) => {
            if (eff.type == eff_type) {
                // TODO this can probably just be cleaned up to always use amount_base (or $amount)
                if (eff.amount_max != undefined && eff.amount_max != 0) {
                    totalEffect += RandomUtil.instance.int(eff.amount_base, eff.amount_max);
                } else {
                    totalEffect += eff.amount_base;
                }
            }
        });
        return totalEffect;
    }
}
