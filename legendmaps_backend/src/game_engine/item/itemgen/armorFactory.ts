import {isValidTimestamp} from "@firebase/util";
import {Console} from "console";
import {Intents} from "discord.js";
import Game from "../../game";
import GlobalConst from "../../types/globalConst";
import ArrayUtil from "../../utils/arrayUtil";
import GameUtil from "../../utils/gameUtil";
import MathUtil from "../../utils/mathUtil";
import RandomUtil from "../../utils/randomUtil";
import Effect from "../../effect/effect";
import Item from "../item";
import ItemGenCommon from "./itemGenCommon";
import {EnhancementD, EnhancementChanceTable, ArmorList} from "../../types/types";

/**
 * Generates armor items.
 *
 * Singleton! Shared across all servers,
 * static values only.
 */
export default class ArmorFactory {
    private static _instance: ArmorFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    base_armor_list: ArmorList = {
        // each item_type has a list of individual items of that type (e.g. short sword, cutlass, long sword, etc), with the data needed to construct an instance of that item
        boots: [],
        heavy: [],
        light: [],
        robes: [],
        shield: [],
        helm: [],
        hat: [],
    };

    armor_enhancement_list: GlobalConst.ITEM_ENHANCEMENTS[];
    clothing_enhancement_list: GlobalConst.ITEM_ENHANCEMENTS[];

    enhancement_chance: EnhancementChanceTable = {
        n: [0, 0],
        c: [0, 0],
        u: [25, 0], // 25% chance of 1 enhancement, 0% chance of 2nd
        r: [50, 0],
        e: [80, 25],
        l: [100, 50],
    };

    constructor() {
        this.LoadArmorsFromCSV(); // Initialize list of base weapons

        // initialize Enhancements List
        this.InitializeEnhancementList();
    }

    private CreateArmor(game: Game, kind: GlobalConst.ARMOR_BASE_TYPE, rarity: GlobalConst.RARITY, cr: number): Item {
        let item: Item = new Item(game);
        item.slot = Item.GetEquipSlotByType(kind as GlobalConst.ITEM_BASE_TYPE);
        item.cname = "Item";
        item.rarity = rarity;
        item.cr = cr;
        item.kind = kind;
        item.nameBase = "Armor";
        item.baseType = kind; //redundancy, probably ok? TBD if we can lose baseType
        item.ascii = ItemGenCommon.GetASCIIbyType(item.baseType);
        return item;
    }

    private LoadArmorsFromCSV() {
        // loads all of the base armor data from CSV into an array in memory
        let armor_csv: string[] = ArrayUtil.TextFileToArray("/item/data/armor.csv", true);
        armor_csv.forEach((csv_line) => {
            let item_data: string[];
            item_data = csv_line.split(",");
            let item_type = item_data[0] as GlobalConst.ARMOR_BASE_TYPE;
            try {
                this.base_armor_list[item_type].push(csv_line);
            } catch (e: any) {
                console.log(
                    e,
                    "Error parsing item list from data, check the specified item type matches the format in globalConst base_item_types",
                );
            }
        });
    }

    private CreateBaseArmorFromCSV(game: Game, armor_type: GlobalConst.ARMOR_BASE_TYPE, cr: number): Item {
        // loads data values from CSV, format is armor type, armor name, defense value, dodge bonus, block bonus, min CR
        // TODO doesn't respect min CR value yet

        // [0] type
        // [1] name
        // [2] def value
        // [3] dodge bonus
        // [4] block bonus
        // [5] min CR

        let armor_csv_line: string = RandomUtil.instance.fromArray(this.base_armor_list[armor_type]);
        let armor_data: string[] = armor_csv_line.split(",");
        let new_armor = this.CreateArmor(game, armor_type, GlobalConst.RARITY.COMMON, cr);
        new_armor.nameBase = armor_data[1];

        // add defense value
        new_armor.AddNewEffect(
            GlobalConst.EFFECT_TYPES.DEFENSE,
            GlobalConst.EFFECT_TRIGGERS.EQUIP,
            parseInt(armor_data[2]),
        );

        // add dodge bonus
        new_armor.AddNewEffect(
            GlobalConst.EFFECT_TYPES.DODGE,
            GlobalConst.EFFECT_TRIGGERS.EQUIP,
            parseInt(armor_data[3]),
        );

        // add block bonus
        new_armor.AddNewEffect(
            GlobalConst.EFFECT_TYPES.BLOCK,
            GlobalConst.EFFECT_TRIGGERS.EQUIP,
            parseInt(armor_data[4]),
        );

        return new_armor;
    }

