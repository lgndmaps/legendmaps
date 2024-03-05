import type Game from "../../game";
import GlobalConst from "../../types/globalConst";
import RandomUtil from "../../utils/randomUtil";
import GameUtil from "../../utils/gameUtil";
import Item from "../item";
import { EnhancementD } from "../../types/types";
import WeaponFactory from "./weaponFactory";
import ArmorFactory from "./armorFactory";
import ConsumableFactory from "./consumableFactory";
import TreasureFactory from "./treasureFactory";
import JewelryFactory from "./jewelryFactory";
import StringUtil from "../../utils/stringUtil";
import NameGen from "../../utils/namegen";
import type Entity from "../../base_classes/entity";
import type StoryEvent from "../../story/storyEvent";
import StoryEventFactory from "../../story/storyEventFactory";
import MathUtil from "../../utils/mathUtil";
import { Enhancements } from "../data/enhancements";
import Effect from "../../effect/effect";
import FlagUtil from "../../utils/flagUtil";

export default class ItemGenCommon {
    // shared functions between ItemFactories

    static GetRandomRarityByCR(cr: number): GlobalConst.RARITY {
        const maxRarityByCR: number[] = [1, 2, 2, 3, 3, 4]; // starts at 0, though there are no maps of CR 0
        cr = MathUtil.clamp(cr, 0, 5); //safety because dweller level getting passed in
        let randomRarity: GlobalConst.RARITY = GameUtil.GetRarityFromNumber(
            RandomUtil.instance.int(1, maxRarityByCR[cr]),
        );
        return randomRarity;
    }

    static GetRandomRarity(): GlobalConst.RARITY {
        let randomRarity: GlobalConst.RARITY = GameUtil.GetRarityFromNumber(RandomUtil.instance.int(1, 4));
        return randomRarity;
    }

    static GenerateRandomItem(game: Game, cr: number, rarity?: GlobalConst.RARITY): Item {
        if (!rarity) {
            rarity = this.GetRandomRarityByCR(cr);
        }
        let item_type: GlobalConst.ITEM_BASE_TYPE = RandomUtil.instance.fromEnum(GlobalConst.ITEM_BASE_TYPE);

        return this.GenerateItem(game, item_type, rarity, cr);
    }

    static GenerateItem(
        game: Game,
        base_type: GlobalConst.ITEM_BASE_TYPE,
        rarity: GlobalConst.RARITY,
        cr: number,
    ): Item {
        base_type = this.ParseType(base_type);

        let new_item: Item;
        if (Object.values(GlobalConst.WEAPON_BASE_TYPE).includes(base_type as GlobalConst.WEAPON_BASE_TYPE)) {
            // weapons
            new_item = WeaponFactory.instance.CreateRandomWeapon(
                game,
                rarity,
                cr,
                base_type as GlobalConst.WEAPON_BASE_TYPE,
            );
        } else if (Object.values(GlobalConst.ARMOR_BASE_TYPE).includes(base_type as GlobalConst.ARMOR_BASE_TYPE)) {
            // armor
            new_item = ArmorFactory.instance.CreateRandomArmor(
                game,
                rarity,
                cr,
                base_type as GlobalConst.ARMOR_BASE_TYPE,
            );
        } else if (Object.values(GlobalConst.JEWELRY_BASE_TYPE).includes(base_type as GlobalConst.JEWELRY_BASE_TYPE)) {
            // jewelry
            new_item = JewelryFactory.instance.CreateRandomJewelry(
                game,
                rarity,
                cr,
                base_type as GlobalConst.JEWELRY_BASE_TYPE,
            );
        } else if (base_type == GlobalConst.ITEM_BASE_TYPE.POTION) {
            // potion
            new_item = ConsumableFactory.instance.CreateRandomPotion(game, rarity, cr);
        } else if (base_type == GlobalConst.ITEM_BASE_TYPE.FOOD) {
            // food
            new_item = ConsumableFactory.instance.CreateRandomFood(game, rarity, cr);
        } else if (base_type == GlobalConst.ITEM_BASE_TYPE.SCROLL) {
            // scroll
            new_item = ConsumableFactory.instance.CreateRandomScroll(game, rarity, cr);
        } else if (
            Object.values(GlobalConst.TREASURE_BASE_TYPE).includes(base_type as GlobalConst.TREASURE_BASE_TYPE)
        ) {
            new_item = TreasureFactory.instance.CreateRandomTreasure(
                game,
                rarity,
                cr,
                base_type as GlobalConst.TREASURE_BASE_TYPE,
            );
        } else {
            console.log("Couldn't make an item of type " + base_type);
        }
        if (new_item) {
            //console.log("Generated " + new_item.name);
        }
        return new_item;
    }

