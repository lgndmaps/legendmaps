import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import ItemGenCommon from "../../../item/itemgen/itemGenCommon";
import type Item from "../../../item/item";
import StoryEvent from "../../storyEvent";
import RandomUtil from "../../../utils/randomUtil";
import GameUtil from "../../../utils/gameUtil";

export default class StoryEffectGenerateLoot extends StoryEventEffect {
    probability: number = 1; //used to have a chance to generate no loot
    item_types: GlobalConst.ITEM_BASE_TYPE[] | "any" = "any";
    item_rarities: GlobalConst.RARITY[] | "any" = "any";
    forcecr: number = -1;
    constructor(
        probability: number = 1,
        item_types: GlobalConst.ITEM_BASE_TYPE[] | "any" = "any",
        item_rarities: GlobalConst.RARITY[] | "any" = "any",
        forcecr: number = -1,
    ) {
        super();
        if (probability > 1 || probability < 0) {
            throw new Error("Probability must be between 0 and 1");
        }
        this.probability = probability;

        this.item_rarities = item_rarities;
        this.item_types = item_types;
        this.forcecr = forcecr;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let loot: Item;
        if (this.probability < 1) {
            if (RandomUtil.instance.random() >= this.probability) {
                return;
            }
        }
        let rarity: GlobalConst.RARITY;
        if (this.item_rarities == "any") {
            rarity = ItemGenCommon.GetRandomRarity();
        } else {
            rarity = RandomUtil.instance.fromArray(this.item_rarities);
        }

        let cr = this.forcecr != -1 ? this.forcecr : game.data.map.cr;
        if (this.item_types == "any") {
            let item_type: GlobalConst.ITEM_BASE_TYPE = null;
            while (item_type == null || item_type == GlobalConst.ITEM_BASE_TYPE.KEY) {
                //no keys from generate loot function
                item_type = RandomUtil.instance.fromEnum(GlobalConst.ITEM_BASE_TYPE);
            }

            loot = ItemGenCommon.GenerateItem(game, item_type, rarity, cr);
        } else {
            let item_type = RandomUtil.instance.fromArray(this.item_types);
            loot = ItemGenCommon.GenerateItem(game, item_type, rarity, cr);
        }
        let desc = loot.name;

        if (!loot.isTreasure() && !loot.isKey()) {
            desc += ", ";
            const rarity = GameUtil.GetRarityString(loot.rarity);
            if (["a", "e", "i", "o", "u"].includes(rarity[0].toLowerCase())) {
                desc += "an ";
            } else {
                desc += "a ";
            }
            desc += rarity + " " + loot.baseType + ".";
        }
        let eventDetails: M_StoryEventOutcome = {
            text: "\n  *" + desc + "",
        };
        game.dungeon.character.PickupItem(loot);
        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
