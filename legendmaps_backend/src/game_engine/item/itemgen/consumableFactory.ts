import type Game from "../../game";
import GlobalConst from "../../types/globalConst";
import Effect from "../../effect/effect";
import Item from "../item";
import {EnhancementD, EnhancementChanceTable} from "../../types/types";
import ItemGenCommon from "./itemGenCommon";
import GameUtil from "../../utils/gameUtil";
import RandomUtil from "../../utils/randomUtil";
import StringUtil from "../../utils/stringUtil";
import FlagUtil from "../../utils/flagUtil";
import Spells from "../../effect/spells";

/**
 * Generates consumable items.
 *
 * Singleton! Shared across all servers,
 * static values only.
 */

// Potions, Scrolls, Food

// potions: healing, resistance, protection, speed, deadly blows, dodging, BAGS,
// scrolls: acquirement, teleportation, blink, mapping, enchant weapon, enchant armor
//

export default class ConsumableFactory {
    private static _instance: ConsumableFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    potions_list_lesser: GlobalConst.ITEM_ENHANCEMENTS[]; // rarity 0-2
    potions_list_greater: GlobalConst.ITEM_ENHANCEMENTS[]; // rarity 3-4
    food_list: GlobalConst.ITEM_ENHANCEMENTS[];

    enhancement_chance: EnhancementChanceTable = {
        n: [0, 0],
        c: [0, 0],
        u: [0, 0],
        r: [33, 0],
        e: [65, 0],
        l: [100, 0],
    };

    constructor() {
        // Initialize consumables enhancement lists
        this.InitializePotionsList();
        this.InitializeFoodList();
        // Scroll spells by Scroll rarity defined in CreateRandomScroll() below
    }

    private CreateConsumable(
        game: Game,
        kind: GlobalConst.CONSUMABLE_BASE_TYPE,
        rarity: GlobalConst.RARITY,
        cr: number,
        uses: number = 1,
        ascii?: string,
    ): Item {
        let item: Item = new Item(game);
        item.slot = Item.GetEquipSlotByType(kind as GlobalConst.ITEM_BASE_TYPE);
        item.cname = "Item";
        item.rarity = rarity;
        item.cr = cr;
        item.kind = kind;
        item.nameBase = "Consumable Item";
        item.baseType = kind; //redundancy, probably ok? TBD if we can lose baseType
        item.ascii = ascii || ItemGenCommon.GetASCIIbyType(item.baseType);
        item.uses = uses;
        return item;
    }

    CreateRandomFood(game: Game, rarity: GlobalConst.RARITY, cr: number): Item {
        let food: Item = this.CreateConsumable(game, GlobalConst.CONSUMABLE_BASE_TYPE.FOOD, rarity, cr);
        let foodNames: string[] = ["Moldy Bread", "Travel Rations", "Aged Cheddar", "Salted Beef", "Elven Biscuit"]; // TODO: something more robust
        food.nameBase = foodNames[GameUtil.GetRarityNumeric(rarity)];

        // add reduce hunger effect
        let hungerEff: Effect = food.AddNewEffect(
            GlobalConst.EFFECT_TYPES.HUNGER,
            GlobalConst.EFFECT_TRIGGERS.USE,
            5,
            10,
        );

        //scale hunger effect
        hungerEff.amount_base *= GameUtil.GetRarityNumeric(rarity) + 1;
        hungerEff.amount_max *= GameUtil.GetRarityNumeric(rarity) + 1;

        // add minor healing effect
        food.AddNewEffect(
            GlobalConst.EFFECT_TYPES.HEAL,
            GlobalConst.EFFECT_TRIGGERS.USE,
            4 + GameUtil.GetRarityNumeric(rarity) * 3,
            10 + GameUtil.GetRarityNumeric(rarity) * 5,
        );

        // TODO moldy bread can make you sick?

        // add extra enhancements?
        this.enhancement_chance[rarity].forEach((chance) => {
            if (RandomUtil.instance.percentChance(chance)) {
                // if roll succeeds, add enhancement
                ItemGenCommon.AddRandomEnhancement(food, this.food_list);
            }
        });

        ItemGenCommon.UpdateValue(food);
        return food;
    }

