import Game from "../game";
import GlobalConst from "../types/globalConst";
import MapEntity from "../map/mapEntity";
import {SerializedCharacterD} from "../types/types";
import {CharacterD, M_TurnEvent_Names, M_TurnEvent_PlayerDead, M_TurnEvent_PlayerEscape} from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import Effect from "../effect/effect";
import Item from "../item/item";
import InventoryItem from "../item/inventoryItem";
import WeaponFactory from "../item/itemgen/weaponFactory";
import ConsumableFactory from "../item/itemgen/consumableFactory";
import RandomUtil from "../utils/randomUtil";
import ArmorFactory from "../item/itemgen/armorFactory";
import {CampaignUtil} from "../utils/campaignUtil";
import {DBInterface, SerializedCampaignResponse} from "../utils/dbInterface";
import ArrayUtil from "../utils/arrayUtil";
import TraitManager from "./traitManager";
import EntityLiving from "../base_classes/entityLiving";
import Dweller from "../dweller/dweller";
import ItemGenCommon from "../item/itemgen/itemGenCommon";
import EffectUtil from "../effect/effectUtil";
import MathUtil from "../utils/mathUtil";
import ConditionManager from "../effect/conditionManager";
import ObjectUtil from "../utils/objectUtil";
import GameConfig from "../gameConfig";
import * as Sentry from "@sentry/node";
import MapPos from "../utils/mapPos";
import GameCharacterUtil from "../../utils/GameCharacterUtil";
import GameUtil from "../utils/gameUtil";
import Spells from "../effect/spells";
import WEAPON_BASE_TYPE = GlobalConst.WEAPON_BASE_TYPE;

class Character extends EntityLiving implements CharacterD {
    tokenId: number = -1;
    first_name: string = "";
    last_name: string = "";
    full_name: string = "";

    traitIds: number[]; //trait ids referenced by TraitFactory / data for lookups.
    skillIds: number[];
    level: number;

    gold: number = -1;
    keys: number = -1;

    private _hunger: number = -1;
    private _luck: number = 0;

    _brawn: number = -1;
    _agility: number = -1;
    _spirit: number = -1;
    _guile: number = -1;

    hungerRate: number = 3; // subtract 1 from hunger every hungerRate turns
    inventory: InventoryItem[] = [];
    $inventoryChanged: boolean = true;
    $traitsChanged: boolean = true;
    lastWeapon: Item;
    lastShield: Item;

    initializedForRun: boolean = false;

    public $characterCampaign: SerializedCharacterD; //campaign data set by game init/load, not saved.

    idcounter: number = 0;

    //isIni
    constructor(game: Game, json: CharacterD | "" = "", isCreateAndSpawn: boolean = false) {
        super(game, json); //this *will* throw errors on initial create, but can be ignored.
        //console.log(json);
        this.traitIds = [];
        this.skillIds = [];

        this.kind = GlobalConst.ENTITY_CNAME.CHARACTER;
        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this, [
                "brawn",
                "agility",
                "spirit",
                "guile",
                "hpmax",
                "luck",
            ]);
            if (isCreateAndSpawn) {
                //@ts-ignore
                if (json.gold == -1 || json.inventory == undefined || json._brawn == undefined) {
                    //console.log("fixing character BAGS/luck from stub");
                    if (json.brawn) {
                        this._brawn = json.brawn;
                    }
                    if (json.agility) {
                        this._agility = json.agility;
                    }
                    if (json.spirit) {
                        this._spirit = json.spirit;
                    }
                    if (json.guile) {
                        this._guile = json.guile;
                    }
                    if (json.luck) {
                        this._luck = json.luck;
                    }
                }
                if (json.level > 1) {
                    this.level = json.level;
                }
                if (json.hpmax) {
                    this.setBaseHP(json.hpmax);
                }
            }

            for (let i = 0; i < json.inventory?.length; i++) {
                this.inventory.push(new InventoryItem(this.game, null, json.inventory[i]));
            }

            for (let i = 0; i < json.traitIds?.length; i++) {
                this.traitIds.push(json.traitIds[i]);
            }

