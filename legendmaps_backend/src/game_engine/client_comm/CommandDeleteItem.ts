import e from "express";
import Character from "../character/character";
import CombatAttack from "../combat/combatAttack";
import Dweller from "../dweller/dweller";
import Entity from "../base_classes/entity";
import Item from "../item/item";
import type Game from "../game";
import GlobalConst from "../types/globalConst";
import MapTile from "../map/mapTile";
import {
    GameMessageDeleteItem,
    GameMessageEquip,
    M_TurnEvent_Names,
    M_TurnEvent_PlayerMove,
} from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import MapPos from "../utils/mapPos";
import MapUtil from "../utils/mapUtil";
import Command from "./Command";

export default class CommandDeleteItem extends Command {
    private deleteMessage: GameMessageDeleteItem;
    private char: Character;
    private invalidCommand: boolean = false;

    constructor(game: Game, deleteMessage: GameMessageDeleteItem) {
        super(game);
        this.char = this.game.dungeon.character; //shorthand
        this.deleteMessage = deleteMessage;
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
        // console.log("Executing equip message: " + JSON.stringify(this.equipMessage));
        this.char.DeleteItemById(this.deleteMessage.id);
    }
}
