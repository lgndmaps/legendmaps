import type Game from "../../game";
import GlobalConst from "../../types/globalConst";
import ArrayUtil from "../../utils/arrayUtil";
import RandomUtil from "../../utils/randomUtil";
import GameUtil from "../../utils/gameUtil";
import Effect from "../../effect/effect";
import Item from "../item";
import FlagUtil from "../../utils/flagUtil";
import {EnhancementD, EnhancementChanceTable, WeaponsList} from "../../types/types";
import ItemGenCommon from "./itemGenCommon";
import EffectUtil from "../../effect/effectUtil";
import SOURCE_TYPE = GlobalConst.SOURCE_TYPE;

/**
 * Generates weapons.
 *
 * Singleton! Shared across all servers,
 * static values only.
 */
export default class WeaponFactory {
    private static _instance: WeaponFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    base_weapons_list: WeaponsList = {
        // each item_type has a list of individual items of that type (e.g. short sword, cutlass, long sword, etc), with the data needed to construct an instance of that item
        spear: [],
        sword: [],
        hammer: [],
        bow: [],
        wand: [],
        dagger: [],
        axe: [],
        staff: [],
    };

    weapon_enhancement_list: GlobalConst.ITEM_ENHANCEMENTS[];
    wand_enhancement_list: GlobalConst.ITEM_ENHANCEMENTS[];
    staff_enhancement_list: GlobalConst.ITEM_ENHANCEMENTS[];

    enhancement_chance: EnhancementChanceTable = {
        n: [0, 0],
        c: [0, 0],
        u: [40, 0], // 40% chance of 1 enhancement, 0% chance of 2nd
        r: [60, 5],
        e: [90, 25],
        l: [100, 60, 10],
    };

    constructor() {
        this.LoadWeaponsFromCSV(); // Initialize list of base weapons

        // initialize Enhancements List
        this.InitializeEnhancementLists();
    }

    private CreateWeapon(game: Game, kind: GlobalConst.ITEM_BASE_TYPE, rarity: GlobalConst.RARITY, cr: number): Item {
        let item: Item = new Item(game);
        item.slot = GlobalConst.EQUIPMENT_SLOT.WEAPON;
        item.cname = "Item";
        item.rarity = rarity;
        item.cr = cr;
        item.kind = kind;
        item.baseType = kind; //redundancy, probably ok? TBD if we can lose baseType
        item.ascii = ItemGenCommon.GetASCIIbyType(item.baseType);
        return item;
    }

    private AddBasicDamageAttack(
        game: Game,
        w: Item,
        damType: GlobalConst.DAMAGE_TYPES,
        min: number,
        max: number,
        range: number = 1,
    ): Item {
        let eff = new Effect(game);
        eff.type = GlobalConst.EFFECT_TYPES.DAMAGE;
        eff.amount_base = min;
        eff.amount_max = max;
        eff.trigger = GlobalConst.EFFECT_TRIGGERS.HIT;
        if (!damType) {
            console.error(
                "Dam type missing for primary attack on " +
                w.name +
                ", check csv data for mismatch. Defaulting to blade instead.",
            );
            damType = GlobalConst.DAMAGE_TYPES.BLADE;
        }
        eff.damage_type = damType;
        eff.range = range;
        eff.source = EffectUtil.CreateSource(SOURCE_TYPE.TEMPORARY, w.id);
        w.effects.push(eff);
        return w;
    }

    private AddConditionOnHit(
        game: Game,
        w: Item,
        condition: GlobalConst.CONDITION,
        turns: number,
        chance?: number,
    ): Item {
        let eff = new Effect(game);
        eff.type = GlobalConst.EFFECT_TYPES.GIVES_CONDITION;
        eff.condition = condition;
        eff.turns = turns;
        eff.chance = chance;
        eff.trigger = GlobalConst.EFFECT_TRIGGERS.HIT;
        eff.range = 1;
        eff.source = EffectUtil.CreateSource(SOURCE_TYPE.TEMPORARY, -1);
        w.effects.push(eff);
        return w;
    }

