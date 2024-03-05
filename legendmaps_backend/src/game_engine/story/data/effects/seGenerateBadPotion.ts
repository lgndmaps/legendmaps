import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import ItemGenCommon from "../../../item/itemgen/itemGenCommon";
import type Item from "../../../item/item";
import StoryEvent from "../../storyEvent";
import RandomUtil from "../../../utils/randomUtil";
import GameUtil from "../../../utils/gameUtil";
import ConsumableFactory from "../../../item/itemgen/consumableFactory";

export default class StoryEffectGenerateBadPotion extends StoryEventEffect {
    probability: number = 1; //used to have a chance to generate no loot

    constructor(probability: number = 1) {
        super();
        if (probability > 1 || probability < 0) {
            throw new Error("Probability must be between 0 and 1");
        }
        this.probability = probability;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        if (this.probability < 1) {
            if (RandomUtil.instance.random() >= this.probability) {
                return;
            }
        }
        let loot: Item = ConsumableFactory.instance.CreatePotionByEnhancementId(
            game,
            GlobalConst.RARITY.UNCOMMON,
            4,
            GlobalConst.ITEM_ENHANCEMENTS.COND_POISON_CONSUMABLE,
        );
        game.dungeon.character.PickupItem(loot);
        let eventDetails: M_StoryEventOutcome = {
            text: "The potion looks questionable...",
        };
        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