    private ScaleArmorToRarity(item: Item, rarity: GlobalConst.RARITY, cr: number): Item {
        // First set rarity and CR values on item
        item.cr = cr;
        item.rarity = rarity;
        // For now, just multiply damage by a scale factor based on rarity [starter item, uncommon, rare, epic, legendary]

        let scaleFactors = [0.7, 1, 1.4, 1.8, 2.2, 2.6, 3];
        let scale_base = Math.round(GameUtil.GetRarityNumeric(rarity) / 1.5 + cr / 1.5);
        if (scale_base > 6) scale_base = 6;
        let my_scale: number = Math.max(scale_base, 0); // don't let this fall below 0!

        // Apply scaling multiplier
        // TODO this is scaling ALL effect. probably fine, but might want to constrain later.

        item.effects.forEach((eff) => {
            if (eff.amount_base > 0) {
                eff.amount_base = Math.round(eff.amount_base * scaleFactors[my_scale]);
            } else {
                eff.amount_base = Math.round(eff.amount_base / scaleFactors[my_scale]);
            }
        });

        // special stuff for different item types
        // robes get +spirit, maybe other\
        if (item.baseType == GlobalConst.ARMOR_BASE_TYPE.ROBES) {
            // add spirit bonus
            item.AddNewEffect(
                GlobalConst.EFFECT_TYPES.SPIRIT,
                GlobalConst.EFFECT_TRIGGERS.EQUIP,
                1,
                GameUtil.GetRarityNumeric(rarity),
            );

            // robes also get an extra chance at an enhancement
            if (RandomUtil.instance.percentChance(5 * GameUtil.GetRarityNumeric(rarity))) {
                ItemGenCommon.AddRandomEnhancement(
                    item,
                    this.armor_enhancement_list.concat(this.clothing_enhancement_list), // choose from any enhancement from the armor list or the clothing list
                ); // TODO probably do a separate robes enhancement list?
            }
        }

            // boots -- chance of "of Speed" enhancement
            // TODO, character speed not supported yet
            // else if (item.baseType == GlobalConst.ARMOR_BASE_TYPE.BOOTS) {
            //   let speedEnh: Enhancement = {
            //      pre: "Speedy",
            //      post: "Speed",
            //      type: GlobalConst.EFFECT_TYPES.Speed,
            //      base_amount: 1,
            //      max_amount: 1,
            //   };
            //     if (RandomUtil.instance.percentChance(3)) {
            //         ItemGenCommon.AddEnhancement(speedEnh, item);
            //     }
            // }

        // hats get special enhancements too
        else if (item.baseType == GlobalConst.ARMOR_BASE_TYPE.HAT) {
            ItemGenCommon.AddRandomEnhancement(item, this.clothing_enhancement_list);
        } else {
            // Add special power enhancements for other types not covered above (generally standard armor and shields now)
            // currently this rolls independently for each chance, so if you have a chance at a 2nd enhancement, but fail the first, you might still get one in
            // the 2nd try... Easy to change if we want

            this.enhancement_chance[rarity].forEach((chance) => {
                if (RandomUtil.instance.percentChance(chance)) {
                    // if roll succeeds, add enhancement
                    ItemGenCommon.AddRandomEnhancement(item, this.armor_enhancement_list);
                }
            });
        }

        // if legendary, assign a name
        if (rarity == GlobalConst.RARITY.LEGENDARY) {
            ItemGenCommon.AssignLegendaryName(item);
        } else {
            const descriptors: string[][] = [];

            descriptors[0] = ["Cracked", "Worn", "Tattered", "Patchwork"];
            descriptors[1] = [""];
            descriptors[2] = ["Fine", "Quality", "Well-made"];
            descriptors[3] = ["Exquisite", "Artisinal"];
            descriptors[4] = [""];
            item.namePre = RandomUtil.instance.fromArray(descriptors[GameUtil.GetRarityNumeric(item.rarity)]);
        }
        ItemGenCommon.UpdateValue(item);
        return item;
    }

    CreateRandomArmor(
        game: Game,
        rarity: GlobalConst.RARITY,
        cr: number,
        armor_type?: GlobalConst.ARMOR_BASE_TYPE,
    ): Item {
        // if item type is unspecified, chose randomly
        if (armor_type === undefined) {
            armor_type = RandomUtil.instance.fromEnum(GlobalConst.ARMOR_BASE_TYPE);
        }
        let w: Item = this.CreateBaseArmorFromCSV(game, armor_type, cr);
        // now, scale item to level/cr
        w = this.ScaleArmorToRarity(w, rarity, cr);

        return w;
    }

    private InitializeEnhancementList() {
        // TODO add weighting to this?
        this.armor_enhancement_list = [
            GlobalConst.ITEM_ENHANCEMENTS.BRAWN,
            GlobalConst.ITEM_ENHANCEMENTS.AGILITY,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT,
            GlobalConst.ITEM_ENHANCEMENTS.DODGE,
            GlobalConst.ITEM_ENHANCEMENTS.SHIELD_BLOCK,
            GlobalConst.ITEM_ENHANCEMENTS.DEFENSE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_ARCANE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_BLADE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_BLUDGEON,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_COLD,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_DIVINE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_ELECTRIC,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_FIRE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_NECROTIC,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_PIERCE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_POISON,
            GlobalConst.ITEM_ENHANCEMENTS.MAXHP,
            GlobalConst.ITEM_ENHANCEMENTS.TOHIT,
        ];

        this.clothing_enhancement_list = [
            GlobalConst.ITEM_ENHANCEMENTS.CRIT_CLOTHING,
            GlobalConst.ITEM_ENHANCEMENTS.TOHIT,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT_PLUS,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE_PLUS,
            GlobalConst.ITEM_ENHANCEMENTS.COND_LUCKY,
            GlobalConst.ITEM_ENHANCEMENTS.COND_INSIGHT,
        ];
    }
}