    private LoadWeaponsFromCSV() {
        // loads all of the base weapon data from CSV into an array in memory
        let weapon_csv: string[] = ArrayUtil.TextFileToArray("/item/data/weapon.csv", true);
        weapon_csv.forEach((weapon_csv_line) => {
            let weapon_data: string[];
            weapon_data = weapon_csv_line.split(",");
            let weapon_type = weapon_data[0] as GlobalConst.WEAPON_BASE_TYPE;
            try {
                this.base_weapons_list[weapon_type].push(weapon_csv_line);
            } catch (e: any) {
                console.error(
                    e,
                    "Error parsing item list from data, check the specified item type matches the format in globalConst base_item_types",
                );
            }
        });
    }

    private CreateBaseWeaponFromCSV(game: Game, weapon_type: GlobalConst.WEAPON_BASE_TYPE, cr: number): Item {
        // loads data values from CSV, format is weapon type, name, min damage,	max damage,	damage type,	two-handed?,	range, recharge time,crit bonus,block bonus,	min CR
        // [0] type
        // [1] name
        // [2] min damage -- not used on wands
        // [3] max damage -- not used on wands
        // [4] damage type
        // [5] two-handed (bool)
        // [6] range
        // [7] recharge time
        // [8] crit bonus
        // [9] block bonus
        // [10] min CR
        // [11] stat affinity (br, ag, sp) -- currently unused

        let weapon_data: string[];

        // respect min cr
        let min_cr: number = 10; // just setting higher than actual range

        while (cr <= min_cr) {
            let weapon_csv_line: string = RandomUtil.instance.fromArray(this.base_weapons_list[weapon_type]);
            weapon_data = weapon_csv_line.split(",");
            min_cr = parseInt(weapon_data[10]);
        }
        // okay now create the weapon
        let new_weapon = this.CreateWeapon(game, weapon_type, GlobalConst.RARITY.COMMON, 0);
        new_weapon.cr = cr;
        new_weapon.nameBase = weapon_data[1];

        let range = 1;
        if (weapon_data[6] != undefined && parseInt(weapon_data[6]) > 1) {
            range = parseInt(weapon_data[6]);
        }

        // if it's a wand, get a special automatically in place of standard attack
        if (new_weapon.baseType == GlobalConst.ITEM_BASE_TYPE.WAND) {
            ItemGenCommon.AddRandomEnhancement(new_weapon, this.wand_enhancement_list);
        } else {
            this.AddBasicDamageAttack(
                game,
                new_weapon,
                weapon_data[4] as GlobalConst.DAMAGE_TYPES,
                // GlobalConst.DAMAGE_TYPES[weapon_data[4]],
                parseInt(weapon_data[2]),
                parseInt(weapon_data[3]),
                range,
            );
        }

        // if it's a staff, add chance effect
        if (new_weapon.baseType == GlobalConst.ITEM_BASE_TYPE.STAFF) {
            ItemGenCommon.AddRandomEnhancement(new_weapon, this.staff_enhancement_list);
        }

        if (weapon_data[5] != undefined && weapon_data[5].toLowerCase().trim() == "true") {
            //console.log("TWO HANDED ITEM DETECTED");
            new_weapon.itemFlags = FlagUtil.Set(new_weapon.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED);
        }

        if (weapon_data[8] != undefined && parseInt(weapon_data[8]) != 0) {
            new_weapon.AddNewEffect(
                // add crit bonus on equip effect
                GlobalConst.EFFECT_TYPES.CRIT,
                GlobalConst.EFFECT_TRIGGERS.EQUIP,
                parseInt(weapon_data[8]),
            );
        }

        if (weapon_data[9] != undefined && parseInt(weapon_data[9]) != 0) {
            new_weapon.AddNewEffect(
                // add block bonus on equip effect
                GlobalConst.EFFECT_TYPES.BLOCK,
                GlobalConst.EFFECT_TRIGGERS.EQUIP,
                parseInt(weapon_data[9]),
            );
        }
        return new_weapon;
    }