            for (let i = 0; i < json.skillIds?.length; i++) {
                this.skillIds.push(json.skillIds[i]);
            }
            if (this.mapEntity != null) {
                this.mapEntity.ascii = "@";
            }
        } else {
            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = "@";
        }
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE);
    }

    public get name(): string {
        return this.full_name;
    }

    async CheckForRunInit() {
        if (this.$characterCampaign == undefined) {
            throw new Error("Character campaign data not loaded before trying to Init character");
        }
        if (this.initializedForRun) {
            return;
        }

        if (this.gold < 0) {
            //console.log("Giving starting gear and setting up character stats");
            await this.CreateFromAdventurerAndGiveStartingGear();
        }

        if (this.level > 1) {
            //console.log("init for subsequent run");
            //subsequent run
            this._hp = this._hpmax;
            this._hunger = 100;

            //clearing temporary and timed effects.
            for (let i = this.effects.length - 1; i >= 0; i--) {
                if (
                    (this.effects[i].turns && this.effects[i].turns > -1) ||
                    (this.effects[i].source && this.effects[i].source.type == GlobalConst.SOURCE_TYPE.TEMPORARY)
                ) {
                    this.effects.splice(i, 1);
                }
            }

            //clearing temporary and timed conditions
            for (let i = this.conditions.length - 1; i >= 0; i--) {
                if (
                    (this.conditions[i].turns && this.conditions[i].turns > -1) ||
                    this.conditions[i].kind == GlobalConst.CONDITION.LOWHP ||
                    this.conditions[i].kind == GlobalConst.CONDITION.HUNGRY ||
                    this.conditions[i].kind == GlobalConst.CONDITION.STARVING
                ) {
                    this.conditions.splice(i, 1);
                }
            }
        } else {
            //console.log("first run");
        }
        this.initializedForRun = true;
    }

    async ApplySkillEffects() {
        //console.log("Applying skill effects...");
        for (var skillId of this.skillIds) {
            // first remove existing Skill Effects for this skill that may be in effect
            EffectUtil.RemoveEffectsBySource(this, GlobalConst.SOURCE_TYPE.SKILL, skillId);

            // Then, add skill effects
            // get skill
            let skill = GameUtil.GetSkillById(skillId);
            if (skill.modifiers) {
                // BAGS
                if (skill.modifiers.brawn) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.BRAWN, skill.modifiers.brawn);
                }
                if (skill.modifiers.agility) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.AGILITY, skill.modifiers.agility);
                }
                if (skill.modifiers.guile) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.GUILE, skill.modifiers.guile);
                }
                if (skill.modifiers.spirit) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.SPIRIT, skill.modifiers.spirit);
                }
                // other modifiers
                if (skill.modifiers.dodge) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.DODGE, skill.modifiers.dodge);
                }
                if (skill.modifiers.block) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.BLOCK, skill.modifiers.block);
                }
                if (skill.modifiers.crit) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.CRIT, skill.modifiers.crit);
                }
                if (skill.modifiers.defense) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.DEFENSE, skill.modifiers.defense);
                }
                if (skill.modifiers.damage_add) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER, skill.modifiers.damage_add);
                }
                if (skill.modifiers.to_hit) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.TOHIT, skill.modifiers.to_hit);
                }
                if (skill.modifiers.damage_mult) {
                    let eff = new Effect(this.game);
                    eff.amount_base = 0;
                    eff.type = GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER;
                    eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.SKILL, skillId);
                    eff.bonus_dam_percent = skill.modifiers.damage_mult;
                    eff.Apply(this);
                }
            }
            if (skill.resistances) {
                for (var res of skill.resistances) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.RESIST, 0, res);
                }
            }
            if (skill.immunities) {
                for (var imm of skill.immunities) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.IMMUNE, 0, imm);
                }
            }
            if (skill.vulnerabilities) {
                for (var vuln of skill.vulnerabilities) {
                    this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.VULNERABLE, 0, vuln);
                }
            }

            if (skillId == 53) {
                this._hp = Math.round(this._hpmax / 2);
            }

            // Rat's Stash - id 31
            if (skillId == 31) {
                this.hungerRate *= 10;
            }

            // Collector's Cartography - id 47
            if (skillId == 47) {
                Spells.MagicMapping(this.game, this);
            }

            // Kleuf's Caprice - id 57
            if (skillId == 57) {
                switch (RandomUtil.instance.int(1, 4)) {
                    case 1:
                        this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.BRAWN, skill.modifiers.custom);
                        break;
                    case 2:
                        this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.AGILITY, skill.modifiers.custom);
                        break;
                    case 3:
                        this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.GUILE, skill.modifiers.custom);
                        break;
                    case 4:
                        this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.SPIRIT, skill.modifiers.custom);
                        break;
                    default:
                        this.AddSkillEffect(skillId, GlobalConst.EFFECT_TYPES.GUILE, skill.modifiers.custom);
                        break;
                }
            }
        }
    }

    AddSkillEffect(
        skillId: number,
        eff_type: GlobalConst.EFFECT_TYPES,
        amt: number,
        dam_type?: GlobalConst.DAMAGE_TYPES,
    ): Effect {
        // could also just let this take an EffectD and copy all params
        let eff = new Effect(this.game);
        eff.amount_base = amt;
        eff.type = eff_type;
        eff.damage_type = dam_type;
        eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.SKILL, skillId);
        eff.Apply(this);
        return eff;
    }

    GetTraitDescs(): string[] {
        let descs: string[] = [];

        for (let i = 0; i < this.traitIds.length; i++) {
            descs.push(TraitManager.instance.GetTraitPlainDesc(this.traitIds[i]));
        }
        return descs;
    }

    GetSkillsDescs(): string[] {
        let descs: string[] = [];
        for (var skillId of this.skillIds) {
            let skill = GameUtil.GetSkillById(skillId);
            descs.push(skill.name + ": " + skill.description);
        }
        return descs;
    }

    async CreateFromAdventurerAndGiveStartingGear() {
        if (this.$characterCampaign == undefined) {
            throw new Error("Character campaign data not loaded before trying to Create character");
        }
        if (this.game.data.campaignId == undefined || this.game.data.campaignId < 0) {
            throw new Error("Trying to Created character but not campaign id is set");
        }

        let resp: SerializedCampaignResponse = await CampaignUtil.fetch(this.game.data.campaignId);
        console.log("adventurer to create from: ", resp.adventurer);

        if (this._brawn < 1) {
            this._brawn = resp.adventurer.brawn;
        }
        if (this._agility < 1) {
            this._agility = resp.adventurer.agility;
        }

        if (this._guile < 1) {
            this._guile = resp.adventurer.guile;
        }
        if (this._spirit < 1) {
            this._spirit = resp.adventurer.spirit;
        }

        this.first_name = resp.adventurer.first_name;
        this.last_name = resp.adventurer.last_name;
        this.full_name = resp.adventurer.name;
        this.tokenId = resp.adventurer.tokenId;

        if (this._hpmax < 1) {
            this.setBaseHP(GameCharacterUtil.CalculateBaseHP(this._brawn));
        }

        this._hunger = 100;

        this.gold = 0;
        this.keys = 0;

        if (this.level != undefined && this.level > 1) {
        } else {
            this.level = 1;
        }

        if (this.skillIds == undefined) {
            this.skillIds = [];
        }

        // add TEST globalSkills and traits -- note this won't work for all globalSkills, such as
        // those that get applied between runs
        this.traitIds = this.traitIds.concat(GameConfig.TEST_TRAITS);
        this.skillIds = this.skillIds.concat(GameConfig.TEST_SKILLS);

        try {
            for (let i = 0; i < resp.adventurer.traits.length; i++) {
                TraitManager.instance.ApplyTrait(resp.adventurer.traits[i], this);
            }
        } catch (e) {
            Sentry.captureException(new Error(e));
        }

        //Giving Starting Weapon //TODO: Key type off of attributes?
        let startingWeaponRarity: GlobalConst.RARITY = GlobalConst.RARITY.COMMON;

        if (GameConfig.TEST_GEAR_ENABLED) {
            console.log("TEST: testing gear enabled");
            startingWeaponRarity = GameConfig.TEST_STARTING_WEAPON;
        }

        //Getting attributes list with high values to help guide starting gear
        let highAttribs: string[] = [];
        if (this._brawn > 14) {
            highAttribs.push("br");
        }
        if (this._spirit > 14) {
            highAttribs.push("sp");
        }
        if (this._agility > 14) {
            highAttribs.push("ag");
        }
        if (highAttribs.length == 0) {
            //we've got no high weapon stats, so ensure highest
            if (this._brawn >= this._spirit && this._brawn >= this._agility) {
                highAttribs.push("br");
            } else if (this._spirit >= this._brawn && this._spirit >= this._agility) {
                highAttribs.push("sp");
            } else if (this._agility >= this._spirit && this._agility >= this._brawn) {
                highAttribs.push("ag");
            }
        }

        highAttribs = ArrayUtil.Shuffle(highAttribs);

        //STARTING WEAPON
        let weaponTypes: GlobalConst.WEAPON_BASE_TYPE[] = [];
        if (highAttribs[0] == "br") {
            weaponTypes = [
                GlobalConst.WEAPON_BASE_TYPE.AXE,
                GlobalConst.WEAPON_BASE_TYPE.SWORD,
                GlobalConst.WEAPON_BASE_TYPE.HAMMER,
                GlobalConst.WEAPON_BASE_TYPE.SPEAR,
            ];
        } else if (highAttribs[0] == "ag") {
            weaponTypes = [GlobalConst.WEAPON_BASE_TYPE.DAGGER, GlobalConst.WEAPON_BASE_TYPE.BOW];
        } else if (highAttribs[0] == "sp") {
            weaponTypes = [GlobalConst.WEAPON_BASE_TYPE.WAND, GlobalConst.WEAPON_BASE_TYPE.STAFF];
        }
        weaponTypes = ArrayUtil.Shuffle(weaponTypes);

        let selectedType = weaponTypes[0];
        if (GameConfig.TEST_GEAR_ENABLED && GameConfig.TEST_WEAPON_TYPE != undefined) {
            selectedType = GameConfig.TEST_WEAPON_TYPE;
        }

        let weapon: Item = WeaponFactory.instance.CreateRandomWeapon(
            this.game,
            startingWeaponRarity,
            this.game.data.map.cr,
            selectedType,
        );
        // ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.COND_POISON, weapon);
        this.GiveItem(weapon, true);

        //STARTING ARMOR
        highAttribs = ArrayUtil.Shuffle(highAttribs);
        let armorType: GlobalConst.ARMOR_BASE_TYPE = GlobalConst.ARMOR_BASE_TYPE.ARMOR_LIGHT;
        if (highAttribs[0] == "br") {
            armorType = GlobalConst.ARMOR_BASE_TYPE.ARMOR_HEAVY;
        } else if (highAttribs[0] == "ag") {
            armorType = GlobalConst.ARMOR_BASE_TYPE.ARMOR_LIGHT;
        } else if (highAttribs[0] == "sp") {
            armorType = GlobalConst.ARMOR_BASE_TYPE.ROBES;
        }
        let startingArmorRarity: GlobalConst.RARITY = GlobalConst.RARITY.COMMON;
        if (GameConfig.TEST_GEAR_ENABLED) {
            console.log("TEST: testing gear enabled");
            startingArmorRarity = GameConfig.TEST_STARTING_ARMOR;
        }

        let armor: Item = ArmorFactory.instance.CreateRandomArmor(
            this.game,
            startingArmorRarity,
            this.game.data.map.cr,
            armorType,
        );
        this.GiveItem(armor, true);

        if (GameConfig.TEST_GEAR_TESTING_KIT) {
            console.log("DEBUG: Giving Test Kit");

            /*
            this.GiveItem(ConsumableFactory.instance.CreateScroll(this.game, GlobalConst.SPELLS.STUN_DWELLER));
            this.GiveItem(ConsumableFactory.instance.CreateScroll(this.game, GlobalConst.SPELLS.SUMMON_DWELLER));
            this.GiveItem(ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.UNCOMMON, 3));
            this.GiveItem(ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.RARE, 3));
            this.GiveItem(ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.EPIC, 3));
            this.GiveItem(ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.LEGENDARY, 3));
            this.GiveItem(ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.RARE, 3));
            this.GiveItem(ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.EPIC, 3));
            this.GiveItem(ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.UNCOMMON, 3));
*/
            this.keys = 1;
            //this.GiveItem(ConsumableFactory.instance.CreateScroll(this.game, GlobalConst.SPELLS.TELEPORT));
            this.GiveItem(ConsumableFactory.instance.CreateTestDeathPotion(this.game));
            this.GiveItem(ConsumableFactory.instance.CreateTestWinPotion(this.game));
            /*
            this.GiveItem(
                ConsumableFactory.instance.CreatePotionByEnhancementId(
                    this.game,
                    GlobalConst.RARITY.EPIC,
                    2,
                    GlobalConst.ITEM_ENHANCEMENTS.CURE_ALL,
                ),
            );
*/
            //this.GiveItem(ConsumableFactory.instance.CreateTestWinPotion(this.game));
            // this.GiveItem(ConsumableFactory.instance.CreateTestWinPotion(this.game));
            //this.GiveItem(ConsumableFactory.instance.CreateScroll(this.game, GlobalConst.SPELLS.MAPPING));
            /*
            this.GiveItem(
                ConsumableFactory.instance.CreateScrollAOE(
                    this.game,
                    GlobalConst.SPELLS.AOE_DWELLER,
                    GlobalConst.DAMAGE_TYPES.POISON,
                    2,
                ),
            );
*/
            // give ring of insight
            // let jewelry: Item = JewelryFactory.instance.CreateRandomJewelry(this.game, GlobalConst.RARITY.UNCOMMON, 1);
            /*
            let ring: Item = ItemGenCommon.GenerateItem(
                this.game,
                GlobalConst.ITEM_BASE_TYPE.RING,
                GlobalConst.RARITY.UNCOMMON,
                2,
            );
            ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.COND_INSIGHT, ring);
            this.GiveItem(ring, true);

             */
            /*
            this.GiveItem(
                WeaponFactory.instance.CreateRandomWeapon(
                    this.game,
                    GlobalConst.RARITY.UNCOMMON,
                    2,
                    WEAPON_BASE_TYPE.SWORD,
                ),
            );
            this.GiveItem(
                WeaponFactory.instance.CreateRandomWeapon(
                    this.game,
                    GlobalConst.RARITY.UNCOMMON,
                    2,
                    WEAPON_BASE_TYPE.SPEAR,
                ),
            );
            */

            // this.GiveItem(ConsumableFactory.instance.CreateScroll(this.game, GlobalConst.SPELLS.STUN_DWELLER));
            //this.GiveItem(ConsumableFactory.instance.CreateScroll(this.game, GlobalConst.SPELLS.REVEAL_TRAPS));
            // this.GiveItem(
            //   ConsumableFactory.instance.CreatePotionByName(this.game, "Healing", GlobalConst.RARITY.UNCOMMON, 2),
            // );
            // this.GiveItem(ConsumableFactory.instance.CreateScroll(this.game, GlobalConst.SPELLS.POISON_DWELLER));
            // this.GiveItem(WeaponFactory.instance.CreateDebugWeapon(this.game));
            /*
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.RARE, 2));
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.RARE, 3));
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.RARE, 2));
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.RARE, 3));
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.RARE, 2));
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.RARE, 3));
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.RARE, 4));
            this.GiveItem(ArmorFactory.instance.CreateRandomArmor(this.game, GlobalConst.RARITY.LEGENDARY, 2));

             */

            // this._hp -= 25;
        }

        // starting food
        this.GiveItem(
            ItemGenCommon.GenerateItem(
                this.game,
                GlobalConst.CONSUMABLE_BASE_TYPE.FOOD,
                GlobalConst.RARITY.UNCOMMON,
                this.game.data.map.cr,
            ),
        );

        this.GiveItem(
            ItemGenCommon.GenerateItem(
                this.game,
                GlobalConst.CONSUMABLE_BASE_TYPE.FOOD,
                GlobalConst.RARITY.UNCOMMON,
                this.game.data.map.cr,
            ),
        );

        //Couple starting fun items.
        this.GiveItem(
            ConsumableFactory.instance.CreateRandomPotion(this.game, GlobalConst.RARITY.COMMON, this.game.data.map.cr),
        );

        if (GameConfig.TEST_GEAR_ENABLED) {
            this.GiveItem(
                ConsumableFactory.instance.CreateRandomPotion(
                    this.game,
                    GameConfig.TEST_STARTING_POTION,
                    this.game.data.map.cr,
                ),
            );

            this.GiveItem(
                ItemGenCommon.GenerateItem(
                    this.game,
                    GlobalConst.ITEM_BASE_TYPE.SCROLL,
                    GameConfig.TEST_STARTING_SCROLL,
                    this.game.data.map.cr,
                ),
            );

            let jwlryKind: GlobalConst.JEWELRY_BASE_TYPE = RandomUtil.instance.fromEnum(GlobalConst.JEWELRY_BASE_TYPE);
            this.GiveItem(
                ItemGenCommon.GenerateItem(
                    this.game,
                    jwlryKind,
                    GameConfig.TEST_STARTING_JEWELERY,
                    this.game.data.map.cr,
                ),
            );

            this.GiveItem(
                ItemGenCommon.GenerateItem(
                    this.game,
                    jwlryKind,
                    GameConfig.TEST_STARTING_JEWELERY,
                    this.game.data.map.cr,
                ),
            );

            this.GiveItem(
                ItemGenCommon.GenerateItem(
                    this.game,
                    GlobalConst.ITEM_BASE_TYPE.SHIELD,
                    GameConfig.TEST_STARTING_SHIELD,
                    this.game.data.map.cr,
                ),
            );
        }
    }

    Spawn(x: number, y: number) {
        if (this.mapEntity != null && this.mapEntity.isPlaced()) {
            //assuming character reload, so old mapentity can be removed.
        }
        if (this.mapEntity == null) {
            this.mapEntity = new MapEntity(this.game);
        }
        this.mapEntity.pos = new MapPos(x, y);
    }

    ModifyHunger(amount: number) {
        // 0 = starving, 100 = full
        this._hunger += amount;
        this._hunger = MathUtil.clamp(this._hunger, 0, 100); // must be between 0 and 100
        // console.log("hunger is now " + this.hunger + " after change of " + amount);

        if (this.hunger == 0) {
            if (!ConditionManager.instance.HasConditionInnate(this, GlobalConst.CONDITION.STARVING)) {
                this.game.dungeon.AddMessageEvent("You are starving!");
                ConditionManager.instance.GiveCondition(
                    this,
                    GlobalConst.CONDITION.STARVING,
                    GlobalConst.SOURCE_TYPE.INNATE,
                );
            }
        } else if (this.hunger < 10) {
            if (!ConditionManager.instance.HasConditionInnate(this, GlobalConst.CONDITION.HUNGRY)) {
                this.game.dungeon.AddMessageEvent("You are hungry...");
                ConditionManager.instance.GiveCondition(
                    this,
                    GlobalConst.CONDITION.HUNGRY,
                    GlobalConst.SOURCE_TYPE.INNATE,
                );
            }
        } else {
            if (ConditionManager.instance.HasConditionInnate(this, GlobalConst.CONDITION.HUNGRY)) {
                this.game.dungeon.AddMessageEvent("You are no longer hungry.");
                ConditionManager.instance.RemoveConditionSource(
                    this,
                    GlobalConst.CONDITION.HUNGRY,
                    GlobalConst.SOURCE_TYPE.INNATE,
                );
            }
            if (ConditionManager.instance.HasConditionInnate(this, GlobalConst.CONDITION.STARVING)) {
                this.game.dungeon.AddMessageEvent("You are no longer starving!");
                ConditionManager.instance.RemoveConditionSource(
                    this,
                    GlobalConst.CONDITION.STARVING,
                    GlobalConst.SOURCE_TYPE.INNATE,
                );
            }
        }
    }

    ModifyGold(amount: number) {
        if (amount > 0) {
            this.game.data.stats.goldLooted += amount;
        }
        this.gold += amount;
    }

    TurnClockStep(current_turn: number) {
        this.CheckTimed();
        if (current_turn % this.hungerRate == 0) this.ModifyHunger(-1);
    }

    PickupItem(item: Item) {
        this.game.data.stats.itemsLooted++;
        item.doPlayerPickup(this);
    }

    GetStackableMatchInInventory(item: Item): InventoryItem {
        if (!GameConfig.ALLOW_STACKING) return null;
        for (let i of this.inventory) {
            if (
                i.item.baseType == item.baseType &&
                i.item.nameBase == item.nameBase &&
                i.item.namePost == item.namePost &&
                i.item.rarity == item.rarity &&
                // could do the effects comparison better?
                i.item.value == item.value
                //
                // i.item.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.USE).length ==
                //     item.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.USE).length &&
                // i.item.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.USE)[0].type ==
                //     item.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.USE)[0].type &&
                // i.item.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.USE)[0].amount_base ==
                //     item.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.USE)[0].amount_base
            ) {
                return i;
            }
        }
        return null;
    }

    GiveItem(item: Item, equip: boolean = false) {
        // try to stack
        let stackableInvItem: InventoryItem = this.GetStackableMatchInInventory(item);
        if (stackableInvItem) {
            stackableInvItem.item.uses += item.uses;
        } else {
            // Note that pickup triggered effects won't fire, only use for inventory items
            let invItem: InventoryItem = new InventoryItem(this.game, item);
            this.inventory.push(invItem);

            if (equip) {
                this.SetEquipByItemId(item.id, true);
            }
        }
        this.$inventoryChanged = true;
    }

    RemoveItem(invItem: InventoryItem) {
        if (invItem.equippedslot != GlobalConst.EQUIPMENT_SLOT.NONE) throw new Error("trying to remove equipped item");
        this.$inventoryChanged = true;
        this.inventory = ArrayUtil.remove(this.inventory, invItem);
    }

    GetFirstItemInSlot(slot: GlobalConst.EQUIPMENT_SLOT): Item | null {
        // I think we should move this from the inventory items responsibility to track to having a centralized equipped slots struture that enforces 1 thing per slot, is easy to query without looping, etc
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].equippedslot == slot) {
                return this.inventory[i].item;
            }
        }
        return null;
    }

    GetAllEquippedItems(): Item[] {
        let equipped_items: Item[] = [];
        for (const slot of Object.values(GlobalConst.EQUIPMENT_SLOT)) {
            let i: Item = this.GetFirstItemInSlot(slot);
            if (i) equipped_items.push(i);
        }
        return equipped_items;
    }

    GetAllItemsInSlot(slot: GlobalConst.EQUIPMENT_SLOT): Item[] {
        let items: Item[] = [];
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].equippedslot == slot) {
                items.push(this.inventory[i].item);
            }
        }
        return items;
    }

    GetInvItemById(id: number): InventoryItem | null {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].item.id == id) {
                return this.inventory[i];
            }
        }
        return null;
    }

    IsItemEquipped(item: Item): boolean {
        const invItem: InventoryItem = this.GetInvItemById(item.id);
        if (invItem) {
            if (invItem.equippedslot && invItem.equippedslot != GlobalConst.EQUIPMENT_SLOT.NONE) {
                // item is equipped
                return true;
            }
        }
        return false;
    }

    UseItemById(itemId: number, targetDweller: Dweller = undefined) {
        let invItem: InventoryItem = this.GetInvItemById(itemId);
        if (invItem == undefined) throw new Error("No Inventory Item found with id " + itemId);

        invItem.item.Use(targetDweller);
    }

    DeleteItemById(itemId: number) {
        let invItem: InventoryItem = this.GetInvItemById(itemId);
        if (invItem == undefined) throw new Error("No Inventory Item found with id " + itemId);

        this.RemoveItem(invItem);

        //dereferencing
        invItem.item.flags = FlagUtil.Set(invItem.item.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);
        invItem.item = null;
    }

    SetEquipByItemId(itemId: number, putOn: boolean) {
        let invItem: InventoryItem = this.GetInvItemById(itemId);
        let targetSlot = Item.GetEquipSlotByType(invItem.item.baseType as GlobalConst.ITEM_BASE_TYPE);
        if (invItem == undefined) throw new Error("No Inventory Item found with id " + itemId);
        if (invItem.item.slot != targetSlot) {
            throw new Error("Inventory Item slot error : " + targetSlot + " != " + invItem.item.slot);
        }


        //console.log("setting equip by item id", itemId, putOn);
        if (putOn) {


            // First run any equip-relevant skill checks
            this.OnEquipSkillChecks(invItem.item);

            // unequip anything that's already in the slot, unless it's Jewelry, in which case only unequip if all jewelry slots are taken
            if (invItem.item.slot == GlobalConst.EQUIPMENT_SLOT.JEWELRY) {
                // TODO move this value to a constants/config file
                if (this.GetAllItemsInSlot(GlobalConst.EQUIPMENT_SLOT.JEWELRY).length == 3) {
                    this.UnequipBySlot(targetSlot);
                }
            } else {
                // console.log("unequipping existing item in slot + " + targetSlot);
                this.UnequipBySlot(targetSlot);
            }
            // If it's a 2H weapon, unequip shield and save it in $lastShield
            if (FlagUtil.IsSet(invItem.item.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED)) {
                this.lastShield = this.UnequipBySlot(GlobalConst.EQUIPMENT_SLOT.SHIELD);
                if (this.lastShield) {
                    this.game.dungeon.AddMessageEvent("Equipped a two-handed weapon, so shield was unequipped.");
                }
            }

            // If it's a shield, unequip 2H weapon
            if (invItem.item.slot == GlobalConst.EQUIPMENT_SLOT.SHIELD) {
                let w: Item = this.GetActiveWeapon();
                if (FlagUtil.IsSet(w.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED)) {
                    this.UnequipByItemID(w.id, false);
                    this.game.dungeon.AddMessageEvent(
                        "Equipped a shield, so " + w.nameBase + " (two-handed) was unequipped.",
                    );
                }
            }

            // then equip this item
            invItem.equippedslot = targetSlot;
            this.game.dungeon.AddMessageEvent("You equip " + invItem.item.name, [GlobalConst.MESSAGE_FLAGS.APPEND]);

            // and apply any equip effect
            // console.log("applying equip effect");
            invItem.item.ApplyEffectsByTrigger(
                GlobalConst.EFFECT_TRIGGERS.EQUIP,
                this,
                GlobalConst.SOURCE_TYPE.EQUIPMENT,
                itemId,
            );
            if (invItem.item.effects != undefined && invItem.item.effects.length > 0) {
                this.$effectsChanged = true;
            }
        } else {
            this.UnequipByItemID(itemId);
        }
        this.$inventoryChanged = true;
    }

    EquipLastWeapon(validateOnly: boolean = false): boolean {
        if (this.lastWeapon) {
            if (this.GetInvItemById(this.lastWeapon.id)) {
                if (!validateOnly) {
                    this.game.dungeon.AddMessageEvent("You swap weapons.", [GlobalConst.MESSAGE_FLAGS.APPEND]);
                    this.SetEquipByItemId(this.lastWeapon.id, true);
                }
                return true;
            }
        } else {
            // try equipping first available weapon, if no previous was equipped
            for (const i of this.inventory) {
                if (i.item.isWeapon() && i.item != this.GetActiveWeapon()) {
                    if (!validateOnly) this.SetEquipByItemId(i.item.id, true);
                    return true;
                }
            }
        }
        return false;
    }

    UnequipBySlot(slot: GlobalConst.EQUIPMENT_SLOT): Item {
        let item_to_remove = this.GetFirstItemInSlot(slot);
        if (item_to_remove != null) {
            this.UnequipByItemID(item_to_remove.id);
        }
        return item_to_remove;
    }

    UnequipByItemID(itemId: number, shieldSwap: boolean = true) {
        // this is the canonical Unequip function, everything else that unequips must end up going through this
        let inv_item_to_remove = this.GetInvItemById(itemId);

        if (!inv_item_to_remove) {
            // was hitting an issue where this was undefined. If that's the case, return
            console.warn("tried & failed to unequip item id: " + itemId + "(it's probably a fist pseudo-weapon)");
            return;
        }

        // if it's a weapon, store in $lastWeapon
        if (inv_item_to_remove.equippedslot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
            this.lastWeapon = inv_item_to_remove.item;

            // and if it's a 2H weapon, try swapping shield back
            if (
                FlagUtil.IsSet(inv_item_to_remove.item.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED) &&
                this.lastShield &&
                shieldSwap
            ) {
                let invShield: InventoryItem;
                if ((invShield = this.GetInvItemById(this.lastShield.id))) {
                    this.SetEquipByItemId(invShield.item.id, true);
                }
            }
        }

        // set invItem slot to NONE
        inv_item_to_remove.equippedslot = GlobalConst.EQUIPMENT_SLOT.NONE;

        // remove any EQUIP triggered effect
        // let effects_to_remove = item_to_remove.GetEffectsByTrigger(GlobalConst.EFFECT_TRIGGERS.EQUIP);
        let new_effects_list: Effect[] = [];
        for (let i = 0; i < this.effects.length; i++) {
            if (!EffectUtil.CheckSource(this.effects[i].source, GlobalConst.SOURCE_TYPE.EQUIPMENT, itemId)) {
                // only keep effect if the source doesn't match the item id
                new_effects_list.push(this.effects[i]);
            } else {
                // Unapply usually does nothing/isn't needed, but in some cases it's useful
                this.effects[i].Unapply(this);

                // remove any conditions from this item as well
                ConditionManager.instance.RemoveAllConditionsBySource(this, GlobalConst.SOURCE_TYPE.EQUIPMENT, itemId);
            }
            if (inv_item_to_remove.item.effects != undefined && inv_item_to_remove.item.effects.length > 0) {
                this.$effectsChanged = true;
            }
        }
        this.effects = new_effects_list;
        this.$inventoryChanged = true;
    }

    GetActiveWeapon(): Item {
        let wpn: Item = this.GetFirstItemInSlot(GlobalConst.EQUIPMENT_SLOT.WEAPON);
        if (wpn == null) {
            wpn = WeaponFactory.instance.CreateFist(this.game);
        }
        return wpn;
    }

    //TODO: Probably need a more sensible way to do this
    public GetAttackMessage(wpn: Item, isHit: boolean) {
        let msg_hit = ["You hit the [name] with your " + wpn.name];
        let msg_miss = ["Your miss the [name] with your " + wpn.name];
        if (isHit) {
            return RandomUtil.instance.fromArray(msg_hit);
        } else {
            return RandomUtil.instance.fromArray(msg_miss);
        }
    }

    private GetTotalOfEffectsByType(eff_type: GlobalConst.EFFECT_TYPES): number {
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

    get defense(): number {
        return (
            0 +
            GlobalConst.GetDefBonusSpirit(this._spirit) +
            this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.DEFENSE)
        );
    }

    public GetAttributeByType(att: GlobalConst.ATTRIBUTES): number {
        switch (att) {
            case GlobalConst.ATTRIBUTES.BRAWN:
                return this.brawn;
            case GlobalConst.ATTRIBUTES.AGILITY:
                return this.agility;
            case GlobalConst.ATTRIBUTES.GUILE:
                return this.guile;
            case GlobalConst.ATTRIBUTES.SPIRIT:
                return this.spirit;
            default:
                throw new Error("unknown attribute " + att);
        }
    }

    get brawn(): number {
        return this._brawn + this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.BRAWN);
    }

    get agility(): number {
        return this._agility + this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.AGILITY);
    }

    get guile(): number {
        return this._guile + this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.GUILE);
    }

    get spirit(): number {
        return this._spirit + +this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.SPIRIT);
    }

    get hunger(): number {
        return this._hunger;
    }

    get block(): number {
        let block = this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.BLOCK);
        // Check globalSkills
        // Hammer Expert - id 17
        if (this.skillIds.includes(17) && this.GetActiveWeapon().baseType == GlobalConst.ITEM_BASE_TYPE.HAMMER) {
            block += GameUtil.GetSkillById(17).modifiers.custom;
        }

        // Shield expert - id 21
        if (this.skillIds.includes(21) && this.GetAllItemsInSlot(GlobalConst.EQUIPMENT_SLOT.SHIELD).length > 0) {
            block += GameUtil.GetSkillById(21).modifiers.custom;
        }
        return block;
    }

    get dodge(): number {
        return (
            0 +
            GlobalConst.GetDodgeBonusByAgility(this._agility) +
            this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.DODGE)
        );
    }

    get luck(): number {
        return (
            this._luck +
            GlobalConst.GetGuileLuckBonus(this.guile) +
            this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.LUCK)
        );
    }

    ModifyBaseLuck(luckChange: number) {
        this._luck += luckChange;
    }

    //TODO: These need to break out all the possible additions as seperate values by source
    get tohit(): number {
        let toHitBonus: number = 0;
        // to hit bonus is dependant on what kind of weapon we're using
        switch (this.GetActiveWeapon().baseType) {
            case GlobalConst.ITEM_BASE_TYPE.BOW:
            case GlobalConst.ITEM_BASE_TYPE.DAGGER:
                toHitBonus += GlobalConst.GetToHitBonusByBAGS(this.agility);
                break;
            case GlobalConst.ITEM_BASE_TYPE.STAFF:
            case GlobalConst.ITEM_BASE_TYPE.WAND:
                // ... or a spirit weapon
                toHitBonus += GlobalConst.GetToHitBonusByBAGS(this.spirit);
                break;
            default:
                // ..or else it's brawn
                toHitBonus += GlobalConst.GetToHitBonusByBAGS(this.brawn);
        }
        // Check globalSkills
        // Sword Expert - id 13
        if (this.skillIds.includes(13) && this.GetActiveWeapon().baseType == GlobalConst.ITEM_BASE_TYPE.SWORD) {
            toHitBonus += GameUtil.GetSkillById(13).modifiers.custom;
        }
        // Spear Expert - id 15
        if (this.skillIds.includes(15) && this.GetActiveWeapon().baseType == GlobalConst.ITEM_BASE_TYPE.SPEAR) {
            toHitBonus += GameUtil.GetSkillById(15).modifiers.custom;
        }
        // Return the BAGS-based bonus + any bonuses from applied effect
        return toHitBonus + this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.TOHIT);
    }

    override get damageBonusAdditive(): number {
        // this is based on BAGS plus any universal +dam effect (e.g. ring of damage +2)
        let damBonus: number = 0;
        // damage bonus is dependant on what kind of weapon we're using
        switch (this.GetActiveWeapon().baseType) {
            // if it's an agility type weapon, use agility
            case GlobalConst.ITEM_BASE_TYPE.BOW:
            case GlobalConst.ITEM_BASE_TYPE.DAGGER:
                damBonus += GlobalConst.GetDamageBonusByBAGS(this.agility);
                break;
            case GlobalConst.ITEM_BASE_TYPE.STAFF:
            case GlobalConst.ITEM_BASE_TYPE.WAND:
                // ... or a spirit weapon
                damBonus += GlobalConst.GetDamageBonusByBAGS(this.spirit);
                break;
            case GlobalConst.ITEM_BASE_TYPE.SCROLL:
            case GlobalConst.ITEM_BASE_TYPE.POTION:
                // ... or a spirit weapon
                damBonus += GlobalConst.GetDamageBonusByBAGS(this.guile);
                break;
            default:
                // ..or else it's brawn
                damBonus += GlobalConst.GetDamageBonusByBAGS(this.brawn);
        }
        // Return the BAGS-based bonus + any bonuses from applied effect
        return damBonus + this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER);
    }

    override GetDamageBonusMultiplier(defender: Dweller): number {
        // TODO biome is currently ignored, where do we query biome from?? (Below returns an Environment object instead)
        // let biome:GlobalConst.BIOME = this.game.data.map.biome
        let multiplier = 1;

        // check for any bonuses vs this phylum of dweller
        // effect list to check includes both character effect and active weapon effect
        let relevant_effs = Effect.FilterEffectsListByType(
            // this.effect.concat(this.GetActiveWeapon().effect),
            this.effects,
            GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER,
        );
        relevant_effs.forEach((eff) => {
            if (
                defender.$data != undefined &&
                defender.$data.phylum != undefined &&
                (eff.bonus_dam_dweller_type == defender.$data.phylum || eff.bonus_dam_dweller_type == undefined)
            ) {
                // just adds the %s
                if (eff.bonus_dam_percent) {
                    multiplier += eff.bonus_dam_percent / 100;
                }
            }
        });
        if (multiplier > 1) console.log("damage multipier: x" + multiplier);
        return multiplier;
    }

    get crit(): number {
        let critBonus: number = 0;
        critBonus += GlobalConst.GetGuileCritBonus(this.guile);

        // Check globalSkills
        // Axe Expert - id 12
        if (this.skillIds.includes(12) && this.GetActiveWeapon().baseType == GlobalConst.ITEM_BASE_TYPE.AXE) {
            critBonus += GameUtil.GetSkillById(12).modifiers.custom;
        }
        // Dagger Expert - id 14
        if (this.skillIds.includes(14) && this.GetActiveWeapon().baseType == GlobalConst.ITEM_BASE_TYPE.DAGGER) {
            critBonus += GameUtil.GetSkillById(14).modifiers.custom;
        }
        // Return the BAGS-based bonus + any bonuses from applied effect
        return critBonus + this.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.CRIT);
    }

    get range(): number {
        let range: number = this.GetActiveWeapon().GetRange();

        // Skill Check - Grieger's Reach id 56
        if (range == 1 && this.skillIds.includes(56)) {
            range = 2;
        }
        return range;
    }

    public get immunities(): GlobalConst.DAMAGE_TYPES[] {
        let eff: Effect[] = Effect.FilterEffectsListByType(this.effects, GlobalConst.EFFECT_TYPES.IMMUNE);
        let damagetypes: GlobalConst.DAMAGE_TYPES[] = [];
        // eliminate dupes
        damagetypes = damagetypes.filter((item, i, ar) => ar.indexOf(item) === i);
        for (let e = 0; e < eff.length; e++) {
            damagetypes.push(eff[e].damage_type);
        }
        return damagetypes;
    }

    public get resistances(): GlobalConst.DAMAGE_TYPES[] {
        let eff: Effect[] = Effect.FilterEffectsListByType(this.effects, GlobalConst.EFFECT_TYPES.RESIST);
        let damagetypes: GlobalConst.DAMAGE_TYPES[] = [];
        // eliminate dupes
        damagetypes = damagetypes.filter((item, i, ar) => ar.indexOf(item) === i);
        for (let e = 0; e < eff.length; e++) {
            damagetypes.push(eff[e].damage_type);
        }
        return damagetypes;
    }

    public get vulnerabilities(): GlobalConst.DAMAGE_TYPES[] {
        let eff: Effect[] = Effect.FilterEffectsListByType(this.effects, GlobalConst.EFFECT_TYPES.VULNERABLE);
        let damagetypes: GlobalConst.DAMAGE_TYPES[] = [];
        // eliminate dupes
        damagetypes = damagetypes.filter((item, i, ar) => ar.indexOf(item) === i);
        for (let e = 0; e < eff.length; e++) {
            damagetypes.push(eff[e].damage_type);
        }
        return damagetypes;
    }

    private OnEquipSkillChecks(i: Item) {
        // Skill Check - Arkan's Strength id 36
        // unset 2h flag on weapon if char has skill
        if (this.skillIds.includes(36) && FlagUtil.IsSet(i.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED)) {
            console.log("setting " + i.name + " to 1H because of skill 36 arkan's strength");
            i.itemFlags = FlagUtil.UnSet(i.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED);
        }

        // Skill Check - Grieger's Reach id 56
        // set range to 2 on melee weapon if char has skill
        if (this.skillIds.includes(56) && i.GetRange() == 1) {
            console.log("setting " + i.name + " range to 2 because of skill 56 grieger's reach");
            i.SetRange(2);
        }
    }

    //epitaph will be autogenerated if not passed
    protected Die(killerType: GlobalConst.DAMAGE_SOURCE, killerName: string) {
        let epitaph = "";

        if (killerType == "dweller") {
            epitaph = "killed by a " + killerName + ".";
        } else if (killerType == "trap") {
            epitaph = "killed by a " + killerName + " trap.";
        } else {
            epitaph = "killed by: " + killerName;
        }

        this.game.data.flags = FlagUtil.Set(this.game.data.flags, GlobalConst.GAMESTATE_FLAGS.PLAYER_DEAD);
        this.game.data.flags = FlagUtil.Set(this.game.data.flags, GlobalConst.GAMESTATE_FLAGS.RUN_CONCLUDED);

        this.game.data.stats.PlayerDied(this.game.data.turn, killerType, killerName, epitaph);
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.PLAYER_DEAD, {
            deathMessage: epitaph,
        } as M_TurnEvent_PlayerDead);

        DBInterface.writeSessionToDB("" + this.game.data.campaignId, this.game);
    }

    public Escape() {
        this.game.data.flags = FlagUtil.Set(this.flags, GlobalConst.GAMESTATE_FLAGS.RUN_CONCLUDED);
        this.game.data.stats.PlayerWon(this.game.data.turn);
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.PLAYER_EXIT, {
            escapeMessage: "Defeated the dungeon!",
        } as M_TurnEvent_PlayerEscape);
        this.initializedForRun = false;
        this.game.dungeon.character.idcounter = this.game.data.idcounter;
        DBInterface.writeSessionToDB("" + this.game.data.campaignId, this.game);
    }
}

export default Character;
