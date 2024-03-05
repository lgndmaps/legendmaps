import Entity from "../base_classes/entity";
import Game from "../game";
import GlobalConst from "../types/globalConst";
import FlagUtil from "../utils/flagUtil";
import ObjectUtil from "../utils/objectUtil";
import MapEntity from "../map/mapEntity";
import ENTITY_FLAGS = GlobalConst.ENTITY_FLAGS;
import {
    MerchantD,
    M_StoryEventReveal,
    M_TurnEvent_Names,
    M_MerchantReveal,
    M_ItemMerchant,
    M_InventoryItem,
    M_Effect,
    M_Item,
    M_MerchantResponse,
} from "../types/globalTypes";
import MerchantFactory from "./merchantFactory";
import MerchantData from "./data/merchantData";
import Item from "../item/item";
import RandomUtil from "../utils/randomUtil";
import ItemGenCommon from "../item/itemgen/itemGenCommon";
import InventoryItem from "../item/inventoryItem";
import e = require("cors");
import Spells from "../effect/spells";
import GameUtil from "../utils/gameUtil";

export default class Merchant extends Entity {
    $data: MerchantData;
    inventory: Item[] = [];
    invLoaded: boolean = false;

    //following values are recalculated on open, so we don't save
    $price_multiplier: number = 1;
    $steal_chance: number = 0.3;
    $price_desc: string = "";
    $steal_desc: string = "";

