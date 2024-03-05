import { RequestWithSession } from "../../types/requests";
import { DBInterface, SerializedCampaignResponse } from "../utils/dbInterface";
import Game from "../game";
import { CommandProcessor } from "./commandProcessor";
import { GameServerResponse, SerializedCampaignD, SerializedCharacterD } from "../types/types";
import { InputMessage, InvalidCommandResponse, GameEndResponse } from "../types/globalTypes";
import { CampaignUtil } from "../utils/campaignUtil";
import { SessionUtil } from "../utils/sessionUtil";
import { M_Game } from "../types/globalTypes";
import RandomUtil from "../utils/randomUtil";

export default class MessageProcessor {
    /**
     * Anything coming from client arrives here first and then is routed to CommandProcessor or elsewhere depending
     * @param userId
     * @param request
     * @param message
     * @param game
     * @returns
     */

    static async processMessage(
        userId: number,
        request: RequestWithSession,
        message: string,
        game: Game,
        setGameValue: (g: Game) => Game,
    ): Promise<GameServerResponse> {
        let commandResponse: GameServerResponse = {
            message: "",
            gameData: undefined,
        };

        //console.log(`Received message ${message} from user ${userId}`);
        const commandMessage: InputMessage = JSON.parse(message.toString());
        if (commandMessage.type === "game state") {
            if (commandMessage.commandMessage === "debugstart") {
                const msg = commandMessage.commandParams;
                const mapId: string = "" + msg.mapId;
                const advId: number = msg.adventurerId;
                const seed: number = msg.seed;
                let campaign: SerializedCampaignResponse;

                if (msg.wipeData) {
                    RandomUtil.instance.setSeed(seed);
                    campaign = await CampaignUtil.createNew(userId, advId, null, request);
                    game = setGameValue(
                        await SessionUtil.createNew(userId, mapId, campaign.campaign, campaign.character, request),
                    );
                } else {
                    campaign = await CampaignUtil.fetch(userId);
                    if (campaign) {
                        const existingGame: Game = new Game();

                        await existingGame.LoadGame(campaign.gameSession, campaign.campaign, campaign.character);
                        request.session.gameSession = campaign.gameSession;

                        game = setGameValue(existingGame);
                    }
                }

                request.session.save();

                if (!game?.data) {
                    commandResponse = {
                        message: "",
                        error: {
                            type: "game null",
                        },
                        gameData: game.data.GetClientJSON(),
                    };
                }

                commandResponse = {
                    message: "game-load",
                    gameData: game.data.GetClientJSON(),
                };

                return commandResponse;
            }
            if (commandMessage.commandMessage === "start") {
                const campaign = await CampaignUtil.fetch(userId);
                if (!campaign) {
                    commandResponse = {
                        message: "",
                        error: {
                            type: "campaign not found",
                        },
                        gameData: game.data.GetClientJSON(),
                    };

                    return commandResponse;
                }

                const existingGame: Game = new Game();
                //console.log("SESSION DATA IS " + JSON.stringify(result.sessionData));

                await existingGame.LoadGame(campaign.gameSession, campaign.campaign, campaign.character);
                request.session.gameSession = campaign.gameSession;
                game = setGameValue(existingGame);

                if (!game?.data) {
                    commandResponse = {
                        message: "",
                        error: {
                            type: "game null",
                        },
                        gameData: game.data.GetClientJSON(),
                    };
                }

                commandResponse = {
                    message: "game-load",
                    gameData: game.data.GetClientJSON(),
                };

                return commandResponse;
            }
            if (commandMessage.commandMessage === "start campaign" && commandMessage.commandParams.adventurerId) {
                DBInterface.startNewCampaign(commandMessage.commandParams.adventurerId, userId, null);
            }
            if (commandMessage.commandMessage === "end") {
                DBInterface.concludeGame(userId);
                request.session.gameSession = undefined;
                return GameEndResponse;
            }
        } else if (commandMessage.type === "input") {
            //console.log(game);
            if (!game.isInitialized()) {
                console.log("Game not initialized");
                return InvalidCommandResponse;
            }
            const clientUpdate: M_Game = CommandProcessor.processInput(
                userId.toString(),
                request,
                commandMessage,
                game,
            );
            game.dungeon.EndTurnCleanup();
            return {
                message: "client_comm-response",
                gameData: clientUpdate,
            };
        }
        return InvalidCommandResponse;
    }

    static checkCommandValid(command: InputMessage): boolean {
        //TODO flesh this out more
        if (!command.type) {
            return false;
        }
        return true;
    }
}