    static GenerateChest(game: Game): StoryEvent {
        let chestType = GlobalConst.STORY_EVENT_KEYS.BASIC_CHEST;
        if (RandomUtil.instance.percentChance(20)) {
            chestType = GlobalConst.STORY_EVENT_KEYS.ADV_CHEST;
        }

        let se: StoryEvent = StoryEventFactory.instance.CreateStoryEvent(game, chestType);
        return se;
    }

    static ParseType(str: string): GlobalConst.ITEM_BASE_TYPE {
        let base_type: GlobalConst.ITEM_BASE_TYPE;
        // clean up the type data from the nft maps, probably a bunch more to catch
        if (str == "heavy armor") base_type = GlobalConst.ITEM_BASE_TYPE.ARMOR_HEAVY;
        else if (str == "light armor") base_type = GlobalConst.ITEM_BASE_TYPE.ARMOR_LIGHT;
        else if (str == "coin bag") base_type = GlobalConst.ITEM_BASE_TYPE.COINBAG;
        else base_type = str as GlobalConst.ITEM_BASE_TYPE;
        return base_type;
    }

    static AddEnhancementById(id: GlobalConst.ITEM_ENHANCEMENTS, item: Item) {
        let enhancement: EnhancementD = this.GetEnhancementDById(id);
        if (enhancement != undefined) {
            this.AddEnhancement(enhancement, item);
        } else {
            throw new Error("Unable to add enhancement with id: " + id + " to item: " + item.name);
        }
    }

    static GetEnhancementDById(id: GlobalConst.ITEM_ENHANCEMENTS): EnhancementD {
        let enhancement = Enhancements.find((obj) => {
            return obj.id == id;
        });
        if (enhancement != undefined && Object.keys(enhancement).length > 0) {
            return Object.assign({}, enhancement);
        } else {
            throw new Error("Can't find an enhancement with id: " + id);
        }
    }

    static AddRandomEnhancement(item: Item, list: GlobalConst.ITEM_ENHANCEMENTS[]) {
        // confirm the item type is eligible, and min CR is met, or else roll again
        let type_checker: GlobalConst.ITEM_BASE_TYPE = undefined;
        let enhancement_mincr = 10;
        let enhancement_minrarity = 10;
        let enhancement: EnhancementD;

        let sanity = 200;
        while (
            sanity > 0 &&
            (type_checker != item.baseType ||
                item.cr < enhancement_mincr ||
                GameUtil.GetRarityNumeric(item.rarity) < enhancement_minrarity)
        ) {
            sanity--;
            let enhancement_id = RandomUtil.instance.fromArray(list);
            enhancement = this.GetEnhancementDById(enhancement_id);
            if (!enhancement) continue;

            enhancement_mincr = enhancement.min_cr ? enhancement.min_cr : 0;
            enhancement_minrarity = enhancement.min_rarity ? enhancement.min_rarity : 0;

            if (enhancement_mincr > item.cr) {
                //console.log("item cr too low for enhancement: " + enhancement.id);
                continue;
            }

            if (enhancement_minrarity > GameUtil.GetRarityNumeric(item.rarity)) {
                //console.log("item rarity too low for enhancement: " + enhancement.id);
                continue;
            }

            if (enhancement.item_type == undefined) {
                // if there's no constraint set on the enhancement, we can proceed
                type_checker = item.baseType;
            } else {
                type_checker = enhancement.item_type;
            }
        }
        if (sanity > 0) {
            ItemGenCommon.AddEnhancement(enhancement, item);
        } else {
            console.log("ENHANCEMENT ADD FAILED");
        }
    }