    private ScaleWeaponToRarity(my_weapon: Item, rarity: GlobalConst.RARITY): Item {
        // First set rarity on item (Cr should already be set!)
        my_weapon.rarity = rarity;
        // For now, just multiply damage by a scale factor based on rarity [starter item, uncommon, rare, epic, legendary]

        let scaleFactors = [0.75, 1, 1.4, 1.8, 2.2, 2.6, 3];
        let scale_base = Math.round((GameUtil.GetRarityNumeric(rarity)) / 1.5 + (my_weapon.cr / 1.5));
        if (scale_base > 6) scale_base = 6;
        let my_scale: number = Math.max(scale_base, 0); // don't let this fall below 0!

        // console.log(my_scale + " SCALE FACTOR: " + scaleFactors[my_scale] + " for rarity " + rarity + " and CR " + my_weapon.cr + "")
        // First get the effect to scale -- just grabs first Damage effect for now
        let my_damage_eff = my_weapon.GetFirstEffectByType(GlobalConst.EFFECT_TYPES.DAMAGE);

        my_damage_eff.amount_base = Math.round(my_damage_eff.amount_base * scaleFactors[my_scale]);
        my_damage_eff.amount_max = Math.round(my_damage_eff.amount_max * scaleFactors[my_scale]);

        // Cooldown for ranged/magic items

        // TODO this is using the item.cooldown attribute; should use individual effect instead?
        if (my_weapon.cooldown > 1) {
            my_weapon.cooldown = Math.round(my_weapon.cooldown / scaleFactors[my_scale]);
        }

        // set special power enhancements
        // currently this rolls independently for each chance, so if you have a chance at a 2nd enhancement, but fail the first, you might still get one in
        // the 2nd try... Easy to change if we want

        this.enhancement_chance[rarity].forEach((chance) => {
            if (RandomUtil.instance.percentChance(chance)) {
                // if roll succeeds, add enhancement
                ItemGenCommon.AddRandomEnhancement(my_weapon, this.weapon_enhancement_list);
            }
        });

        // if legendary, assign a name
        if (rarity == GlobalConst.RARITY.LEGENDARY) {
            ItemGenCommon.AssignLegendaryName(my_weapon);
        } else {
            const descriptors: string[][] = [];
            descriptors[0] = ["Cracked", "Busted", "Rusty"];
            descriptors[1] = [];
            descriptors[2] = ["Fine", "Quality"];
            descriptors[3] = ["Exquisite", "Artisinal"];
            descriptors[4] = [];
            if (descriptors[GameUtil.GetRarityNumeric(my_weapon.rarity)].length > 0) {
                my_weapon.namePre = RandomUtil.instance.fromArray(
                    descriptors[GameUtil.GetRarityNumeric(my_weapon.rarity)],
                );
            }
        }

        // console.log(my_weapon);
        ItemGenCommon.UpdateValue(my_weapon);

        return my_weapon;
    }

    //Used by character to generate temporary fist item for unarmed attacks
    CreateFist(game: Game): Item {
        let w: Item;
        // Skill Check, Gargoyle's Fists - id 20
        if (game.dungeon.character.skillIds.includes(20)) {
            w = this.CreateWeapon(game, GlobalConst.ITEM_BASE_TYPE.HAMMER, GlobalConst.RARITY.RARE, 1);
            w.nameBase = "Gargolye's Fist";
            this.AddBasicDamageAttack(game, w, GlobalConst.DAMAGE_TYPES.BLUDGEON, 15, 25);

            // Gargoyle's Strike  - id 33 (requires Gargoyle's fists)
            if (game.dungeon.character.skillIds.includes(33)) {
                const skill = GameUtil.GetSkillById(33);
                // ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.COND_STUN, w);
                let eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.GIVES_CONDITION;
                eff.condition = GlobalConst.CONDITION.STUNNED;
                eff.chance = skill.modifiers.custom;
                eff.turns = 3;
                eff.trigger = GlobalConst.EFFECT_TRIGGERS.HIT;
            }
        } else {
            w = this.CreateWeapon(game, GlobalConst.ITEM_BASE_TYPE.HAMMER, GlobalConst.RARITY.COMMON, 1);
            w.nameBase = "Fist";
            this.AddBasicDamageAttack(game, w, GlobalConst.DAMAGE_TYPES.BLUDGEON, 1, 5);
        }
        return w;
    }

