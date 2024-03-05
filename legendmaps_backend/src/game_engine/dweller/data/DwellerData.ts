import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import Dweller from "../dweller";
import MapPos from "../../utils/mapPos";
import {ProbTable} from "../../utils/probTable";
import WeaponFactory from "../../item/itemgen/weaponFactory";
import ArmorFactory from "../../item/itemgen/armorFactory";
import TreasureFactory from "../../item/itemgen/treasureFactory";
import ConsumableFactory from "../../item/itemgen/consumableFactory";
import JewelryFactory from "../../item/itemgen/jewelryFactory";
import ItemGenCommon from "../../item/itemgen/itemGenCommon";
import Item from "../../item/item";
import StoryEvent from "../../story/storyEvent";
import Merchant from "../../merchant/merchant";
import NumberRange from "../../utils/numberRange";
import DwellerUtil from "./DwellerUtil";
import Effect from "../../effect/effect";
import EffectUtil from "../../effect/effectUtil";
import {M_StoryEventOutcome} from "../../types/globalTypes";
import Character from "../../character/character";

class DwellerData {
    kind: GlobalConst.DWELLER_KIND;
    phylum: GlobalConst.DWELLER_PHYLUM;
    ascii: GlobalConst.DWELLER_ASCII;
    startingStateName: string = "wander";
    size: GlobalConst.DWELLER_SIZE = GlobalConst.DWELLER_SIZE.MEDIUM;
    alertness: GlobalConst.DWELLER_ALERT_LEVELS = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
    speed: GlobalConst.DWELLER_SPEED = GlobalConst.DWELLER_SPEED.NORMAL;
    resistances: GlobalConst.DAMAGE_TYPES[];
    immunities: GlobalConst.DAMAGE_TYPES[];
    vulnerabilities: GlobalConst.DAMAGE_TYPES[];
    rarity: GlobalConst.RARITY = GlobalConst.RARITY.UNCOMMON;
    lootType: GlobalConst.DWELLER_LOOT_TYPE = GlobalConst.DWELLER_LOOT_TYPE.NONE;

    level_names: string[] = [];
    level_number_appearing: number[];
    level_hp: number[];
    level_def: number[];
    level_block: number[];
    level_dodge: number[];
    basic_attack: DwellerAttackData;

    special_attack_cooldown: number = 3;

    special_attack_description: string = "none";

    static BASE_HP: number = 25;
    static BASE_DEF: number = 5;
    static BASE_DODGE: number = 5;
    static BASE_BLOCK: number = 0;

    constructor(kind: GlobalConst.DWELLER_KIND, ascii: GlobalConst.DWELLER_ASCII, phylum: GlobalConst.DWELLER_PHYLUM) {
        this.kind = kind;
        this.ascii = ascii;
        this.phylum = phylum;
        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.TREASURE_ONLY;
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        //console.log("checking special attack: none");
        return false;
    }

    CheckSpecialOnDeath(dweller: Dweller): boolean {
        //console.log("checking special attack: none");
        return false;
    }

    //numberAppearingSteps
    protected setDefaultBaseValues(): void {
        // CAUTION: These parameters change the default base values for ALL Dwellers
        this.setBaseHp(DwellerData.BASE_HP);
        this.setBaseDef(DwellerData.BASE_DEF);
        this.setBaseDodge(DwellerData.BASE_DODGE);
        this.setBaseBlock(DwellerData.BASE_BLOCK);
    }

    protected setBaseHp(baseHp: number = DwellerData.BASE_HP): void {
        this.level_hp = DwellerUtil.MapChallengeValues(
            Math.round(baseHp),
            [1, 1.5, 2, 2.5, 3, 3.5], // e.g. at base_HP of 30, values are 30, 45,
            this.level_number_appearing,
        );
    }

    protected setBaseDef(baseDef: number = DwellerData.BASE_DEF): void {
        this.level_def = DwellerUtil.MapChallengeValues(
            Math.round(baseDef),
            [1, 1.1, 1.2, 1.3, 1.4, 1.5],
            this.level_number_appearing,
        );
    }

    protected setBaseDodge(baseDodge: number = DwellerData.BASE_DODGE): void {
        this.level_dodge = DwellerUtil.MapChallengeValues(
            Math.round(baseDodge),
            [1, 1.25, 1.5, 1.75, 2, 2.25],
            this.level_number_appearing,
        );
    }

    protected setBaseBlock(baseBlock: number = DwellerData.BASE_BLOCK): void {
        this.level_block = DwellerUtil.MapChallengeValues(
            Math.round(baseBlock),
            [1, 1.25, 1.5, 1.75, 2, 2.25],
            this.level_number_appearing,
        );
    }

