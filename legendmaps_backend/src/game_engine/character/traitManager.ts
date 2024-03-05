import type Game from "../game";
// import Game from "../game";
import GlobalConst from "../types/globalConst";
import ArrayUtil from "../utils/arrayUtil";
import RandomUtil from "../utils/randomUtil";
import GameUtil from "../utils/gameUtil";
import Effect from "../effect/effect";
import Item from "../item/item";
import Character from "./character";
import TraitData from "./data/traitData.json";
import { gameRouter } from "../../services/game";
import EffectUtil from "../effect/effectUtil";
import WeaponFactory from "../item/itemgen/weaponFactory";
import ConsumableFactory from "../item/itemgen/consumableFactory";
import ArmorFactory from "../item/itemgen/armorFactory";
import JewelryFactory from "../item/itemgen/jewelryFactory";
import TreasureFactory from "../item/itemgen/treasureFactory";
import MapPos from "../utils/mapPos";
import GameMap from "../map/gameMap";
import Spells from "../effect/spells";
import ConditionManager from "../effect/conditionManager";

/**
 * Takes trait names and applies to Character on Character creation
 */
class TraitManager {
    private static _instance: TraitManager;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public alltraits: TraitManager.TraitInfo[];

    constructor() {
        this.alltraits = [];
        for (let i = 0; i < TraitData.traits.length; i++) {
            this.alltraits.push({
                id: TraitData.traits[i].id,
                name: TraitData.traits[i].trait,
                desc: TraitData.traits[i].desc,
            } as TraitManager.TraitInfo);
        }
    }

    GetTraitInfoByName(traitName: string): TraitManager.TraitInfo {
        for (let i = 0; i < TraitData.traits.length; i++) {
            if (this.alltraits[i].name.toLowerCase() == traitName.toLowerCase()) {
                return this.alltraits[i];
            }
        }
        throw new Error("NO TRAIT FOUND: " + traitName);
    }

    GetTraitInfoById(traitId: number): TraitManager.TraitInfo {
        for (let i = 0; i < TraitData.traits.length; i++) {
            if (this.alltraits[i].id == traitId) {
                return this.alltraits[i];
            }
        }
        throw new Error("NO TRAIT FOUND: " + traitId);
    }

    //used for sending description to
    GetTraitPlainDesc(traitId: number): string {
        let t: TraitManager.TraitInfo = this.GetTraitInfoById(traitId);
        return t.name + ": " + t.desc;
    }

