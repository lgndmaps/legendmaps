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
import StoryEvent from "../story/storyEvent";

export default class CommandStoryEventOption extends Command {
    public optionIndex: number;

    constructor(game: Game, index: number) {
        super(game);
        this.duration = 0;
        this.optionIndex = index;
    }

    Validate(): boolean {
        if (this.optionIndex != undefined && this.optionIndex > -1) {
            return true;
        } else {
            return false;
        }
    }

    Execute() {
        super.Execute();
        if (
            this.game.$activeEvent == undefined ||
            this.game.$activeEvent.cname != GlobalConst.ENTITY_CNAME.STORYEVENT
        ) {
            throw new Error("Trying to execute story event option but event not active");
        }
        let se = this.game.$activeEvent as StoryEvent;
        se.SelectOption(this.optionIndex);
    }
}