    public DropLoot(dweller: Dweller, pos: MapPos) {
        let lootTable: ProbTable<string> = new ProbTable<string>();

        if (dweller.$data.lootType == GlobalConst.DWELLER_LOOT_TYPE.NONE) {
            return;
        } else if (dweller.$data.lootType == GlobalConst.DWELLER_LOOT_TYPE.TREASURE_ONLY) {
            lootTable.add("treasure", 90);
            lootTable.add("none", 10);
        } else if (dweller.$data.lootType == GlobalConst.DWELLER_LOOT_TYPE.BEAST) {
            lootTable.add("treasure", 40);
            lootTable.add("food", 40);
            lootTable.add("jewelry", 5);
            lootTable.add("none", 15);
        } else if (dweller.$data.lootType == GlobalConst.DWELLER_LOOT_TYPE.HUMANOID) {
            lootTable.add("weapon", 25);
            lootTable.add("armor", 25);
            lootTable.add("keys", 50);
            lootTable.add("food", 75);
            lootTable.add("treasure", 150);
            lootTable.add("jewelry", 5);
            lootTable.add("none", 100);
        } else if (dweller.$data.lootType == GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER) {
            lootTable.add("potion", 75);
            lootTable.add("food", 25);
            lootTable.add("treasure", 150);
            lootTable.add("scroll", 75);
            lootTable.add("jewelry", 25);
            lootTable.add("none", 100);
        }

        // console.log("LOOT TYPE IS " + dweller.$data.lootType);
        let item: Item;
        let curMap = dweller.game.data.map;

        // for random items of unspecified rarity, choose a random rarity between 1 and maxRarity.
        let randomRarity: GlobalConst.RARITY = ItemGenCommon.GetRandomRarityByCR(dweller.level);

        let content: string = lootTable.roll();

        if (content == "weapon") {
            // Weapon
            item = WeaponFactory.instance.CreateRandomWeapon(dweller.game, randomRarity, curMap.cr);
        } else if (content == "armor") {
            // Armor
            item = ArmorFactory.instance.CreateRandomArmor(dweller.game, randomRarity, curMap.cr);
        } else if (content == "keys") {
            // Keys
            item = TreasureFactory.instance.CreateKeysbyRarity(dweller.game, randomRarity, curMap.cr);
        } else if (content == "potion") {
            //  Potion
            item = ConsumableFactory.instance.CreateRandomPotion(dweller.game, randomRarity, curMap.cr);
        } else if (content == "treasure") {
            // treasure
            item = TreasureFactory.instance.CreateRandomTreasure(dweller.game, randomRarity, curMap.cr);
        } else if (content == "food") {
            // Food
            item = ConsumableFactory.instance.CreateRandomFood(dweller.game, randomRarity, curMap.cr);
        } else if (content == "scroll") {
            // scroll
            item = ConsumableFactory.instance.CreateRandomScroll(dweller.game, randomRarity, curMap.cr);
        } else if (content == "jewelry") {
            // jewelry
            item = JewelryFactory.instance.CreateRandomJewelry(dweller.game, randomRarity, curMap.cr);
        }
        if (item) {
            item.Spawn(pos.x, pos.y);
        }

        if (dweller.carriedItem != null) {
            dweller.carriedItem.Spawn(pos.x, pos.y);
            dweller.carriedItem = null;
        }
    }

    protected ApplyCurseEffect(
        pc: Character,
        name: string,
        attrib: GlobalConst.ATTRIBUTES | "all",
        duration: number,
        amount: number,
    ) {
        if (attrib == "all") {
            this.ApplyCurseEffect(pc, name, GlobalConst.ATTRIBUTES.BRAWN, duration, amount);
            this.ApplyCurseEffect(pc, name, GlobalConst.ATTRIBUTES.AGILITY, duration, amount);
            this.ApplyCurseEffect(pc, name, GlobalConst.ATTRIBUTES.GUILE, duration, amount);
            this.ApplyCurseEffect(pc, name, GlobalConst.ATTRIBUTES.SPIRIT, duration, amount);

            return;
        }
        let eff = new Effect(pc.game);
        eff.name = name;
        if (attrib == GlobalConst.ATTRIBUTES.GUILE) {
            eff.type = GlobalConst.EFFECT_TYPES.GUILE;
        } else if (attrib == GlobalConst.ATTRIBUTES.AGILITY) {
            eff.type = GlobalConst.EFFECT_TYPES.AGILITY;
        } else if (attrib == GlobalConst.ATTRIBUTES.BRAWN) {
            eff.type = GlobalConst.EFFECT_TYPES.BRAWN;
        } else if (attrib == GlobalConst.ATTRIBUTES.SPIRIT) {
            eff.type = GlobalConst.EFFECT_TYPES.SPIRIT;
        }

        eff.amount_base = -amount;
        eff.turns = duration;
        eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, -1);
        eff.trigger = GlobalConst.EFFECT_TRIGGERS.TIMED;
        eff.Apply(pc);
    }
}

namespace DwellerData {
}

export default DwellerData;