    constructor(game: Game, json: MerchantD | "" = "", kind: GlobalConst.MERCHANT_TYPES | "" = "") {
        super(game, json);
        this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, ENTITY_FLAGS.BLOCKS_VISION);
        this.cname = GlobalConst.ENTITY_CNAME.MERCHANT;

        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            this.$data = MerchantFactory.instance.GetMerchantData(this.kind as GlobalConst.MERCHANT_TYPES);
            if (json.mapEntity != undefined) {
                this.mapEntity = new MapEntity(this.game, json.mapEntity);
                this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "_";
            }
            this.inventory = [];
            for (let i = 0; i < json.inventory.length; i++) {
                this.inventory.push(new Item(this.game, json.inventory[i]));
            }
        } else {
            if (kind == "" || !ObjectUtil.enumContainsString(GlobalConst.MERCHANT_TYPES, kind)) {
                throw new Error("trying to construct merchant of invalid kind: " + kind);
            }
            this.kind = kind;
            this.$data = MerchantFactory.instance.GetMerchantData(this.kind as GlobalConst.MERCHANT_TYPES);
            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "@";
        }
    }

    Spawn(x: number, y: number) {
        if (this.game.data.map.GetTileIfExists(x, y).$event) {
            throw new Error("Attempting to spawn two events in same tile.");
        }
        this.game.data.map.GetTileIfExists(x, y).$event = true;
        super.Spawn(x, y);
    }

    //Called when merchant first opened (initially OR after restoring a save).
    private Initialize() {
        if (!this.invLoaded) {
            this.invLoaded = true;
            this.RefreshMerchantInventory();
        }
        this.$price_multiplier = 1;
        let guile = this.game.dungeon.character.guile;
        let guileAdjust = GlobalConst.GetPriceAdjustByGuile(guile);
        this.$price_multiplier -= guileAdjust / 100;
        if (guileAdjust != 0) {
            if (guileAdjust > 0) {
                this.$price_desc = "-" + Math.round(guileAdjust) + "% from guile";
            } else if (guileAdjust < 0) {
                this.$price_desc = "+" + Math.round(guileAdjust) + "% from guile";
            }
        }
        if (this.game.dungeon.character.traitIds.includes(88)) {
            //merchant
            this.$price_multiplier -= 0.25;
            if (this.$price_desc != "") {
                this.$price_desc += ", ";
            }
            this.$price_desc += "-25% from merchant trait";
        } else if (this.game.dungeon.character.traitIds.includes(89)) {
            //profligate
            this.$price_multiplier += 0.2;
            if (this.$price_desc != "") {
                this.$price_desc += ", ";
            }
            this.$price_desc += "+20% from profligate trait";
        }
        if (this.game.dungeon.character.traitIds.includes(98)) {
            //awkward
            this.$price_multiplier += 0.1;
            if (this.$price_desc != "") {
                this.$price_desc += ", ";
            }
            this.$price_desc += "+10% from awkward trait";
        }
        if (this.game.dungeon.character.traitIds.includes(90)) {
            //charming
            this.$price_multiplier -= 0.1;
            if (this.$price_desc != "") {
                this.$price_desc += ", ";
            }
            this.$price_desc += "-10% from charming trait";
        }
        if (this.game.dungeon.character.traitIds.includes(91)) {
            //intimidating
            this.$price_multiplier -= 0.05;
            if (this.$price_desc != "") {
                this.$price_desc += ", ";
            }
            this.$price_desc += "-5% from intimidating trait";
        }

        //steal
        this.$steal_chance = 0.3;
        this.$steal_chance += (guileAdjust * 2) / 100; //18 guile add 16% to chance.
        this.$steal_desc = "";

        if (this.game.dungeon.character.traitIds.includes(92)) {
            //deceptive
            this.$steal_chance += 0.3;
            this.$steal_desc = "[bonus from deceptive trait]";
        }
        if (this.game.dungeon.character.traitIds.includes(79)) {
            //cutpurse
            this.$steal_chance += 0.2;
            this.$steal_desc = "[bonus from cutpurse trait]";
        }
        // Skills -- Gains Goblin "discount" - id 19
        if (this.game.dungeon.character.skillIds.includes(19)) {
            const skill = GameUtil.GetSkillById(19);
            this.$steal_chance += skill.modifiers.custom / 100;
            this.$steal_desc = "[bonus from " + skill.name + " skill]";
        }

        this.$steal_desc = Math.round(this.$steal_chance * 100) + "% chance " + this.$steal_desc;
        console.log("STEAL INFO: " + this.$steal_desc + " CHANCE: " + this.$steal_chance);
    }

    OpenMerchant() {
        if (this.$price_desc == "") {
            //Lets get pricing information since this is first open
            this.Initialize();
        }
        this.game.$activeEvent = this;
        let merchItems: M_ItemMerchant[] = this.GetItemsList();

        let desc = this.$data.bodyCopy;
        desc += "\n";
        /*
        let discountFinal = Math.round(this.price_multiplier * 100) - 100;
        if (discountFinal <= 0) {
            desc += Math.abs(discountFinal) + "% discount! ";
        } else {
            desc += Math.abs(discountFinal) + "% mark up! ";
        }
         */
        desc += "$ Shop Prices: " + Math.round(this.$price_multiplier * 100) + "%";
        desc += " [" + this.$price_desc + "]";
        let eventDetails: M_MerchantReveal = {
            title: this.$data.titleCopy,
            body: desc,
            image: this.$data.image,
            stealInfo: this.$steal_desc,
            items: merchItems,
        };
        // fire turnevent
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.MERCHANT_START, eventDetails);
    }

    private GetItemsList(): M_ItemMerchant[] {
        let items: M_ItemMerchant[] = [];
        for (let i = 0; i < this.inventory.length; i++) {
            let invItem = this.inventory[i];

            let merchItem: M_Item = new Object() as M_Item;

            ObjectUtil.copyAllCommonPrimitiveValues(invItem, merchItem, ["cname"]);
            merchItem.name = invItem.name;
            merchItem.effects = [];
            for (let e = 0; e < invItem.effects.length; e++) {
                let eff: M_Effect = new Object() as M_Effect;
                ObjectUtil.copyAllCommonPrimitiveValues(invItem.effects[e], eff, ["cname", "id", "source"]);

                merchItem.effects.push(eff);
            }

            let itm = {
                price: Math.round(invItem.value * this.$price_multiplier),
                item: merchItem,
            } as M_ItemMerchant;
            items.push(itm);
        }
        return items;
    }

    Exit() {
        this.game.$activeEvent = null;
        let eventDetails: M_MerchantResponse = {
            text: "",
            closeAfter: true,
        };
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.MERCHANT_UPDATE, eventDetails);
    }

    StealItem(id: number) {
        let eventText: string = "";
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].id == id) {
                console.log("Trying to steal: " + this.inventory[i].name);
                //TODO: roll for success, give item, summon dweller if fail
                if (RandomUtil.instance.percentChance(this.$steal_chance * 100)) {
                    // success
                    eventText =
                        "You managed to swipe the " +
                        this.inventory[i].name +
                        "! The merchant looks at you with suspicion, and quickly closes up shop.";
                    this.game.dungeon.character.GiveItem(this.inventory[i]);
                } else {
                    // failed
                    eventText = "You were caught stealing! The merchant summons some guards!";
                    Spells.SummonDweller(this.game, this.game.dungeon.character, GlobalConst.DWELLER_KIND.KOBOLD);
                    Spells.SummonDweller(this.game, this.game.dungeon.character, GlobalConst.DWELLER_KIND.KOBOLD);
                }
            }
        }

        let eventDetails: M_MerchantResponse = {
            text: eventText,
            closeAfter: true,
        };
        this.DestroyMe();
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.MERCHANT_UPDATE, eventDetails);
    }

    BuyItem(id: number) {
        let eventText: string = "";

        for (let i = this.inventory.length - 1; i >= 0; i--) {
            if (this.inventory[i].id == id) {
                console.log("Buying: " + this.inventory[i].name);
                let price = Math.round(this.inventory[i].value * this.$price_multiplier); // convenience
                // check if player has enough gold, deduct gold
                if (this.game.dungeon.character.gold >= price) {
                    // deduct gold
                    this.game.dungeon.character.gold -= price;

                    this.game.data.stats.itemsPurchased++;

                    // Give player item
                    this.game.dungeon.character.GiveItem(this.inventory[i]);
                    eventText += "You bought the " + this.inventory[i].name + " for " + price + "gp.";
                    // remove from shop inventory
                    this.inventory.splice(i, 1);
                } else {
                    // can't afford it
                    eventText += "Sorry, you don't have enough gold to buy the " + this.inventory[i].name + ".";
                }
            }
        }

        let merchItems: M_ItemMerchant[] = this.GetItemsList(); //Get updated list with item removed

        let eventDetails: M_MerchantResponse = {
            text: eventText,
            closeAfter: false,
            stealInfo: this.$steal_desc,
            items: merchItems,
        };
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.MERCHANT_UPDATE, eventDetails);
    }

    RefreshMerchantInventory(): Item[] {
        for (let i = 0; i < this.$data.inventory_count; i++) {
            const itemType: GlobalConst.ITEM_BASE_TYPE = RandomUtil.instance.fromArray(this.$data.item_types);
            let randomRarity: GlobalConst.RARITY = ItemGenCommon.GetRandomRarityByCR(this.game.data.map.cr);
            if (!itemType) {
                this.inventory.push(ItemGenCommon.GenerateRandomItem(this.game, this.game.data.map.cr, randomRarity));
            } else {
                this.inventory.push(
                    ItemGenCommon.GenerateItem(this.game, itemType, randomRarity, this.game.data.map.cr),
                );
            }
        }

        return this.inventory;
    }

    DestroyMe() {
        let t = this.game.data.map.GetTileIfExists(this.mapEntity.pos.x, this.mapEntity.pos.y);
        this.$ObjectCache = {};
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);
        this.game.$activeEvent = null;
    }
}
