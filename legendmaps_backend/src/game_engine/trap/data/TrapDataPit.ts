import GlobalConst from "../../types/globalConst";
import Game from "../../game";
import TrapData from "./TrapData";
import { M_TrapTrigger, M_TurnEvent_Names } from "../../types/globalTypes";
import { DamageResult } from "../../types/types";
import Trap from "../trap";
import FlagUtil from "../../utils/flagUtil";

export default class TrapDataPit extends TrapData {
    kind: GlobalConst.TRAP_TYPES; //unique key name for each
    storyevent: GlobalConst.STORY_EVENT_KEYS; //story event to trigger after reveal

    constructor() {
        super(GlobalConst.TRAP_TYPES.PIT, GlobalConst.STORY_EVENT_KEYS.TRAP_PIT);
        this.ascii = "Ò";
    }

    Trigger(game: Game, trap: Trap) {
        let avoided: boolean = this.CheckAvoid(game);
        let resultText: string = "Trap! Rolling to avoid...\n" + this.GetRollDescription(game) + "\n";
        resultText += this.lastAvoidRoll + " ";
        resultText += avoided ? "*** SUCCESS! ****" : "*** FAIL ***";
        resultText += "\n\n";
        if (avoided) {
            resultText +=
                "As soon as you feel the ground break away under you, you leap forward. It's enough to allow you to grab the edge of the pit trap and haul yourself back out unharmed. Can you dodge anything, you wonder? No, just danger, you quip to yourself, kicking a rock into the deep pit behind you. If there were another soul around to see it, you would've looked most impressive. ";
        } else {
            let amount: number = Math.min(
                Math.floor(game.dungeon.character.hp * 0.2),
                Math.floor(game.dungeon.character.hpmax * 0.1),
            );
            let damageResult: DamageResult = game.dungeon.character.doDamage(
                amount,
                GlobalConst.DAMAGE_TYPES.BLUDGEON,
                GlobalConst.DAMAGE_SOURCE.TRAP,
                "Pit Trap",
                0,
                true,
            );

            resultText +=
                "You feel your feet fall out from under you, and in some ways, it's a relief. Every adventurer knows falling in a pit is their destiny at some point, and today, it was yours. You actually find the drop itself somewhat thrilling and even start to enjoy yourself, until you remember the spikes at the bottom.";

            resultText += "\n\n" + this.getDamageDescriptionFromResult(damageResult);
        }

        let details: M_TrapTrigger = {
            title: "Pit Trap",
            result: resultText,
            trap: GlobalConst.TRAP_TYPES.PIT,
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.TRAP_TRIGGER, details);
        game.dungeon.character.checkForDeath(GlobalConst.DAMAGE_SOURCE.TRAP, "Pit Trap");

        trap.RemoveMeAndSpawnStoryEventVersion(game);
    }
}
