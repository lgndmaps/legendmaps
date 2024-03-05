import GlobalConst from "../../types/globalConst";
import Game from "../../game";
import TrapData from "./TrapData";
import { M_TrapTrigger, M_TurnEvent_Names } from "../../types/globalTypes";
import { DamageResult } from "../../types/types";
import Trap from "../trap";
import FlagUtil from "../../utils/flagUtil";

export default class TrapDataSpikedWall extends TrapData {
    kind: GlobalConst.TRAP_TYPES; //unique key name for each
    storyevent: GlobalConst.STORY_EVENT_KEYS; //story event to trigger after reveal

    constructor() {
        super(GlobalConst.TRAP_TYPES.SPIKED_WALL, GlobalConst.STORY_EVENT_KEYS.TRAP_SPIKED_WALL);
        this.ascii = "Ó";
    }

    Trigger(game: Game, trap: Trap) {
        let avoided: boolean = this.CheckAvoid(game);
        let resultText: string = "Trap! Rolling to avoid...\n" + this.GetRollDescription(game) + "\n";

        resultText += this.lastAvoidRoll + " ";
        resultText += avoided ? "*** SUCCESS! ***" : "*** FAIL ***";
        resultText += "\n\n";
        if (avoided) {
            resultText +=
                "A wall of gleaming spikes rushes towards you, and in a flash, you spot a small hole at the bottom of the wall's far corner. If you can collapse your body into a small enough space right now… WHOOSH! The wall breezes by you and crashes into the other side of the corridor with a loud scraping thud. You thank the gods once again for the brief time you spent as a contortionist in a traveling show: a more practical background than you'd think for an adventurer.";
        } else {
            let amount: number = Math.min(
                Math.floor(game.dungeon.character.hp * 0.3),
                Math.floor(game.dungeon.character.hpmax * 0.15),
            );
            let damageResult: DamageResult = game.dungeon.character.doDamage(
                amount,
                GlobalConst.DAMAGE_TYPES.PIERCE,
                GlobalConst.DAMAGE_SOURCE.TRAP,
                "Spike Trap",
                0,
                true,
            );

            resultText +=
                "The sudden rumbling you hear doesn't bode well, and the sight of ten inch spikes protruding from a wall you would've sworn was smooth a moment ago isn't ideal either. The wall speeds towards you as you desperately sprint towards freedom, only to find the path forward sealed off. Of course, you think, that's how a trap works, as the spiked wall slams into you.";

            resultText += "\n\n" + this.getDamageDescriptionFromResult(damageResult);
        }

        let details: M_TrapTrigger = {
            title: "Spike Trap",
            result: resultText,
            trap: GlobalConst.TRAP_TYPES.SPIKED_WALL,
        };

        game.dungeon.AddTurnEvent(M_TurnEvent_Names.TRAP_TRIGGER, details);
        game.dungeon.character.checkForDeath(GlobalConst.DAMAGE_SOURCE.TRAP, "Spike Trap");

        trap.RemoveMeAndSpawnStoryEventVersion(game);
    }
}