    static UpdateItemName(enhancement: EnhancementD, item: Item): Item {
        //  Update the item name, only if non-legendary weapon or armor
        if (item.rarity == GlobalConst.RARITY.LEGENDARY && (item.isArmor() || item.isWeapon())) {
            return item;
        } else {
            // usually a basename isn't changed, but in some cases (e.g. "elixir" for potions) it can be
            if (enhancement.basename) {
                item.nameBase = enhancement.basename;
            }

            // for potions, use both pre and post
            // if (item.baseType == GlobalConst.ITEM_BASE_TYPE.POTION) {
            //     if (item.namePost == "" || item.namePost == undefined) {
            //         if (enhancement.post) item.namePost = enhancement.post;
            //     }
            //     if (item.namePre == "" || item.namePre == undefined) {
            //         if (enhancement.pre) item.namePre = enhancement.pre;
            //     }

            // If namePost is free, use that
            if (item.namePost == "" || undefined) {
                item.namePost = enhancement.post!;
            } else {
                // or else, try the prefix
                // clear the default 'embellishment' prefix if it's there (e.g. "Exquisite")
                if (item.effects.length == 0) item.namePre = "";

                if (item.namePre == "" || undefined) {
                    item.namePre = enhancement.pre!;
                } else {
                    // Name is getting too long, a new Artifact is formed!!
                    this.AssignLegendaryName(item);
                    //
                }
            }
        }
        return item;
    }

