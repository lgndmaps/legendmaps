import { RequestWithSession } from "../../types/requests";
import Game from "../game";
import { DBInterface } from "../utils/dbInterface";
import CommandMove from "./CommandMove";
import {
    GameMessage,
    GameMessageMove,
    GameMessageEquip,
    InputMessage,
    GameMessageUse,
    GameMessageWait,
    GameMessageAttack,
    GameMessageInteract,
    GameMessageStoryEventOption,
    GameMessageDeleteItem,
    GameMessageShop,
} from "../types/globalTypes";
import { M_Game } from "../types/globalTypes";
import GlobalConst from "../types/globalConst";
import CommandEquip from "./CommandEquip";
import CommandUse from "./CommandUse";
import CommandWait from "./CommandWait";
import CommandAttack from "./CommandAttack";
import CommandInteract from "./CommandInteract";
import CommandSwapWeapon from "./CommandSwapWeapon";
import CommandStoryEventOption from "./CommandStoryEventOption";
import CommandDeleteItem from "./CommandDeleteItem";
import CommandShop from "./CommandShop";
export const maxMovesBeforeSave: number = 10;

export class CommandProcessor {
    static processInput(userId: string, request: RequestWithSession, gameMessage: GameMessage, game: Game): M_Game {
        game.dungeon.ClearTurnEvents(); //resets every command.

        //if there's an active event/shop that supercedes all other interactions.
        if (game.$activeEvent != null) {
            if (game.$activeEvent.cname == GlobalConst.ENTITY_CNAME.STORYEVENT) {
                if (gameMessage.commandMessageType != GlobalConst.GAME_COMMAND_TYPE.STORYEVENT_OPTION) {
                    throw new Error(
                        "Story Event is active, only story event commands are allowed, not: " +
                            gameMessage.commandMessageType,
                    );
                }
                let msg: GameMessageStoryEventOption = gameMessage as GameMessageStoryEventOption;
                game.dungeon.RunCommand(new CommandStoryEventOption(game, msg.index));
            } else if (game.$activeEvent.cname == GlobalConst.ENTITY_CNAME.MERCHANT) {
                if (gameMessage.commandMessageType != GlobalConst.GAME_COMMAND_TYPE.SHOP) {
                    throw new Error(
                        "Shop is active, only shop commands are allowed, not: " + gameMessage.commandMessageType,
                    );
                }
                let msg: GameMessageShop = gameMessage as GameMessageShop;
                game.dungeon.RunCommand(new CommandShop(game, msg));
            }
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.ATTACK) {
            //console.log("ASCII REPORT " + game.dungeon.GetAsciiServerDebug());
            let attackMessage: GameMessageAttack = gameMessage as GameMessageAttack;
            game.dungeon.RunCommand(new CommandAttack(game, attackMessage.tileX, attackMessage.tileY));
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.WAIT) {
            game.dungeon.RunCommand(new CommandWait(game));
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.MOVE) {
            let moveMessage: GameMessageMove = gameMessage as GameMessageMove;
            //Pre-Process Move Command to see if we need to reroute to attack or Interact
            let cmd: CommandMove = new CommandMove(game, moveMessage.dir);
            if (game.dungeon.GetDwellerInTile(cmd.targetTile.x, cmd.targetTile.y) != undefined) {
                //reroute to attack
                game.dungeon.RunCommand(new CommandAttack(game, cmd.targetTile.x, cmd.targetTile.y));
            } else if (game.dungeon.GetStoryEventInTile(cmd.targetTile.x, cmd.targetTile.y) != undefined) {
                //reroute to interact
                game.dungeon.RunCommand(new CommandInteract(game, cmd.targetTile.x, cmd.targetTile.y));
            } else if (game.dungeon.GetMerchantInTile(cmd.targetTile.x, cmd.targetTile.y) != undefined) {
                //reroute to interact
                game.dungeon.RunCommand(new CommandInteract(game, cmd.targetTile.x, cmd.targetTile.y));
            } else {
                //ok, safe to do the move now
                game.dungeon.RunCommand(cmd);
            }
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.EQUIP) {
            let equipMessage: GameMessageEquip = gameMessage as GameMessageEquip;
            game.dungeon.RunCommand(new CommandEquip(game, equipMessage));
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.SWAP_WEAPON) {
            game.dungeon.RunCommand(new CommandSwapWeapon(game));
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.DELETE_ITEM) {
            let msg: GameMessageDeleteItem = gameMessage as GameMessageDeleteItem;
            game.dungeon.RunCommand(new CommandDeleteItem(game, msg));
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.USE) {
            let msg: GameMessageUse = gameMessage as GameMessageUse;
            game.dungeon.RunCommand(new CommandUse(game, msg));
        } else if (gameMessage.commandMessageType == GlobalConst.GAME_COMMAND_TYPE.INTERACT) {
            let msg: GameMessageInteract = gameMessage as GameMessageInteract;
            game.dungeon.RunCommand(new CommandInteract(game, msg.tileX, msg.tileY));
        }

        if (request.session.movesSinceSave === null || typeof request.session.movesSinceSave === "undefined") {
            request.session.movesSinceSave = 0;
        } else {
            request.session.movesSinceSave++;
        }
        if (request.session.movesSinceSave >= maxMovesBeforeSave) {
            DBInterface.writeSessionToDB(userId, game);
            request.session.movesSinceSave = 0;
        }

        const clientData: M_Game = game.data.GetClientJSON();
        //console.log("CD IS " + JSON.stringify(clientData));
        request.session.gameSession.sessionData = JSON.stringify(clientData); // JSON.stringify(clientData);
        request.session.save();

        return clientData;
    }
}
