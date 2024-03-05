import GlobalConst from "../../types/globalConst";
import Game from "../../game";
import TrapData from "./TrapData";
import { M_TrapTrigger, M_TurnEvent_Names } from "../../types/globalTypes";
import { DamageResult } from "../../types/types";
import Trap from "../trap";
import FlagUtil from "../../utils/flagUtil";
import Effect from "../../effect/effect";
import EffectUtil from "../../effect/effectUtil";

export default class TrapDataGas extends TrapData {
    kind: GlobalConst.TRAP_TYPES; //unique key name for each
    storyevent: GlobalConst.STORY_EVENT_KEYS; //story event to trigger after reveal

    constructor() {
        super(GlobalConst.TRAP_TYPES.GAS, GlobalConst.STORY_EVENT_KEYS.TRAP_GAS);
        this.ascii = "Õ";
    }

    Trigger(game: Game, trap: Trap) {
        let avoided: boolean = this.CheckAvoid(game);
        let resultText: string = "Trap! Rolling to avoid...\n" + this.GetRollDescription(game) + "\n";
        resultText += avoided ? "*** SUCCESS! ****" : "*** FAIL ***";
        resultText += "\n\n";
        if (avoided) {
            resultText +=
                "A gas trap! How quaint! It's been a while since you've encountered one. After a brief coughing fit brought on by the minty-tasting poison (not your favorite), you find yourself admiring the craftsmanship of the room: no doubt this trapmaker would lure many to their deaths! Not you, though. ";
        } else {
            let amount: number = Math.min(
                Math.floor(game.dungeon.character.hp * 0.3),
                Math.floor(game.dungeon.character.hpmax * 0.15),
            );
            let damageResult: DamageResult = game.dungeon.character.doDamage(
                amount,
                GlobalConst.DAMAGE_TYPES.POISON,
                GlobalConst.DAMAGE_SOURCE.TRAP,
                "Gas Trap",
                0,
                true,
            );

            resultText +=
                "A greenish brown glass ball drops from the ceiling and shatters, filling the room with an acrid smoke. The stinging gas fills your lungs, forcing you to cough hoarsely and gasp for breath until you lose consciousness. And you had finally gotten over your bout of Deldian croup! ";

            for (let i = 0; i < 4; i++) {
                let eff: Effect = new Effect(game);
                eff.amount_base = -2;
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

                eff.turns = 30;
                eff.Apply(game.dungeon.character);
            }

            resultText +=
                "\n\n" +
                this.getDamageDescriptionFromResult(damageResult) +
                "\n" +
                "-2 to all attributes for 30 turns.";
        }

        let details: M_TrapTrigger = {
            title: "Gas Trap",
            result: resultText,
            trap: GlobalConst.TRAP_TYPES.GAS,
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.TRAP_TRIGGER, details);
        game.dungeon.character.checkForDeath(GlobalConst.DAMAGE_SOURCE.TRAP, "Gas Trap");

        trap.RemoveMeAndSpawnStoryEventVersion(game);
    }
}
