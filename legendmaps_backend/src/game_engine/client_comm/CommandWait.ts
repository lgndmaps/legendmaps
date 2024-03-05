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
    M_TurnEvent_AttackResult,
    M_TurnEvent_DwellerKilled,
    M_TurnEvent_Names,
    M_TurnEvent_PlayerMove,
} from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import MapPos from "../utils/mapPos";
import MapUtil from "../utils/mapUtil";
import Command from "./Command";

export default class CommandWait extends Command {
    private invalidCommand: boolean = false;
    constructor(game: Game) {
        super(game);
        this.duration = 1;
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
    }
}
