import GlobalConst from "../../types/globalConst";
import Game from "../../game";
import TrapData from "./TrapData";
import { M_TrapTrigger, M_TurnEvent_Names } from "../../types/globalTypes";
import Trap from "../trap";
import FlagUtil from "../../utils/flagUtil";
import Effect from "../../effect/effect";
import EffectUtil from "../../effect/effectUtil";
import Spells from "../../effect/spells";

export default class TrapDataWeb extends TrapData {
    kind: GlobalConst.TRAP_TYPES; //unique key name for each
    storyevent: GlobalConst.STORY_EVENT_KEYS; //story event to trigger after reveal

    constructor() {
        super(GlobalConst.TRAP_TYPES.WEB, GlobalConst.STORY_EVENT_KEYS.TRAP_WEB);
        this.ascii = "Ô";
    }

    Trigger(game: Game, trap: Trap) {
        let avoided: boolean = this.CheckAvoid(game);
        let resultText: string = "Trap! Rolling to avoid...\n" + this.GetRollDescription(game) + "\n";
        resultText += this.lastAvoidRoll + " ";
        resultText += avoided ? "*** SUCCESS! ****" : "*** FAIL ***";
        resultText += "\n\n";
        if (avoided) {
            resultText +=
                "A clicking sound in the distance confirms your instincts: you were about to stumble straight into a giant spider's web. You chuckle wryly to yourself as you touch your torch's flame to the strands of spider-web ahead of you, and wait for the fire to spread and do their job. The frenzied clicking that ensues a minute later tells you that you won't be made a meal of today.  ";
        } else {
            let eff: Effect = new Effect(game);
            eff.amount_base = 0;
            eff.trigger = GlobalConst.EFFECT_TRIGGERS.TIMED;
            eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, -1);
            eff.type = GlobalConst.EFFECT_TYPES.GIVES_CONDITION;
            eff.condition = GlobalConst.CONDITION.HELD;
            eff.turns = 5;
            eff.Apply(game.dungeon.character);

            resultText +=
                "What you assumed was just garden-variety dungeon detritus turns out to be the stickiest material you've ever come into contact with, and the more you flail as you attempt to free yourself, the tighter you are bound in this interconnected lattice of strings. And what are these large eight-legged creatures approaching? You think to yourself that they resemble spiders, only far larger and more terrifying as they crawl across these strands of— oh, it's a web. You're caught in a web.";

            resultText += "\n\nHELD for 5 turns. Spider appeared.";
            Spells.SummonDweller(game, game.dungeon.character, GlobalConst.DWELLER_KIND.GIANT_SPIDER);
        }

        let details: M_TrapTrigger = {
            title: "Web Trap",
            result: resultText,
            trap: GlobalConst.TRAP_TYPES.WEB,
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.TRAP_TRIGGER, details);
        game.dungeon.character.checkForDeath(GlobalConst.DAMAGE_SOURCE.TRAP, "Web Trap");

        trap.RemoveMeAndSpawnStoryEventVersion(game);
    }
}
