import Character from "../character/character";
import type Game from "../game";
import GlobalConst from "../types/globalConst";
import { GameMessageShop } from "../types/globalTypes";
import Command from "./Command";
import Merchant from "../merchant/merchant";

export default class CommandShop extends Command {
    private msg: GameMessageShop;
    private char: Character;
    private invalidCommand: boolean = false;

    constructor(game: Game, msg: GameMessageShop) {
        super(game);
        this.char = this.game.dungeon.character; //shorthand
        this.msg = msg;
        this.duration = 0;
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
        if (this.game.$activeEvent == undefined || this.game.$activeEvent.cname != GlobalConst.ENTITY_CNAME.MERCHANT) {
            throw new Error("Trying to execute story event option but event not active");
        }
        let se = this.game.$activeEvent as Merchant;
        if (this.msg.close) {
            se.Exit();
        } else if (this.msg.steal) {
            se.StealItem(this.msg.itemid);
        } else {
            se.BuyItem(this.msg.itemid);
        }
        //this.char.UseItemById(this.msg.id);
        //console.log("Executing equip message: " + JSON.stringify(this.msg));
        //this.char.SetEquipByItemId(this.msg.id, this.msg.slot, this.msg.puton);
    }
}