    static AddEnhancement(enhancement: EnhancementD, item: Item) {
        // update the item name
        this.UpdateItemName(enhancement, item);

        // now parse the data to figure out the right values for the effect
        // default trigger is EQUIP
        enhancement.trigger = enhancement.trigger ? enhancement.trigger : GlobalConst.EFFECT_TRIGGERS.EQUIP;

        // set base amounts, using defaults if none specified
        // these defaults shouldn't end up being used
        let default_base_amount = [1, 1, 1, 1, 1];
        let default_max_amount = [3, 3, 3, 3, 3];
        enhancement.base_amount = enhancement.base_amount ? enhancement.base_amount : default_base_amount;
        enhancement.max_amount = enhancement.max_amount ? enhancement.max_amount : default_max_amount;

        // // scale those amounts based on cr/rarity -- TODO probably need to redo scaling, this is kind of a mess
        // enhancement.base_amount += Math.floor((GameUtil.GetRarityNumeric(item.rarity) + item.cr) / 2); // add to base amount a scaling bonus .5 * (rarity + cr) (range of 0 - 4)
        // enhancement.max_amount += GameUtil.GetRarityNumeric(item.rarity) + item.cr; // add to max amt scaling bonus of rarity + cr (range of 1 to 9)
        // enhancement.bonus_dam_percent *= Math.floor((GameUtil.GetRarityNumeric(item.rarity) + item.cr + 1) / 2); // multiply by scaling bonus .5 * (rarity + cr) (range of 1 - 5)

        // scaling via rarity
        const scalingIndex = GameUtil.GetRarityNumeric(item.rarity); // TODO consider incorporating CR somehow

        let scaled_base_amount = null;
        let scaled_max_amount = null;
        let scaled_turns = null;
        let scaled_bonus_dam_pct = null;
        let scaled_chance = null;
        let scaled_cooldown = null;

        if (enhancement.base_amount) scaled_base_amount = enhancement.base_amount[scalingIndex];
        if (enhancement.max_amount) scaled_max_amount = enhancement.max_amount[scalingIndex];
        if (enhancement.turns) scaled_turns = enhancement.turns[scalingIndex];
        if (enhancement.bonus_dam_percent) scaled_bonus_dam_pct = enhancement.bonus_dam_percent[scalingIndex];
        if (enhancement.chance) scaled_chance = enhancement.chance[scalingIndex];
        if (enhancement.cooldown) scaled_cooldown = enhancement.cooldown[scalingIndex];

        // now apply multiplier
        // if (enhancement.scaling_multiplier) {
        //     enhancement.base_amount = Math.max(Math.round(enhancement.base_amount * enhancement.scaling_multiplier), 1); // make sure it's at least 1
        //     enhancement.max_amount = Math.max(Math.round(enhancement.max_amount * enhancement.scaling_multiplier), 2); // make sure it's at least 2
        // }

        // if it's a condition effect, use the special method:
        if (enhancement.type == GlobalConst.EFFECT_TYPES.GIVES_CONDITION) {
            // for EQUIP triggers (e.g. armor, jewelry), source type is EQUIPMENT, for USE and HIT (and other) triggers (e.g. potions, scrolls), source type is TEMPORARY
            let source_type: GlobalConst.SOURCE_TYPE;
            if (enhancement.trigger == GlobalConst.EFFECT_TRIGGERS.EQUIP) {
                source_type = GlobalConst.SOURCE_TYPE.EQUIPMENT;
                scaled_turns = -1;
            } else {
                source_type = GlobalConst.SOURCE_TYPE.TEMPORARY;
                GlobalConst.EFFECT_TRIGGERS.TIMED;
            }

            item.AddCondition(
                enhancement.condition,
                enhancement.trigger,
                source_type,
                item.id,
                scaled_turns,
                scaled_chance,
            );
        } else {
            // or else add the effect
            let new_eff = item.AddNewEffect(
                enhancement.type!,
                enhancement.trigger,
                scaled_base_amount,
                scaled_max_amount,
            );
            new_eff.chance = scaled_chance;
            new_eff.cooldown = scaled_cooldown;
            new_eff.range = enhancement.range;
            new_eff.aoe = enhancement.aoe;
            new_eff.damage_type = enhancement.dam_type;
            new_eff.turns = scaled_turns;
            new_eff.bonus_dam_percent = scaled_bonus_dam_pct;
            new_eff.bonus_dam_dweller_type = enhancement.bonus_dam_dweller_type;
            new_eff.condition = enhancement.condition;
            new_eff.name = enhancement.spell; // TODO why doesn't spell have its own field in Effect? Seems crazy to use name, what was I thinking?

            if (enhancement.itemFlags != undefined && enhancement.itemFlags != 0) {
                if (item.itemFlags != undefined && item.itemFlags != 0) {
                    console.log("Warning: enhancement is overriding existing item flags");
                }
                item.itemFlags = enhancement.itemFlags;
            }

            // console.log(
            //     `Added enhancement ${enhancement.type}, amount: ${new_eff.amount_base} (${enhancement.base_amount} - ${enhancement.max_amount} range) to ${item.name}`,
            // );
        }
        ItemGenCommon.UpdateValue(item);
    }

    static AssignLegendaryName(item: Item) {
        item.namePre = StringUtil.titleCase(new NameGen.Generator(NameGen.MIDDLE_EARTH).toString()) + ", Legendary";
        item.namePost = "";
    }

