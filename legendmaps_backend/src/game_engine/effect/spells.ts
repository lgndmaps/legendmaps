import Game from "../game";
import MapPos from "../utils/mapPos";
import RandomUtil from "../utils/randomUtil";
import EntityLiving from "../base_classes/entityLiving";
import Character from "../character/character";
import Dweller from "../dweller/dweller";
import ItemGenCommon from "../item/itemgen/itemGenCommon";
import WeaponFactory from "../item/itemgen/weaponFactory";
import GlobalConst from "../types/globalConst";
import Item from "../item/item";
import ArmorFactory from "../item/itemgen/armorFactory";
import DwellerFactory from "../dweller/dwellerFactory";
import type MapRoom from "../map/mapRoom";
import ConditionManager from "./conditionManager";
import Effect from "./effect";
import CombatAttack from "../combat/combatAttack";
import FlagUtil from "../utils/flagUtil";
import Trap from "../trap/trap";

export default class Spells {
    //Spells with "dweller" is the name are only usable by the player character, this is hacky but leaving for now.
    public static SpellIsDwellerTargetted(name: GlobalConst.SPELLS): boolean {
        if (name.toString().toLowerCase().includes("dweller") && GlobalConst.SPELLS.SUMMON_DWELLER != name) {
            return true;
        }
        return false;
    }

    //prevents having to have 7 different functions for each spell
    public static GetAOENameByDamageType(damType: GlobalConst.DAMAGE_TYPES): string {
        switch (damType) {
            case GlobalConst.DAMAGE_TYPES.POISON:
                return "poison cloud";
                break;
            case GlobalConst.DAMAGE_TYPES.ARCANE:
                return "arcane blast";
                break;
            case GlobalConst.DAMAGE_TYPES.DIVINE:
                return "divine wrath";
                break;
            case GlobalConst.DAMAGE_TYPES.COLD:
                return "ice storm";
                break;
            case GlobalConst.DAMAGE_TYPES.ELECTRIC:
                return "thunderstorm";
                break;
            case GlobalConst.DAMAGE_TYPES.FIRE:
                return "fireball";
                break;
            case GlobalConst.DAMAGE_TYPES.NECROTIC:
                return "necrotic blast";
                break;
            default:
                throw new Error("illegal damage type");
                break;
        }
    }

    public static CastSpellByName(name: string, target: Character | Dweller, game: Game, effect?: Effect): boolean {
        switch (name) {
            case GlobalConst.SPELLS.TELEPORT:
                this.Teleport(game, target);
                break;
            case GlobalConst.SPELLS.BLINK:
                this.Blink(game, target);
                break;
            case GlobalConst.SPELLS.ENCHANT_WEAPON:
                this.EnchantWeapon(game, target, effect);
                break;
            case GlobalConst.SPELLS.GREATER_ENCHANT_WEAPON:
                this.GreaterEnchantWeapon(game, target, effect);
                break;
            case GlobalConst.SPELLS.ENCHANT_ARMOR:
                this.EnchantArmor(game, target, effect);
                break;
            case GlobalConst.SPELLS.GREATER_ENCHANT_ARMOR:
                this.GreaterEnchantArmor(game, target, effect);
                break;
            case GlobalConst.SPELLS.SATISFY_HUNGER:
                this.SatisfyHunger(game, target);
                break;
            case GlobalConst.SPELLS.MAPPING:
                this.MagicMapping(game, target);
                break;
            case GlobalConst.SPELLS.SUMMON_DWELLER:
                this.SummonDweller(game, target, null, effect);
                break;
            case GlobalConst.SPELLS.TELEPORT_DWELLER:
                this.Teleport(game, target);
                break;
            case GlobalConst.SPELLS.POISON_DWELLER:
                this.Poison(game, target, effect);
                break;
            case GlobalConst.SPELLS.STUN_DWELLER:
                this.Stun(game, target, effect);
                break;
            case GlobalConst.SPELLS.AOE_DWELLER:
                this.AOE(game, game.dungeon.character, target, effect);
                break;

            case GlobalConst.SPELLS.REVEAL_TRAPS:
                this.RevealTraps(game, target);
                break;
            case GlobalConst.SPELLS.CURE_ALL:
                this.CureAll(game, target);
                break;
            default:
                console.log("attempt to cast unknown spell: " + name);
                return false;
                break;
        }

        return true; // success
    }

