import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import StoryEvent from "../../storyEvent";
import GlobalConst from "../../../types/globalConst";

export default class StoryEffectDamage extends StoryEventEffect {
    usepercentage: boolean = true;
    amount: number = 100; //either 1-100 for percentage or flat amount if not
    damageType: GlobalConst.DAMAGE_TYPES;
    damageSource: string = "";

    constructor(damageAmount: number, isPercentOfMax: boolean, type: GlobalConst.DAMAGE_TYPES, source: string) {
        super();
        this.usepercentage = isPercentOfMax;
        this.amount = damageAmount;
        this.damageSource = source;
        this.damageType = type;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let amount: number = !this.usepercentage
            ? this.amount
            : Math.round(game.dungeon.character.hpmax * (this.amount / 100));
        game.dungeon.character.doDamage(
            amount,
            this.damageType,
            GlobalConst.DAMAGE_SOURCE.EVENT,
            this.damageSource,
            0,
            false,
        );
        let eventDetails: M_StoryEventOutcome = {
            text: "\nLost " + amount + " hp.",
            vfx: "",
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.STORY_EVENT_OUTCOME, eventDetails);
    }
}
