import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import ItemGenCommon from "../../../item/itemgen/itemGenCommon";
import type Item from "../../../item/item";
import StoryEvent from "../../storyEvent";
import RandomUtil from "../../../utils/randomUtil";
import NumberRange from "../../../utils/numberRange";

export default class TrapDisarmReward extends StoryEventEffect {
    constructor() {
        super();
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let chance: number = 25;

        if (game.dungeon.character.traitIds.includes(23)) {
            chance = 75;
        }

        if (RandomUtil.instance.percentChance(chance)) {
            if (game.dungeon.character.traitIds.includes(23)) {
                let randomRarity: GlobalConst.RARITY = ItemGenCommon.GetRandomRarityByCR(game.data.map.cr);
                let loot = ItemGenCommon.GenerateItem(
                    game,
                    GlobalConst.ITEM_BASE_TYPE.POTION,
                    randomRarity,
                    game.data.map.cr,
                );
                game.dungeon.character.PickupItem(loot);
                let eventDetails: M_StoryEventOutcome = {
                    text: "[Tinkerer] You find a " + loot.name + ".",
                };
                game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
            } else {
                let amountRange: NumberRange = new NumberRange(5, 15);
                let amount: number = amountRange.roll();
                game.dungeon.character.gold += amount;
                let eventDetails: M_StoryEventOutcome = {
                    text: "You find " + amount + " gold!",
                    vfx: "placeholdergoldgain",
                };

                game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
            }
        }
    }
}