    public static ValidateSpellName(name: string): boolean {
        return Object.values(GlobalConst.SPELLS).includes(name as GlobalConst.SPELLS);
    }

    public static Poison(game: Game, target: Character | Dweller, effect?: Effect) {
        let turns = 3;
        if (effect != undefined && effect.amount_base > 0) {
            //based on CR + rarity, will be 2 to 9
            turns = effect.amount_base;
        }
        let bonusmsg = ".";

        if (!(target instanceof Character) && game.dungeon.character.skillIds.includes(27)) {
            turns += 2;
            bonusmsg = " (+2 feywing's magick).";
        }
        ConditionManager.instance.GiveCondition(
            target,
            GlobalConst.CONDITION.POISONED,
            GlobalConst.SOURCE_TYPE.TEMPORARY,
            -1,
            turns,
        );
        if (target instanceof Character) {
            game.dungeon.AddFXEvent(
                "You are poisoned for " + turns + " turns",
                GlobalConst.CLIENTFX.GENERIC_NEGATIVE_MAGIC,
                [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                true,
            );
        } else {
            game.dungeon.AddFXEvent(
                "The " + target.name + " is poisoned for " + turns + " turns" + bonusmsg,
                GlobalConst.CLIENTFX.NONE,
                [],
                false,
            );
        }
    }

    public static AOE(
        game: Game,
        source: Character | Dweller,
        target: Character | Dweller,
        effect: Effect,
        forceName?: string,
    ) {
        if (target instanceof Character) {
            //unimplemented.
            console.log("TARGET IS CHAR for AOE, not implmented");
        } else {
            //game.dungeon.AddFXEvent("You cast " + effect.name, GlobalConst.CLIENTFX.NONE, [], false);

            let tmpItem = new Item(game);

            tmpItem.nameBase = effect.name;
            tmpItem.baseType = GlobalConst.CONSUMABLE_BASE_TYPE.SCROLL;
            let damageEffect = new Effect(game);
            if (forceName != undefined) {
                tmpItem.name = forceName;
            } else {
                tmpItem.name = this.GetAOENameByDamageType(effect.damage_type);
            }

            damageEffect.name = tmpItem.name;
            damageEffect.damage_type = effect.damage_type;
            damageEffect.amount_base = effect.amount_base;

            damageEffect.amount_max = effect.amount_max;

            if (game.dungeon.character.skillIds.includes(27)) {
                game.dungeon.AddMessageEvent("Spell enhanced by feywing's magick.", [GlobalConst.MESSAGE_FLAGS.APPEND]);
                damageEffect.amount_base = Math.ceil(damageEffect.amount_base * 1.2);
                damageEffect.amount_max = Math.ceil(damageEffect.amount_max * 1.2);
            }

            damageEffect.flags = FlagUtil.Set(damageEffect.flags, GlobalConst.EFFECT_FLAGS.AOE);
            damageEffect.trigger = GlobalConst.EFFECT_TRIGGERS.HIT;
            damageEffect.type = GlobalConst.EFFECT_TYPES.DAMAGE;
            tmpItem.effects = [damageEffect];
            let attack: CombatAttack = new CombatAttack(game, source, tmpItem);
            attack.flags = FlagUtil.Set(attack.flags, GlobalConst.ATTACK_FLAGS.IS_AOE);
            attack.$damageSource =
                source instanceof Character ? GlobalConst.DAMAGE_SOURCE.PLAYER : GlobalConst.DAMAGE_SOURCE.DWELLER;
            attack.$damageSourceName = effect.name;
            let tiles: MapPos[] = [];
            tiles.push(target.mapPos);
            tiles = tiles.concat(game.dungeon.GetNeighbors(target.mapPos));

            for (let tile of tiles) {
                // console.log("calculating explosion at: " + tile.x + "," + tile.y);
                let ents = game.dungeon.GetEntitiesInTile(tile.x, tile.y);
                let added: boolean = false;
                for (let e = 0; e < ents.length; e++) {
                    if (
                        FlagUtil.IsNotSet(ents[e].flags, GlobalConst.ENTITY_FLAGS.IS_DEAD) &&
                        (ents[e].cname == GlobalConst.ENTITY_CNAME.DWELLER ||
                            ents[e].cname == GlobalConst.ENTITY_CNAME.CHARACTER)
                    ) {
                        added = true;
                        // console.log("adding target to attack: " + ents[e].kind);
                        attack.AddTarget(ents[e] as EntityLiving);
                    }
                }
                if (!added) {
                    attack.AddTile(tile.x, tile.y);
                }
            }

            attack.doAttack();
        }
    }

    public static Stun(game: Game, target: Character | Dweller, effect?: Effect) {
        let turns = 2;
        if (effect != undefined && effect.amount_base > 0) {
            //based on CR + rarity, will be 2 to 9
            turns = 1 + Math.ceil(effect.amount_base / 2);
        }
        let bonusmsg = ".";

        if (!(target instanceof Character) && game.dungeon.character.skillIds.includes(27)) {
            turns += 1;
            bonusmsg = " (+1 from feywing's magick).";
        }

        let immune = false;
        if (target instanceof Character && game.dungeon.character.skillIds.includes(30)) {
            immune = true;
        }

        if (!immune) {
            ConditionManager.instance.GiveCondition(
                target,
                GlobalConst.CONDITION.STUNNED,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                -1,
                turns,
            );
        }

        if (target instanceof Character) {
            if (immune) {
                game.dungeon.AddMessageEvent("You are immune to stun (cockatrice blood).", [
                    GlobalConst.MESSAGE_FLAGS.EMPHASIZE,
                ]);
            } else {
                game.dungeon.AddFXEvent(
                    "You are stunned for " + turns + " turns.",
                    GlobalConst.CLIENTFX.GENERIC_NEGATIVE_MAGIC,
                    [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                    true,
                );
            }
        } else {
            game.dungeon.AddFXEvent(
                "The " + target.name + " is stunned for " + turns + " turns" + bonusmsg,
                GlobalConst.CLIENTFX.NONE,
                [],
                false,
            );
        }
    }

    public static Teleport(game: Game, target: Character | Dweller) {
        // TODO just combine with blink spell with different params
        let destRoom: MapRoom = RandomUtil.instance.fromArray(game.data.map.rooms);
        const TELEPORT_RANGE = game.data.map.GetMapWidth();
        const TELEPORT_MIN_RANGE = 7;

        let new_loc: MapPos;
        let validLoc: boolean = false;
        let sanity: number = 1000;
        while (!validLoc && sanity > 0) {
            new_loc = RandomUtil.instance.fromArray(
                game.dungeon.GetTilesInEuclidianRange(target.mapPos, TELEPORT_RANGE, TELEPORT_MIN_RANGE),
            );
            if (
                !game.dungeon.GetDwellerInTile(new_loc.x, new_loc.y) && // no dweller in dest tile
                game.dungeon.TileIsWalkable(new_loc.x, new_loc.y) && // it's walkable
                new_loc.x > game.data.map.entranceTile.mapPos.x + 1 // it's not outside the entrance
            ) {
                validLoc = true;
            }
            sanity--;
        }
        if (new_loc.x <= game.data.map.entranceTile.mapPos.x) {
            // teleported outside the entrance, re-open the gate (just in case)
            game.data.map.entranceTile.open();
        }

        //console.log("cast spell teleport, attempting to move to " + new_loc.x + ", " + new_loc.y);
        target.mapEntity.Move(new_loc);
        if (target instanceof Character) {
            game.dungeon.AddFXEvent(
                "You find yourself in a new location.",
                GlobalConst.CLIENTFX.TELEPORT,
                [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                true,
            );
        } else {
            game.dungeon.AddFXEvent("The " + target.name + " disappears.", GlobalConst.CLIENTFX.TELEPORT, [], false, [
                target.id,
            ]);
        }
    }

    public static Blink(game: Game, target: Character | Dweller) {
        const BLINK_RANGE = 7;
        const BLINK_MIN_RANGE = 2;
        let new_loc: MapPos;
        let validLoc: boolean = false;
        let sanity: number = 1000;
        while (!validLoc && sanity > 0) {
            new_loc = RandomUtil.instance.fromArray(
                game.dungeon.GetTilesInEuclidianRange(target.mapPos, BLINK_RANGE, BLINK_MIN_RANGE),
            );
            if (
                !game.dungeon.GetDwellerInTile(new_loc.x, new_loc.y) &&
                game.dungeon.TileIsWalkable(new_loc.x, new_loc.y)
            ) {
                validLoc = true;
            }
            sanity--;
        }

        target.mapEntity.Move(new_loc);

        if (new_loc.x <= game.data.map.entranceTile.mapPos.x) {
            // blinked outside the entrance, re-open the gate
            game.data.map.entranceTile.open();
        }
        console.log("cast spell blink, attempting to move to " + new_loc);

        if (target instanceof Character) {
            game.dungeon.AddFXEvent("You blink to a nearby location.", GlobalConst.CLIENTFX.TELEPORT, [], false);
        } else {
            game.dungeon.AddFXEvent(
                "The " + target.name + " blinks to a nearby location.",
                GlobalConst.CLIENTFX.TELEPORT,
                [],
                false,
                [target.id],
            );

        }
    }

    public static GreaterEnchantWeapon(game: Game, target: Character | Dweller, effect?: Effect) {
        if (target instanceof Character) {
            let w = target.GetActiveWeapon();
            if (w) {
                let oldName = w.name;
                ItemGenCommon.AddRandomEnhancement(w, WeaponFactory.instance.weapon_enhancement_list); // todo Make a function that doesn't require a list, and chooses the appropriate list based on item type
                game.dungeon.AddFXEvent(
                    "Your " + oldName + " glows, and is now a " + w.name,
                    GlobalConst.CLIENTFX.ENCHANT,
                    [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                    true,
                );
            } else {
                // no equipped weapon
                game.dungeon.AddMessageEvent(
                    "There is a brief glow, but the spell fizzles out. Next time try it with a weapon equipped!",
                );
            }
        } else {
            console.log("The " + target.name + " doesn't have an enchantable weapon!");
        }
    }

    public static GreaterEnchantArmor(game: Game, target: Character | Dweller, effect?: Effect) {
        if (target instanceof Character) {
            let i = this.GetRandomEquippedArmor(target);
            if (i) {
                let oldName = i.name;
                ItemGenCommon.AddRandomEnhancement(i, ArmorFactory.instance.armor_enhancement_list); // todo Make a function that doesn't require a list, and chooses the appropriate list based on item type
                let msg: string;
                if (i.rarity == GlobalConst.RARITY.LEGENDARY) {
                    msg = i.name + " glows intensely -- can it be even *more* powerful?";
                } else {
                    msg = "Your " + oldName + " glows, and is now a " + i.name;
                }
                game.dungeon.AddFXEvent(msg, GlobalConst.CLIENTFX.ENCHANT, [GlobalConst.MESSAGE_FLAGS.EMPHASIZE], true);
            } else {
                // no equipped armor
                game.dungeon.AddMessageEvent(
                    "There is a brief glow, but the spell fizzles out. Next time try it with armor equipped!",
                );
            }
        } else {
            console.log("The " + target.name + " doesn't have enchantable armor!");
        }
    }

    public static EnchantWeapon(game: Game, target: Character | Dweller, effect?: Effect) {
        if (target instanceof Character) {
            let i = target.GetActiveWeapon();
            if (i) {
                let oldName = i.name;
                ItemGenCommon.EnchantItem(i, 5);
                game.dungeon.AddFXEvent(
                    "Your " + oldName + " glows momentarily, and is now a " + i.name,
                    GlobalConst.CLIENTFX.ENCHANT,
                    [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                    true,
                );
            } else {
                // no equipped weapon
                game.dungeon.AddMessageEvent(
                    "There is a brief glow, but the spell fizzles out. Next time try it with a weapon equipped!",
                );
            }
        } else {
            console.log("The " + target.name + " doesn't have an enchantable weapon!");
        }
    }

    public static EnchantArmor(game: Game, target: Character | Dweller, effect?: Effect) {
        if (target instanceof Character) {
            let i = this.GetRandomEquippedArmor(target);
            if (i) {
                let oldName = i.name;
                ItemGenCommon.EnchantItem(i, 15);
                game.dungeon.AddFXEvent(
                    "Your " + oldName + " glows momentarily, and is now a " + i.name,
                    GlobalConst.CLIENTFX.ENCHANT,
                    [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                    true,
                );
            } else {
                // no equipped weapon
                game.dungeon.AddMessageEvent(
                    "There is a brief glow, but the spell fizzles out. Next time try it with armor equipped!",
                );
            }
        } else {
            console.log("The " + target.name + " doesn't have enchantable armor!");
        }
    }

    public static SatisfyHunger(game: Game, target: Character | Dweller) {
        if (target instanceof Character) {
            target.ModifyHunger(100);
            game.dungeon.AddFXEvent(
                "Your feel sated!",
                GlobalConst.CLIENTFX.GENERIC_POSITIVE_MAGIC,
                [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                true,
            );
        } else {
            console.log("The " + target.name + " can't be satisfied!");
        }
    }

    public static MagicMapping(game: Game, target: Character | Dweller) {
        game.data.map.SetAllTilesRevealed();
        game.dungeon.AddFXEvent(
            "The map is magically revealed!",
            GlobalConst.CLIENTFX.GENERIC_POSITIVE_MAGIC,
            [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
            true,
        );
    }

    public static RevealTraps(game: Game, target: Character | Dweller, range?: number) {
        for (let i = 0; i < game.data.entities.length; i++) {
            let e = game.data.entities[i];
            if (e.cname == GlobalConst.ENTITY_CNAME.TRAP) {
                let t: Trap = e as Trap;
                t.RemoveMeAndSpawnStoryEventVersion(game);
            }
        }
        game.dungeon.AddMessageEvent("All traps will be visible to you!");
    }

    public static SummonDweller(
        game: Game,
        target: Character | Dweller,
        kind?: GlobalConst.DWELLER_KIND,
        effect?: Effect,
    ) {
        let dweller: Dweller;
        if (kind) {
            dweller = DwellerFactory.instance.CreateDweller(game, kind, game.data.map.cr - 1);
        } else {
            dweller = DwellerFactory.instance.CreateRandomDweller(game, game.data.map.cr - 1);
        }
        let pos: MapPos = game.dungeon.GetWalkableNeighbors(target.mapPos)[0];
        if (pos) {
            dweller.Spawn(pos.x, pos.y);
            game.dungeon.AddFXEvent(
                "A " + dweller.name + " appears!",
                GlobalConst.CLIENTFX.NONE,
                [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                true,
            );
        } else {
            game.dungeon.AddMessageEvent(
                "There is a brief glow, but the spell fizzles out, failing to summon a dweller.",
            );
        }
    }

    public static CureAll(game: Game, target: Character | Dweller) {
        const conditionsToCure: GlobalConst.CONDITION[] = [
            GlobalConst.CONDITION.BLEEDING,
            GlobalConst.CONDITION.BURNING,
            GlobalConst.CONDITION.CONFUSED,
            GlobalConst.CONDITION.DISEASED,
            GlobalConst.CONDITION.FREEZING,
            GlobalConst.CONDITION.HELD,
            GlobalConst.CONDITION.POISONED,
            GlobalConst.CONDITION.SLEPT,
            GlobalConst.CONDITION.SLOWED,
            GlobalConst.CONDITION.STUNNED,
        ];

        const targetName = target instanceof Character ? "You are " : target.name + " is ";
        game.dungeon.AddFXEvent(
            "You feel restored to your normal self.",
            GlobalConst.CLIENTFX.GENERIC_POSITIVE_MAGIC,
            [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
            true,
        );

        for (const c of target.conditions) {
            if (conditionsToCure.includes(c.$data.kind)) {
                // remove the condition
                ConditionManager.instance.RemoveConditionSource(
                    target,
                    c.$data.kind,
                    GlobalConst.SOURCE_TYPE.TEMPORARY,
                );
                // TODO: Should this messaging happen in the actual apply/remove condition code?
                game.dungeon.AddMessageEvent(targetName + " no longer " + c.$data.kind, [
                    GlobalConst.MESSAGE_FLAGS.APPEND,
                    GlobalConst.MESSAGE_FLAGS.EMPHASIZE,
                ]);
            }
        }
    }

    private static GetRandomEquippedArmor(char: Character): Item | null {
        // TODO this could probably go somewhere else
        const eq_items: Item[] = char.GetAllEquippedItems();
        let eq_armors: Item[] = [];

        for (const item of eq_items) {
            if (item.isArmor()) {
                eq_armors.push(item);
            }
        }
        return RandomUtil.instance.fromArray(eq_armors);
    }
}