    ApplyTrait(traitName: string, char: Character) {
        let trait: TraitManager.TraitInfo = this.GetTraitInfoByName(traitName);
        char.traitIds.push(trait.id);
        let game: Game = char.game; // convenience
        let curMap: GameMap = char.game.data.map;
        let eff: Effect;
        switch (trait.id) {
            case 3:
                // thick skin
                // Natural resistance to blade attacks
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 4:
                // Unpierceable
                // Natural resistance to piercing attacks
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 5:
                // Brute
                // Natural resistance to bludgeon attacks
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.BLUDGEON;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 6:
                // Icy Veins
                // Natural resistance to fire
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.FIRE;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 7:
                // Runs Hot
                // Natural resistance to cold
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.COLD;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 8:
                // strong Metabolism
                // Natural resistance to poison
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.POISON;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 9:
                // Well-Grounded
                // Natural resistance to electric damage
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.ELECTRIC;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 10:
                // Vivacious
                // Natural resistance to necrotic damage
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 11:
                // Skeptic
                // Natural resistance to arcane & necrotic damage
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.ARCANE;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 12:
                // Insulated
                // Natural resistance to cold & electric damage
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.COLD;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.RESIST;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.ELECTRIC;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 13:
                // Nimble
                // Innate bonus to dodge
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DODGE;
                eff.amount_base = 15;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 14:
                // Lucky Strike
                // Innate bonus to hit on all attacks
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.TOHIT;
                eff.amount_base = 15;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 15:
                // Eagle eye
                // Critical hit bonus with agility weapons
                // TODO Currently not supported, can only apply global crit bonus
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.CRIT;
                eff.amount_base = 5;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 16:
                // Slugger
                // Critical hit bonus with brawn weapons
                // TODO Currently not supported, can only apply global crit bonus
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.CRIT;
                eff.amount_base = 5;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 17:
                // Reliable
                // A reliable fighter. Innate high defense, but reduced critical hit chance
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DEFENSE;
                eff.amount_base = 25;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.CRIT;
                eff.amount_base = -10;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 18:
                // Procrastinator
                // Fights best when close to death
                // Handled in ConditionLowHP
                break;
            case 19:
                // Physician
                // Bonus to all healing effects
                // Handled in EntityLiving.DoHeal
                break;
            case 20:
                // Oblivious
                // Lower chance of trap detection.
                // TODO implement
                break;

            case 21:
                // Escape Artist
                // Automatic detect stairs each level.
                // TODO implement - not stairs but portal
                break;

            case 22:
                // Trapper
                // Bonus when attempting to disarm traps
                // TODO implement
                break;

            case 23:
                // Tinkerer
                // Chance to create a useful potion when disarming a trap
                break;

            case 24:
                // Big Drinker
                // Drinking any potion also provides a healing effect
                // TODO implement
                break;

            case 25:
                // Safecracker
                // Expert at finding hidden compartments. Better gear from chests
                // TODO implement
                break;

            case 26:
                // Treasure Hunter
                // Chance to find bonus gold and gems
                {
                    const chance = 75;

                    if (RandomUtil.instance.percentChance(chance)) {
                        let item: Item;
                        const rarity: GlobalConst.RARITY = GameUtil.GetRarityFromNumber(
                            RandomUtil.instance.int(2, curMap.cr) - 1,
                        );
                        item = TreasureFactory.instance.CreateRandomTreasure(char.game, rarity, curMap.cr);

                        let itemPos: MapPos = curMap.GetRandomEmptyTileInAnyRoom();
                        item.Spawn(itemPos.x, itemPos.y);
                    }
                }
                break;

            case 27:
                // Gourmand
                // Chance to find bonus food & potions
                {
                    const chance = 75;

                    if (RandomUtil.instance.percentChance(chance)) {
                        let item: Item;
                        const rarity: GlobalConst.RARITY = GameUtil.GetRarityFromNumber(
                            RandomUtil.instance.int(2, curMap.cr) - 1,
                        );
                        if (RandomUtil.instance.percentChance(50)) {
                            item = ConsumableFactory.instance.CreateRandomPotion(char.game, rarity, curMap.cr);
                        } else {
                            item = ConsumableFactory.instance.CreateRandomFood(char.game, rarity, curMap.cr);
                        }
                        let itemPos: MapPos = curMap.GetRandomEmptyTileInAnyRoom();
                        item.Spawn(itemPos.x, itemPos.y);
                    }
                }
                break;

            case 28:
                // Librarian
                // Chance to find bonus scrolls
                {
                    const chance = 75;

                    if (RandomUtil.instance.percentChance(chance)) {
                        let item: Item;
                        const rarity: GlobalConst.RARITY = GameUtil.GetRarityFromNumber(
                            RandomUtil.instance.int(2, curMap.cr) - 1,
                        );
                        item = ConsumableFactory.instance.CreateRandomScroll(char.game, rarity, curMap.cr);

                        let itemPos: MapPos = curMap.GetRandomEmptyTileInAnyRoom();
                        item.Spawn(itemPos.x, itemPos.y);
                    }
                }

                break;

            case 29:
                // Hunter
                // An expert at hunting beasts. Attack bonus vs. beasts
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.BEAST;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 30:
                // Gravedigger
                // Special knowledge on those returned from the grave. Attack bonus vs. Undead
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.UNDEAD;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);

                break;
            case 31:
                // Clean Freak
                // Knows just how to clean up those stubborn stains. Attack bonus vs. Oozes
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.OOZE;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 32:
                // Assassin
                // Trained in fighting humans & the human-like. Attack bonus vs. humanoids
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.HUMANOID;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 33:
                // Spelunker
                // Learned of the horrors of the deepest dungeons. Attack bonus vs. Deep Ones
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.DEEP_ONE;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 34:
                // Fey Slayer
                // Skilled at avoiding the tricks of fey folk. Attack bonus vs. Fey
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.FEY;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 35:
                // Chosen One
                // Student of dwellers of myth. Attack bonus vs. Mythics
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.MYTHIC;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 36:
                // Demonslayer
                // Dedicated to fighting the spawn of the hells. Attack bonus vs. demons
                // TODO/note - system doesn't currently support TOHIT bonuses by dweller phyla, so using damage instead
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.DEMON;
                eff.bonus_dam_percent = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 37:
                // People Person
                // Stronger attacks but vulnerable when fighting beasts
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.BEAST;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 38:
                // Necrophobic
                // Stronger attacks but vulnerable when fighting undead
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.UNDEAD;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 39:
                // Sludge Grudge
                // Stronger attacks but vulnerable when fighting oozes
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.OOZE;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 40:
                // Misanthrope
                // Stronger attacks but vulnerable when fighting humanoids
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.HUMANOID;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 41:
                // H.P. Hatecraft
                // Stronger attacks but vulnerable when fighting deep ones
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.DEEP_ONE;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 42:
                // Fairy Tale Hater
                // Stronger attacks but vulnerable when fighting the fey
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.FEY;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 43:
                // Realist
                // Stronger attacks but vulnerable when fighting mythics
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.MYTHIC;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 44:
                // Sanctimonious
                // Stronger attacks but vulnerable when fighting demons
                // TODO Add the vulnerable part
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                eff.bonus_dam_dweller_type = GlobalConst.DWELLER_PHYLUM.DEMON;
                eff.bonus_dam_percent = 100;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 45:
                // Polymath
                // A skilled student, +1 skill to choose from on level up
                // tODO implement
                break;
            case 46:
                // Stress Eater
                // Grows hungry faster, but eating provides additional healing
                // TODO healing part
                char.hungerRate -= 2; // tODO should this be an effect? probably not necessary (see 49 Low metabolisn)
                break;
            case 47:
                // Sneaky
                // Less likely to be detected by dwellers
                // TODO implement
                break;
            case 48:
                // Oafish
                // Increased defense & immune to knockback, but easier for dwellers to detect
                // TODO implement (knockback immunity in)
                break;
            case 49:
                // Low Metabolism
                // Slower to hunger, but less healing from food
                // TODO implement healing part
                char.hungerRate += 3; // tODO should this be an effect? probably not necessary (see 46 stress eater)
                break;
            case 50:
                // Paranoid
                // Expert at spotting traps, but vulnerable to mental attacks
                // TODO implement
                break;
            case 51:
                // Hardy Stock
                // Full of life and hard to kill. Bonus to health
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                eff.amount_base = 20;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);

