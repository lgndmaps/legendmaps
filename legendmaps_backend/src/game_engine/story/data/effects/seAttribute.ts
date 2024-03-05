import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import ConditionManager from "../../../effect/conditionManager";
import StoryEvent from "../../storyEvent";
import Effect from "../../../effect/effect";
import EffectUtil from "../../../effect/effectUtil";
import GameUtil from "../../../utils/gameUtil";

export default class StoryEffectAttribute extends StoryEventEffect {
    duration: number = 0;
    amount: number = 1;
    attrib: GlobalConst.ATTRIBUTES;
    constructor(attrib: GlobalConst.ATTRIBUTES, amount: number) {
        //PERMANANT!
        super();
        this.amount = amount;
        this.attrib = attrib;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        if (this.attrib == GlobalConst.ATTRIBUTES.GUILE) {
            game.dungeon.character._guile += this.amount;
        } else if (this.attrib == GlobalConst.ATTRIBUTES.BRAWN) {
            game.dungeon.character._brawn += this.amount;
        } else if (this.attrib == GlobalConst.ATTRIBUTES.AGILITY) {
            game.dungeon.character._agility += this.amount;
        } else if (this.attrib == GlobalConst.ATTRIBUTES.SPIRIT) {
            game.dungeon.character._spirit += this.amount;
        }

        let eventDetails: M_StoryEventOutcome = {
            text: this.attrib + " permanently changed by " + this.amount + ". ",
            //vfx: "placeholderheal",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
