import Character from "../character/character";
import type Game from "../game";
import { GameMessageUse } from "../types/globalTypes";
import Command from "./Command";
import Dweller from "../dweller/dweller";
import ConditionManager from "../effect/conditionManager";
import GlobalConst from "../types/globalConst";

export default class CommandUse extends Command {
    private msg: GameMessageUse;
    private char: Character;
    private invalidCommand: boolean = false;
    private dwellerTarget?: Dweller;

    constructor(game: Game, msg: GameMessageUse) {
        super(game);
        this.char = this.game.dungeon.character; //shorthand
        this.msg = msg;
        this.duration = 1;

        if (msg.dwellerX != undefined) {
            this.dwellerTarget = this.game.dungeon.GetDwellerInTile(msg.dwellerX, msg.dwellerY);
            if (this.dwellerTarget == undefined) {
                this.invalidCommand = true;
                throw new Error("No dweller found in item target tile");
            }
            if (this.dwellerTarget.id != msg.dwellerId) {
                this.invalidCommand = true;
                throw new Error("Dweller target id mismatch");
            }
        }
    }

    Validate(): boolean {
        if (!this.invalidCommand) {
            return true;
        } else {
            return false;
        }
    }

    Execute() {
        super.Execute();

        if (ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.STUNNED)) {
            this.game.dungeon.AddMessageEvent("You are stunned.");
            return;
        }

        this.char.UseItemById(this.msg.id, this.dwellerTarget);
        //console.log("Executing equip message: " + JSON.stringify(this.msg));
        //this.char.SetEquipByItemId(this.msg.id, this.msg.slot, this.msg.puton);
    }
}