                break;
            case 52:
                // Troll Blood
                // Faster natural healing but vulnerable to fire
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.VULNERABLE;
                eff.damage_type = GlobalConst.DAMAGE_TYPES.FIRE;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);

                ConditionManager.instance.GiveCondition(
                    char,
                    GlobalConst.CONDITION.REGEN,
                    GlobalConst.SOURCE_TYPE.INNATE,
                );

                break;
            case 53:
                // Focused
                // Immune to confusion
                // handled in one case in Bubbleeyes, but should be handled more generally/centrally
                break;
            case 54:
                // Scavenger
                // Chance to find bonus loot on defeated enemies
                // todo implement
                break;
            case 55:
                // Unstoppable
                // Resistant to being stunned or held
                // todo implement
                break;
            case 56:
                // Innocent
                // Immune to charm. Dwellers more likely to spawn asleep or peaceful
                // todo implement
                break;
            case 57:
                // Underdog
                // Always underestimated by opponents. Increased base dodge
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.DODGE;
                eff.amount_base = 20;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 58: {
                // Fey Touched
                //  Luck bonus, increased gold found

                // add gold to dungeon
                const chance = 75;

                if (RandomUtil.instance.percentChance(chance)) {
                    let item: Item;
                    const rarity: GlobalConst.RARITY = GameUtil.GetRarityFromNumber(
                        RandomUtil.instance.int(2, curMap.cr) - 1,
                    );
                    item = TreasureFactory.instance.CreateRandomTreasure(char.game, rarity, curMap.cr);

                    let itemPos: MapPos = curMap.GetRandomEmptyTileInAnyRoom();
                    item.Spawn(itemPos.x, itemPos.y);
                }
                // luck bonus, could also do as Lucky condition, but then should nearly all of these be conditions?
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.LUCK;
                eff.amount_base = 20;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            }

            case 59:
                // Fire Walker
                // Extra health in maps with volcanic biome or walls
                if (curMap.biome.name == GlobalConst.BIOME.VOLCANO || curMap.wall.name == GlobalConst.WALL.VOLCANO) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 60:
                // Northerner
                // Extra health in maps with ice biome or walls
                if (curMap.biome.name == GlobalConst.BIOME.ICE || curMap.wall.name == GlobalConst.WALL.ICE) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 61:
                // Sand Crawler
                // Extra health in maps with desert biome or walls
                if (curMap.biome.name == GlobalConst.BIOME.DESERT || curMap.wall.name == GlobalConst.WALL.DESERT) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 62:
                // Goth
                // Extra health & defense in graveyard biome map
                if (curMap.biome.name == GlobalConst.BIOME.GRAVEYARD) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 30;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);

                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.DEFENSE;
                    eff.amount_base = 25;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 63:
                // Naturalist
                // Extra health in forest biome map
                if (curMap.biome.name == GlobalConst.BIOME.FOREST) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 64:
                // Mountaineer
                // Extra health in mountain biome maps
                if (curMap.biome.name == GlobalConst.BIOME.MOUNTAIN) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 65:
                // Hell Walker
                // Extra health & defense in maps with hell biome or walls
                if (curMap.biome.name == GlobalConst.BIOME.HELL || curMap.wall.name == GlobalConst.WALL.HELL) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);

                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.DEFENSE;
                    eff.amount_base = 25;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 66:
                // Greenskeeper
                // Extra health in grasslands biome map
                if (curMap.biome.name == GlobalConst.BIOME.GRASSLANDS) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 67:
                // Ruins Raider
                // Extra health & defense in ruin
                if (curMap.wall.name == GlobalConst.WALL.RUIN) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);

                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.DEFENSE;
                    eff.amount_base = 25;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 68:
                // Temple Charter
                // Extra health & defense in temples
                if (curMap.wall.name == GlobalConst.WALL.TEMPLE) {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 20;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);

                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.DEFENSE;
                    eff.amount_base = 25;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 69:
                // Rune Reader
                // Maps with rune line art are partially revealed to you
                // TZ note -- I think we should just make this fully revealed, easier and it's kind of a lame trait otherwise
                if (curMap.lineart.toLowerCase().includes("rune")) {
                    game.dungeon.AddMessageEvent("Mystic runes glow in your mind, providing secret knowledge.");
                    Spells.CastSpellByName("magic mapping", char, game);
                }
                break;
            case 70:
                // Glitch Walker
                // Bonus to health & defense in any glitch maps
                if (curMap.glitch != null && curMap.glitch != "") {
                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                    eff.amount_base = 40;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);

                    eff = new Effect(game);
                    eff.type = GlobalConst.EFFECT_TYPES.DEFENSE;
                    eff.amount_base = 25;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                    eff.Apply(char);
                }
                break;
            case 71:
                // Silver Spoon
                // Start with a small fortune in extra gold
                char.gold += 200;
                break;
            case 72: {
                // Smith's Apprentice
                // Start with a Hammer
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.HAMMER,
                );
                char.GiveItem(item);
                break;
            }
            case 73: {
                // Lumberjack
                // Start with an Axe
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.AXE,
                );
                char.GiveItem(item, true);
                break;
            }
            case 74: {
                // Fletcher
                // Start with a Bow
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.BOW,
                );
                char.GiveItem(item);
                break;
            }
            case 75: {
                // Squire
                // Start with a Sword
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.SWORD,
                );
                char.GiveItem(item);
                break;
            }
            case 76: {
                // Fisher
                // Start with a Spear
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.SPEAR,
                );
                char.GiveItem(item);
                break;
            }
            case 77: {
                // Apprentice
                // Start with a Wand
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.WAND,
                );
                char.GiveItem(item);
                break;
            }
            case 78: {
                // Initiate
                // Start with a Staff
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.STAFF,
                );
                char.GiveItem(item);
                break;
            }
            case 79: {
                // Cutpurse
                // Start with a Dagger
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.DAGGER,
                );
                char.GiveItem(item);
                break;
            }
            case 80: {
                // Start with a random scroll // Scribe
                let item: Item = ConsumableFactory.instance.CreateRandomScroll(
                    game,
                    RandomUtil.instance.percentChance(70) ? GlobalConst.RARITY.UNCOMMON : GlobalConst.RARITY.RARE,
                    game.data.map.cr,
                );
                char.GiveItem(item);
                break;
            }
            case 81:
                // Locksmith
                // Start with multiple keys
                char.keys += 12;
                break;

            case 82: {
                // Start with a random potion // Alchemist
                let item: Item = ConsumableFactory.instance.CreateRandomPotion(
                    game,
                    RandomUtil.instance.percentChance(70) ? GlobalConst.RARITY.UNCOMMON : GlobalConst.RARITY.RARE,
                    game.data.map.cr,
                );
                char.GiveItem(item);
                break;
            }
            case 83: {
                // Start with a shield // Town Watch
                let item: Item = ArmorFactory.instance.CreateRandomArmor(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                    GlobalConst.ITEM_BASE_TYPE.SHIELD,
                );
                char.GiveItem(item);
                break;
            }
            case 84: {
                // Start with a ring or amulet (or bracer) // Jeweler
                let item: Item = JewelryFactory.instance.CreateRandomJewelry(
                    game,
                    GlobalConst.RARITY.UNCOMMON,
                    game.data.map.cr,
                );
                char.GiveItem(item);
                break;
            }
            case 85:
                // Pauper
                // Reduced starting gear
                // TODO Implement
                break;
            case 88:
                // Merchant
                // An expert haggler, cheaper prices
                // TODO Implement

                break;
            case 89:
                // Profligate
                // Terrible with money, higher prices at shops
                // TODO Implement

                break;
            case 90:
                // Charming
                // A sweet talker, bonus in story events
                // TODO Implement
                break;
            case 91:
                // Intimidating
                // A powerful presence, bonus in story events
                // TODO Implement
                break;
            case 92:
                // Deceptive
                // A skilled liar, bonus in story events
                // TODO Implement
                break;
            case 93:
                // Grizzled Veteran
                // Begin all campaigns at level 2
                // TODO Implement
                break;
            case 94: {
                // Start with a rare weapon // Glitch: CGA
                let item: Item = WeaponFactory.instance.CreateRandomWeapon(
                    game,
                    GlobalConst.RARITY.RARE,
                    game.data.map.cr,
                );
                char.GiveItem(item);
                break;
            }
            case 95: {
                // Start with rare armor // Glitch: Ascii
                let item: Item = ArmorFactory.instance.CreateRandomArmor(
                    game,
                    GlobalConst.RARITY.RARE,
                    game.data.map.cr,
                );
                char.GiveItem(item);
                break;
            }
            case 96:
                // Glitch: Terminal
                // Start with a rare ring
                let item: Item = JewelryFactory.instance.CreateRandomJewelry(
                    game,
                    GlobalConst.RARITY.RARE,
                    game.data.map.cr,
                    GlobalConst.JEWELRY_BASE_TYPE.RING,
                );
                char.GiveItem(item);
                break;

            case 97: {
                // Start with 3 random scrolls // Glitch: Graph Paper
                for (let i = 0; i < 3; i++) {
                    let item: Item = ConsumableFactory.instance.CreateRandomScroll(
                        game,
                        RandomUtil.instance.percentChance(70) ? GlobalConst.RARITY.UNCOMMON : GlobalConst.RARITY.RARE,
                        game.data.map.cr,
                    );
                    char.GiveItem(item);
                }
                break;
            }
            case 98:
                // Awkward
                // Poor at small talk, penalty in some story events
                // todo implement
                break;
            case 99:
                // Glitch: Rainbow
                // Random strong positive trait on every run
                let pos_traits = [96, 97, 95, 94, 58, 51, 45, 11, 12, 3];
                this.ApplyTrait(this.GetTraitInfoById(RandomUtil.instance.fromArray(pos_traits)).name, char);
                break;
            case 100:
                // Blessed
                // Blessed by the oracle
                // +1 spirit
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.SPIRIT;
                eff.amount_base = 1;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 101:
                // Lore Keeper
                // Holder of rare knowledge
                // +1 guile
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.GUILE;
                eff.amount_base = 1;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            case 102:
                // Plot Armor
                // Significant bonus to starting health
                // + 50 HP_MAX
                eff = new Effect(game);
                eff.type = GlobalConst.EFFECT_TYPES.MAXHP;
                eff.amount_base = 50;
                eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);
                eff.Apply(char);
                break;
            default:
                // trait ID not found,TODO throw error
                console.log("Attempting to apply trait " + trait.name + "(" + trait.id + "), not found");
                break;
        }
    }
}

namespace TraitManager {
    export type TraitInfo = {
        id: number;
        name: string;
        desc: string;
        detailDesc?: string; //used to include hard numbers in description
    };
}

export default TraitManager;
