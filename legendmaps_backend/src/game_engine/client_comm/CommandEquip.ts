import Character from "../character/character";
import type Game from "../game";
import {GameMessageEquip} from "../types/globalTypes";
import Command from "./Command";
import ConditionManager from "../effect/conditionManager";
import GlobalConst from "../types/globalConst";
import * as Sentry from "@sentry/node";

export default class CommandEquip extends Command {
    private equipMessage: GameMessageEquip;
    private char: Character;
    private invalidCommand: boolean = false;

    constructor(game: Game, equipMessage: GameMessageEquip) {
        super(game);
        this.char = this.game.dungeon.character; //shorthand
        this.equipMessage = equipMessage;
        this.duration = 1;
    }

    Validate(): boolean {
        if (!this.invalidCommand) {
            return true;
        } else {
            Sentry.captureMessage("Invalid Equip Command: " + JSON.stringify(this.equipMessage));
            return false;
        }
    }

    Execute() {
        super.Execute();

        if (ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.STUNNED)) {
            this.game.dungeon.AddMessageEvent("You are stunned.");
            return;
        }


        this.char.SetEquipByItemId(this.equipMessage.id, this.equipMessage.puton);
    }
}
