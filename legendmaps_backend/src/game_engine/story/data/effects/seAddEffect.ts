import StoryEventOption from "../storyEventOption";
import StoryEventData from "../storyEventData";
import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import StoryEvent from "../../storyEvent";
import Effect from "../../../effect/effect";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import EffectUtil from "../../../effect/effectUtil";

export default class StoryEffectAddEffect extends StoryEventEffect {
    eff_name: string;
    eff_type: GlobalConst.EFFECT_TYPES;
    amt_base: number;
    amt_max: number;
    turns: number;

    constructor(
        name: string,
        eff_type: GlobalConst.EFFECT_TYPES,
        amt_base: number,
        amt_max: number = -1,
        turns: number = 100,
    ) {
        super();
        this.eff_name = name;
        this.eff_type = eff_type;
        this.amt_base = amt_base;
        this.amt_max = amt_max;
        this.turns = turns;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let eff = new Effect(game);
        eff.name = this.eff_name;
        eff.type = this.eff_type;
        eff.amount_base = this.amt_base;
        if (this.amt_max != -1) {
            eff.amount_max = this.amt_max;
        }
        eff.turns = this.turns;
        eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, -1);
        eff.trigger = GlobalConst.EFFECT_TRIGGERS.TIMED;
        eff.Apply(game.dungeon.character);
        let eventDetails: M_StoryEventOutcome = {
            text: "\n" + eff.name + "(" + eff.type + " " + eff.$amount + " effect for " + eff.turns + " turns)",
            // vfx: "placeholderheal",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