    CreateRandomPotion(game: Game, rarity: GlobalConst.RARITY, cr: number): Item {
        let potion: Item = this.CreateConsumable(game, GlobalConst.CONSUMABLE_BASE_TYPE.POTION, rarity, cr);
        potion.nameBase = "Potion";
        // cheat to force percentage to be healing potions
        const healing_pct: number = 15;
        const insight_pct: number = 10;
        if (RandomUtil.instance.percentChance(insight_pct)) {
            ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.COND_INSIGHT_CONSUMABLE, potion);
        } else if (RandomUtil.instance.percentChance(healing_pct)) {
            ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.HEALING, potion);
        } else {
            let potion_enhancements_list: GlobalConst.ITEM_ENHANCEMENTS[] =
                GameUtil.GetRarityNumeric(rarity) < 3 ? this.potions_list_lesser : this.potions_list_greater;
            ItemGenCommon.AddRandomEnhancement(potion, potion_enhancements_list);
        }
        return potion;
    }

    CreateTestDeathPotion(game: Game): Item {
        let potion: Item = this.CreateConsumable(
            game,
            GlobalConst.CONSUMABLE_BASE_TYPE.POTION,
            GlobalConst.RARITY.LEGENDARY,
            1,
        );
        let eff: Effect = potion.AddNewEffect(GlobalConst.EFFECT_TYPES.DAMAGE, GlobalConst.EFFECT_TRIGGERS.USE, 1000);
        eff.damage_type = GlobalConst.DAMAGE_TYPES.DIVINE;
        potion.nameBase = "Veektor's Potion of Instadeath";
        return potion;
    }

    CreateTestWinPotion(game: Game): Item {
        let potion: Item = this.CreateConsumable(
            game,
            GlobalConst.CONSUMABLE_BASE_TYPE.POTION,
            GlobalConst.RARITY.LEGENDARY,
            1,
        );
        let eff: Effect = potion.AddNewEffect(GlobalConst.EFFECT_TYPES.DEBUGWIN, GlobalConst.EFFECT_TRIGGERS.USE, 1);
        potion.nameBase = "Veektor's Victory Potion";
        return potion;
    }

    CreatePotionByEnhancementId(
        game: Game,
        rarity: GlobalConst.RARITY,
        cr: number,
        enhancementId: GlobalConst.ITEM_ENHANCEMENTS,
    ): Item {
        let potion: Item = this.CreateConsumable(game, GlobalConst.CONSUMABLE_BASE_TYPE.POTION, rarity, cr, 1, "!");
        potion.nameBase = "Potion";
        ItemGenCommon.AddEnhancementById(enhancementId, potion);
        return potion;
    }

    //AOE Scrolls are always Epic rarity
    CreateScrollAOE(game: Game, spell: GlobalConst.SPELLS, damType: GlobalConst.DAMAGE_TYPES, cr: number): Item {
        let scroll: Item = this.CreateConsumable(
            game,
            GlobalConst.CONSUMABLE_BASE_TYPE.SCROLL,
            GlobalConst.RARITY.EPIC,
            cr,
        );
        scroll.nameBase = "Scroll";
        scroll.namePost = "";
        //switch statement on GlobalConst.DAMAGE_TYPES
        scroll.namePost = Spells.GetAOENameByDamageType(damType);

        // special case, should find a nicer way to handle
        if (spell.startsWith("greater")) {
            scroll.namePre = "Greater";
            scroll.namePost = StringUtil.titleCase(spell.replace("greater ", ""));
        }
        let new_eff: Effect = scroll.AddNewEffect(GlobalConst.EFFECT_TYPES.SPELL, GlobalConst.EFFECT_TRIGGERS.USE, 0);
        new_eff.name = GlobalConst.SPELLS.AOE_DWELLER;
        new_eff.damage_type = damType;
        new_eff.amount_base = 10 + cr * 2;
        //always dweller targetted
        scroll.itemFlags = FlagUtil.Set(scroll.itemFlags, GlobalConst.ITEM_FLAGS.IS_DWELLER_TARGET);

        return scroll;
    }

    CreateScroll(game: Game, spell: GlobalConst.SPELLS, rarity?: GlobalConst.RARITY, cr?: number): Item {
        if (rarity == null) {
            rarity = GlobalConst.RARITY.UNCOMMON;
        }

        if (cr == null) {
            cr = game.data.map.cr;
        }
        let scroll: Item = this.CreateConsumable(game, GlobalConst.CONSUMABLE_BASE_TYPE.SCROLL, rarity, cr);
        scroll.nameBase = "Scroll";
        scroll.namePost = StringUtil.titleCase(spell);
        // special case, should find a nicer way to handle
        if (spell.startsWith("greater")) {
            scroll.namePre = "Greater";
            scroll.namePost = StringUtil.titleCase(spell.replace("greater ", ""));
        }

        let new_eff: Effect = scroll.AddNewEffect(GlobalConst.EFFECT_TYPES.SPELL, GlobalConst.EFFECT_TRIGGERS.USE, 0);
        new_eff.amount_base = cr + GameUtil.GetRarityNumeric(rarity); //hack, using amount_base to store spell power;
        new_eff.name = spell;
        if (Spells.SpellIsDwellerTargetted(spell)) {
            scroll.itemFlags = FlagUtil.Set(scroll.itemFlags, GlobalConst.ITEM_FLAGS.IS_DWELLER_TARGET);
        }
        console.log("SPELL TYPE: " + spell);
        return scroll;
    }

    CreateRandomScroll(game: Game, rarity: GlobalConst.RARITY, cr: number): Item {
        // TODO add rarity handling, e.g.
        // Uncommon - Blink, Magic Mapping, Satisfy Hunger
        // Rare - Teleport, Summon Dweller
        // Epic - Enchant Weapon, Enchant Armor
        // Legendary - Greater Enchant Weapon/Armor

        // totally random:
        // let spell: GlobalConst.SPELLS = RandomUtil.instance.fromEnum(GlobalConst.SPELLS);

        if (rarity == GlobalConst.RARITY.NONE) rarity = GlobalConst.RARITY.COMMON;

        let scrolls_list: { [key: number]: GlobalConst.SPELLS[] } = {};
        scrolls_list[0] = [GlobalConst.SPELLS.SUMMON_DWELLER];

        scrolls_list[1] = [
            GlobalConst.SPELLS.BLINK,
            GlobalConst.SPELLS.SUMMON_DWELLER,
            GlobalConst.SPELLS.SATISFY_HUNGER,
        ];
        scrolls_list[2] = [
            GlobalConst.SPELLS.ENCHANT_WEAPON,
            GlobalConst.SPELLS.ENCHANT_ARMOR,
            GlobalConst.SPELLS.MAPPING,
            GlobalConst.SPELLS.POISON_DWELLER,
        ];
        scrolls_list[3] = [GlobalConst.SPELLS.TELEPORT, GlobalConst.SPELLS.TELEPORT_DWELLER];

        scrolls_list[4] = [GlobalConst.SPELLS.GREATER_ENCHANT_WEAPON, GlobalConst.SPELLS.GREATER_ENCHANT_ARMOR];

        let spell = RandomUtil.instance.fromArray(scrolls_list[GameUtil.GetRarityNumeric(rarity)]);

        return this.CreateScroll(game, spell);
    }

    InitializeFoodList() {
        this.food_list = [
            GlobalConst.ITEM_ENHANCEMENTS.MAXHP_FOOD,
            GlobalConst.ITEM_ENHANCEMENTS.HEALING_FOOD,
            GlobalConst.ITEM_ENHANCEMENTS.COND_REGEN_FOOD,
        ];
    }

    a

    InitializePotionsList() {
        this.potions_list_lesser = [
            GlobalConst.ITEM_ENHANCEMENTS.HEALING,
            // GlobalConst.ITEM_ENHANCEMENTS.HEALING_MINOR,
            GlobalConst.ITEM_ENHANCEMENTS.COND_INSIGHT_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.COND_LUCKY_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.COND_REGEN_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.BRAWN_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.AGILITY_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_ARCANE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_BLADE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_BLUDGEON_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_COLD_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_DIVINE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_ELECTRIC_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_FIRE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_NECROTIC_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_PIERCE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.RESIST_POISON_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_BEAST_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_DEEPONE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_DEMON_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_FEY_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_HUMANOID_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_MYTHIC_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_OOZE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SLAY_UNDEAD_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.COND_HASTED_CONSUMABLE,
        ];
        this.potions_list_greater = [
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_ARCANE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_BLADE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_BLUDGEON_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_COLD_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_DIVINE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_ELECTRIC_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_FIRE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_NECROTIC_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_PIERCE_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.IMMUNE_POISON_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.HEALING,
            GlobalConst.ITEM_ENHANCEMENTS.HEALING_FULL,
            GlobalConst.ITEM_ENHANCEMENTS.CURE_ALL,
            // GlobalConst.ITEM_ENHANCEMENTS.HEALING_MAJOR,
            GlobalConst.ITEM_ENHANCEMENTS.COND_REGEN_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.BRAWN_PLUS_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.AGILITY_PLUS_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.SPIRIT_PLUS_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.GUILE_PLUS_CONSUMABLE,
            GlobalConst.ITEM_ENHANCEMENTS.COND_HASTED_CONSUMABLE,
        ];
    }
}
