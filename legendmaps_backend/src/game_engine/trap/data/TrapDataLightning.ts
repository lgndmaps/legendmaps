import GlobalConst from "../../types/globalConst";
import Game from "../../game";
import TrapData from "./TrapData";
import { M_TrapTrigger, M_TurnEvent_Names } from "../../types/globalTypes";
import { DamageResult } from "../../types/types";
import Trap from "../trap";
import FlagUtil from "../../utils/flagUtil";
import Effect from "../../effect/effect";
import EffectUtil from "../../effect/effectUtil";

export default class TrapDataLightning extends TrapData {
    kind: GlobalConst.TRAP_TYPES; //unique key name for each
    storyevent: GlobalConst.STORY_EVENT_KEYS; //story event to trigger after reveal

    constructor() {
        super(GlobalConst.TRAP_TYPES.LIGHTNING, GlobalConst.STORY_EVENT_KEYS.TRAP_LIGHTNING);
        this.ascii = "Ö";
    }

    Trigger(game: Game, trap: Trap) {
        let avoided: boolean = this.CheckAvoid(game);
        let resultText: string = "Trap! Rolling to avoid...\n" + this.GetRollDescription(game) + "\n";
        resultText += this.lastAvoidRoll + " ";
        resultText += avoided ? "*** SUCCESS! ***" : "*** FAIL ***";
        resultText += "\n\n";
        if (avoided) {
            resultText +=
                "You feel a tingling on the surface of your skin as energy crackles up and down your body. After a few moments, you find the sensation rather invigorating and look forward to getting down to some serious exploring. Quite nice of the denizens of this dungeon to provide you with some sort of magical restorative, you think, before realizing they were in fact attempting to kill you. ";
        } else {
            let amount: number = Math.min(
                Math.floor(game.dungeon.character.hp * 0.4),
                Math.floor(game.dungeon.character.hpmax * 0.2),
            );
            let damageResult: DamageResult = game.dungeon.character.doDamage(
                amount,
                GlobalConst.DAMAGE_TYPES.ELECTRIC,
                GlobalConst.DAMAGE_SOURCE.TRAP,
                "Lightning Trap",
                0,
                true,
            );

            let eff: Effect = new Effect(game);
            eff.amount_base = -3;
            eff.trigger = GlobalConst.EFFECT_TRIGGERS.TIMED;
            eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.TEMPORARY, -1);
            eff.type = GlobalConst.EFFECT_TYPES.AGILITY;
            eff.turns = 30;
            eff.Apply(game.dungeon.character);

            resultText +=
                "As you foot hits the ground your body seizes with an incredible force and is wracked with pain. You try to pull away, but the current running through your foot has you frozen in place. You manage to rip away in time, but the convulsions that continue remind you to be a bit more vigilant in the future.";

            resultText +=
                "\n\n" + this.getDamageDescriptionFromResult(damageResult) + "\n" + "-3 to agility for 30 turns.";
        }

        let details: M_TrapTrigger = {
            title: "Lightning Trap",
            result: resultText,
            trap: GlobalConst.TRAP_TYPES.LIGHTNING,
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.TRAP_TRIGGER, details);
        game.dungeon.character.checkForDeath(GlobalConst.DAMAGE_SOURCE.TRAP, "Lightning Trap");

        trap.RemoveMeAndSpawnStoryEventVersion(game);
    }
}
