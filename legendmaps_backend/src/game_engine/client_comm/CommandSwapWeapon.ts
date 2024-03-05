import Character from "../character/character";
import type Game from "../game";
import { GameMessageEquip } from "../types/globalTypes";
import Command from "./Command";
import ConditionManager from "../effect/conditionManager";
import GlobalConst from "../types/globalConst";

export default class CommandSwapWeapon extends Command {
    // private equipMessage: GameMessageEquip;
    private char: Character;
    private invalidCommand: boolean = false;

    constructor(game: Game) {
        super(game);
        this.char = this.game.dungeon.character; //shorthand
        // this.equipMessage = equipMessage;
        this.duration = 1;
    }

    Validate(): boolean {
        if (!this.char.EquipLastWeapon(true)) this.invalidCommand = true;

        if (!this.invalidCommand) {
            return true;
        } else {
            console.log("swap command invalid");
            this.game.dungeon.AddMessageEvent("You can't swap weapons; no previously equipped weapon to swap to.", [
                GlobalConst.MESSAGE_FLAGS.APPEND,
            ]);
            return false;
        }
    }

    Execute() {
        super.Execute();
        console.log("swapping weapon");
        this.char.EquipLastWeapon();
    }
}
