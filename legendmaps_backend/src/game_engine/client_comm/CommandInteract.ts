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
import Merchant from "../merchant/merchant";
import ConditionManager from "../effect/conditionManager";

export default class CommandInteract extends Command {
    private targetTile: MapTile;
    private char: Character;
    private invalidCommand: boolean = false;
    constructor(game: Game, x: number, y: number) {
        super(game);
        this.duration = 0;
        this.char = this.game.dungeon.character; //shorthand
        this.targetTile = this.game.data.map.GetTileIfExists(x, y);
    }

    Validate(): boolean {
        if (!this.invalidCommand && this.targetTile != undefined) {
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

        let storyEventInTile: StoryEvent | null = this.game.dungeon.GetStoryEventInTile(
            this.targetTile.pos.x,
            this.targetTile.pos.y,
        );

        let merchantInTile: Merchant | null = this.game.dungeon.GetMerchantInTile(
            this.targetTile.pos.x,
            this.targetTile.pos.y,
        );

        if (merchantInTile != null) {
            merchantInTile.OpenMerchant();
        } else if (storyEventInTile != null) {
            storyEventInTile.StartEvent();
        } else {
            this.game.dungeon.AddMessageEvent("Nothing to interact with.");
        }
    }
}
