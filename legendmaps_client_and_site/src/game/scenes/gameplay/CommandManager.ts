import {websocketManager} from "../../util/websockets";
import {
    GameMessageAttack,
    GameMessageDeleteItem,
    GameMessageEquip,
    GameMessageInteract,
    GameMessageMove,
    GameMessageShop,
    GameMessageStoryEventOption,
    GameMessageUse,
    GameMessageWait,
} from "../../types/globalTypes";
import GlobalConst from "../../types/globalConst";
import {GameMapTile} from "./map/GameMapTile";
import InputManager from "./InputManager";
import Dweller from "./entities/Dweller";

export default class CommandManager {
    private static _instance: CommandManager;


    public static get instance() {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;

    }

    public get webSocketManager() {
        return websocketManager;
    }

    SendAttack(targetTile: GameMapTile) {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.ATTACK,
            tileX: targetTile.x,
            tileY: targetTile.y,
        } as GameMessageAttack);
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendInteract(targetTile: GameMapTile) {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.INTERACT,
            tileX: targetTile.x,
            tileY: targetTile.y,
        } as GameMessageInteract);
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendWait() {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.WAIT,
        } as GameMessageWait);
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendMove(param: GlobalConst.MOVE_DIR) {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.MOVE,
            dir: param,
        } as GameMessageMove);
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendEquip(itemID: number, slot: GlobalConst.EQUIPMENT_SLOT, putOnItem: boolean) {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.EQUIP,
            id: itemID,
            slot: slot,
            puton: putOnItem,
        } as GameMessageEquip);
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendSwapWeapon() {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.SWAP_WEAPON,
        });
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendDelete(itemId: number) {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.DELETE_ITEM,
            id: itemId,
        } as GameMessageDeleteItem);
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendUse(itemID: number, dweller?: Dweller) {
        let msg = {
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.USE,
            id: itemID,
        } as GameMessageUse;
        if (dweller != undefined) {
            msg.dwellerX = dweller.tile.x;
            msg.dwellerY = dweller.tile.y;
            msg.dwellerId = dweller.id;
        }
        websocketManager.sendInput(msg);

        InputManager.instance.awaitingServerUpdate = true;
    }

    SendStoryEventOption(index: number) {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.STORYEVENT_OPTION,
            index: index,
        } as GameMessageStoryEventOption);
        InputManager.instance.awaitingServerUpdate = true;
    }

    SendMerchantAction(close: boolean, itemid: number = 0, steal: boolean = false) {
        websocketManager.sendInput({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT,
            commandMessageType: GlobalConst.GAME_COMMAND_TYPE.SHOP,
            close: close,
            itemid: itemid,
            steal: steal,
        } as GameMessageShop);
        InputManager.instance.awaitingServerUpdate = true;
    }
}
