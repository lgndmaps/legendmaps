import StoryEventOption from "../storyEventOption";
import StoryEventData from "../storyEventData";
import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import StoryEvent from "../../storyEvent";
import Effect from "../../../effect/effect";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import EffectUtil from "../../../effect/effectUtil";

export default class StoryEffectAllAttributes extends StoryEventEffect {
    name: string;
    amount: number;
    turns: number;

    constructor(name: string, amount: number, turns: number = 100) {
        super();
        this.name = name;
        this.amount = amount;
        this.turns = turns;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        for (let i = 0; i < 4; i++) {
            let eff: Effect = new Effect(game);
            eff.amount_base = this.amount;
            eff.amount_max = 0;
            eff.trigger = GlobalConst.EFFECT_TRIGGERS.TIMED;
            eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, -1);
            if (i == 0) {
                eff.type = GlobalConst.EFFECT_TYPES.BRAWN;
            } else if (i == 1) {
                eff.type = GlobalConst.EFFECT_TYPES.AGILITY;
            } else if (i == 2) {
                eff.type = GlobalConst.EFFECT_TYPES.GUILE;
            } else if (i == 3) {
                eff.type = GlobalConst.EFFECT_TYPES.SPIRIT;
            }

            eff.turns = this.turns;
            eff.Apply(game.dungeon.character);
        }
        let txt = "\nAll attributes ";
        txt += this.amount > 0 ? "+" : "";
        txt += this.amount + " for " + this.turns + " turns.";
        let eventDetails: M_StoryEventOutcome = {
            text: txt,
            //vfx: "placeholderheal",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