    CreateRandomWeapon(
        game: Game,
        rarity: GlobalConst.RARITY,
        cr: number,
        weapon_type?: GlobalConst.WEAPON_BASE_TYPE,
    ): Item {
        // if weapon type is unspecified, chose randomly

        if (weapon_type === undefined) {
            weapon_type = RandomUtil.instance.fromEnum(GlobalConst.WEAPON_BASE_TYPE);
        }
        let w: Item = this.CreateBaseWeaponFromCSV(game, weapon_type, cr);
        // now, scale weapon to level/cr
        w = this.ScaleWeaponToRarity(w, rarity);
        return w;
    }

    private InitializeEnhancementLists() {
        // Can further break these down to specify by rarity, or can just set min_rarity and/or min_cr in enhancement definitions in enhancements.ts
        this.weapon_enhancement_list = [
            GlobalConst.ITEM_ENHANCEMENTS.BRAWN,
            GlobalConst.ITEM_ENHANCEMENTS.AGILITY,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT,
            GlobalConst.ITEM_ENHANCEMENTS.CRIT,
            GlobalConst.ITEM_ENHANCEMENTS.DODGE,
            GlobalConst.ITEM_ENHANCEMENTS.WEAPON_BLOCK,
            GlobalConst.ITEM_ENHANCEMENTS.WEAPON_DEFENSE,
            GlobalConst.ITEM_ENHANCEMENTS.DAMAGE_FIRE,
            GlobalConst.ITEM_ENHANCEMENTS.DAMAGE_COLD,
            GlobalConst.ITEM_ENHANCEMENTS.DAMAGE_DIVINE,
            GlobalConst.ITEM_ENHANCEMENTS.DAMAGE_ELECTRIC,
            GlobalConst.ITEM_ENHANCEMENTS.DAMAGE_DIVINE_PLUS,
            GlobalConst.ITEM_ENHANCEMENTS.COND_DISEASE,
            GlobalConst.ITEM_ENHANCEMENTS.COND_POISON,
            GlobalConst.ITEM_ENHANCEMENTS.COND_STUN,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_BEAST,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_DEEPONE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_DEMON,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_FEY,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_HUMANOID,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_MYTHIC,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_OOZE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_UNDEAD,
        ];

        this.wand_enhancement_list = [
            GlobalConst.ITEM_ENHANCEMENTS.BEAM_ELECTRIC,
            GlobalConst.ITEM_ENHANCEMENTS.BEAM_COLD,
            GlobalConst.ITEM_ENHANCEMENTS.RANGED_ARCANE,
            GlobalConst.ITEM_ENHANCEMENTS.RANGED_NECROTIC,
            GlobalConst.ITEM_ENHANCEMENTS.RANGED_FIRE,
        ];

        this.staff_enhancement_list = [
            GlobalConst.ITEM_ENHANCEMENTS.STAFF_BLUDGEON,
            GlobalConst.ITEM_ENHANCEMENTS.STAFF_ELECTRIC,
            GlobalConst.ITEM_ENHANCEMENTS.STAFF_DISEASE,
        ];
    }

    //Temp functions for creating a specific test weapon.
    CreateDebugWeapon(game: Game) {
        let w: Item = this.CreateBaseWeaponFromCSV(game, GlobalConst.WEAPON_BASE_TYPE.BOW, 1);
        this.AddBasicDamageAttack(game, w, GlobalConst.DAMAGE_TYPES.FIRE, 2, 2, w.GetRange()); //test add fire damage
        this.AddConditionOnHit(game, w, GlobalConst.CONDITION.POISONED, 3, 100); //99% chance of poison for 3 turrns
        this.ScaleWeaponToRarity(w, GlobalConst.RARITY.COMMON);
        // ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.SLAY_HUMANOID, w);
        return w;
    }

    CreateDebugWeapon2(game: Game) {
        let w: Item = this.CreateBaseWeaponFromCSV(game, GlobalConst.WEAPON_BASE_TYPE.SWORD, 1);
        this.ScaleWeaponToRarity(w, GlobalConst.RARITY.RARE);
        return w;
    }
}