    static EnchantItem(item: Item, bonus: number) {
        // todo complain if item isn't eligible -- only weapons and armor can be enchanted
        if (item.isWeapon()) {
            item.AddNewEffect(GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER, GlobalConst.EFFECT_TRIGGERS.EQUIP, bonus);
            item.AddNewEffect(GlobalConst.EFFECT_TYPES.TOHIT, GlobalConst.EFFECT_TRIGGERS.EQUIP, bonus);
        } else if (item.isArmor()) {
            item.AddNewEffect(GlobalConst.EFFECT_TYPES.DEFENSE, GlobalConst.EFFECT_TRIGGERS.EQUIP, bonus);
        }
        if (item.rarity != GlobalConst.RARITY.LEGENDARY) item.namePre = "Enchanted";
        ItemGenCommon.UpdateValue(item);
    }

    static UpdateValue(item: Item) {
        // SET BASE
        let val: number = 100;

        // Scale for rarity & CR
        let scaleFactors = [0.25, 1, 1.35, 1.75, 2, 3, 4];
        let my_scale: number = Math.max(GameUtil.GetRarityNumeric(item.rarity) + Math.floor(item.cr / 2), 0); // don't let this fall below 0!
        val *= scaleFactors[my_scale];

        // Factor in effect/enhancements
        // // TODO make this much more nuanced
        // val += item.effects.length * 200;

        // for weapons, use average damage, and factor in range
        // if (item.isWeapon) {
        //     let damEff = item.GetFirstEffectByType(GlobalConst.EFFECT_TYPES.DAMAGE);
        //     let avgDam: number = (damEff.amount_base + damEff.amount_max) / 2;
        //     val += avgDam * 10;
        //     val += damEff.range * 25;
        // }

        // evaluate effects
        for (let eff of item.effects) {
            switch (eff.type) {
                case GlobalConst.EFFECT_TYPES.BRAWN:
                case GlobalConst.EFFECT_TYPES.AGILITY:
                case GlobalConst.EFFECT_TYPES.GUILE:
                case GlobalConst.EFFECT_TYPES.SPIRIT:
                    val += 150 * eff.amount_base;
                    break;
                case GlobalConst.EFFECT_TYPES.DAMAGE:
                    let avgDam: number = (eff.amount_base + eff.amount_max) / 2;
                    val += avgDam * 10;
                    if (eff.range > 0) {
                        val += eff.range * 25;
                    }
                    break;
                case GlobalConst.EFFECT_TYPES.BLOCK:
                    val += eff.amount_base * 4;
                    break;
                case GlobalConst.EFFECT_TYPES.CRIT:
                    val += eff.amount_base * 15;
                    break;
                case GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER:
                    if (eff.amount_base > 0) {
                        val += eff.amount_base * 15;
                    }
                    if (eff.bonus_dam_percent > 0) {
                        val += eff.bonus_dam_percent * 3;
                    }
                    break;
                case GlobalConst.EFFECT_TYPES.DEBUGWIN:
                    val += 99999;
                    break;
                case GlobalConst.EFFECT_TYPES.DEFENSE:
                    val += eff.amount_base * 6;
                    break;
                case GlobalConst.EFFECT_TYPES.DODGE:
                    if (eff.amount_base > 0) {
                        val += eff.amount_base * 8;
                    } else {
                        val += eff.amount_base * 3;
                    }
                    break;
                case GlobalConst.EFFECT_TYPES.GIVES_CONDITION:
                    if (eff.trigger != GlobalConst.EFFECT_TRIGGERS.HIT) {
                        switch (eff.condition) {
                            case GlobalConst.CONDITION.HASTED:
                            case GlobalConst.CONDITION.REGEN:
                                val += 300;
                                break;
                            case GlobalConst.CONDITION.LUCKY:
                            case GlobalConst.CONDITION.INSIGHT:
                                val += 150;
                                break;
                            default:
                                break;
                        }
                    } else {
                        // these are weapon effects applied on hit
                        switch (eff.condition) {
                            case GlobalConst.CONDITION.BLEEDING:
                            case GlobalConst.CONDITION.BURNING:
                            case GlobalConst.CONDITION.CONFUSED:
                            case GlobalConst.CONDITION.DISEASED:
                            case GlobalConst.CONDITION.FREEZING:
                            case GlobalConst.CONDITION.HELD:
                            case GlobalConst.CONDITION.POISONED:
                            case GlobalConst.CONDITION.SLEPT:
                            case GlobalConst.CONDITION.STUNNED:
                            case GlobalConst.CONDITION.SLOWED:
                                val += 1000 * (eff.chance / 100);
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case GlobalConst.EFFECT_TYPES.HEAL:
                    val += 10 * eff.amount_base;
                    break;

                case GlobalConst.EFFECT_TYPES.HUNGER:
                    val += 8 * eff.amount_base;
                    break;
                case GlobalConst.EFFECT_TYPES.IMMUNE:
                case GlobalConst.EFFECT_TYPES.RESIST:
                    let tempValue = 150;
                    if (
                        eff.damage_type == GlobalConst.DAMAGE_TYPES.PIERCE ||
                        eff.damage_type == GlobalConst.DAMAGE_TYPES.BLADE
                    ) {
                        tempValue += 100;
                    }
                    if (eff.type == GlobalConst.EFFECT_TYPES.IMMUNE) tempValue *= 2;
                    val += tempValue;
                    break;

                case GlobalConst.EFFECT_TYPES.MAXHP:
                    val += eff.amount_base * 12;
                    break;

                case GlobalConst.EFFECT_TYPES.SPELL:
                    val += 200;
                    break;
                case GlobalConst.EFFECT_TYPES.TOHIT:
                    val += 4 * eff.amount_base;
                default:
                    val += 100;
                    break;
            }
        }

        // adjust for item type
        // if (item.kind == GlobalConst.ITEM_BASE_TYPE.POTION || item.kind == GlobalConst.ITEM_BASE_TYPE.SCROLL) {
        //     val *= 0.25;
        // } else if (item.kind == GlobalConst.ITEM_BASE_TYPE.FOOD) {
        //     val *= 0.125;
        // }

        // discount for consumable items
        if (item.uses > 0 && item.uses < 10) {
            val *= item.uses / 5;
        }

        // beam and AoE weapons are more valuable
        if (
            FlagUtil.IsSet(item.itemFlags, GlobalConst.ITEM_FLAGS.IS_BEAM) ||
            FlagUtil.IsSet(item.itemFlags, GlobalConst.ITEM_FLAGS.IS_AOE)
        ) {
            val *= 1.5;
        }

        // make sure the value is an int
        item.value = Math.round(val);
        // console.log("setting value of " + item.name + " to: " + item.value);
    }

    static GetASCIIbyType(item_type: GlobalConst.ITEM_BASE_TYPE): string {
        let ascii = new Map<GlobalConst.ITEM_BASE_TYPE, string>();
        ascii.set(GlobalConst.ITEM_BASE_TYPE.SWORD, "ƒ");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.DAGGER, "†");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.SPEAR, "‡");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.BOW, "}");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.AXE, "¶");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.HAMMER, "╤");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.WAND, "/");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.STAFF, "⌠");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.ARMOR_HEAVY, "[");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.ARMOR_LIGHT, "{");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.ROBES, "£");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.SHIELD, "]");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.BOOTS, "„");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.HELM, "Ω");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.HAT, "^");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.NECKLACE, "δ");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.WRIST, "≡");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.RING, "=");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.SCROLL, "?");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.POTION, "!");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.FOOD, "œ");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.COINS, "¢");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.COINBAG, "$");
        ascii.set(GlobalConst.ITEM_BASE_TYPE.GEM, "¤");
        // chest = "▄" -- need to add this as an item type
        ascii.set(GlobalConst.ITEM_BASE_TYPE.KEY, "⌐");

        let ascii_str = ascii.get(item_type);
        if (!ascii_str) {
            ascii_str = "";
            console.log("WARNING: returning blank ascii character for unknown item type " + item_type);
        }
        return ascii_str;
    }
}
