import { GameSession } from "../../models";
import { RequestWithSession } from "../../types/requests";
import { generateGame } from "../../utils/gameUtil";
import { DBInterface } from "./dbInterface";
import Game from "../game";
import { GameDataD } from "../types/globalTypes";
import { CharacterDataType, SerializedCampaignD, SerializedCharacterD } from "../types/types";

export class SessionUtil {
    public static async createNew(
        id: number,
        mapId: string,
        campaignData: SerializedCampaignD,
        characterData: SerializedCharacterD,
        req: RequestWithSession,
    ) {
        const result = await DBInterface.fetchGameSession(id);

        //TODO need some sort of validation and confirmation at this step. Forfeiting any progress and currency etc
        if (result) {
            await DBInterface.concludeGame(id);
        }

        const newSessionData = await DBInterface.createGameSession(id, parseInt(mapId), campaignData, characterData);
        req.session.gameSession = newSessionData.gameSession;
        return newSessionData.game;
    }

    public static async fetch(id: number, req: RequestWithSession) {
        let result = await DBInterface.fetchGameSession(id);
        return result;
        // console.log("result is " + result);
        // if (result) {
        //     const existingGame: Game = new Game();
        //     //console.log("SESSION DATA IS " + JSON.stringify(result.sessionData));

        //     await existingGame.LoadGame(result.sessionData);
        //     req.session.gameSession = result;

        //     return existingGame;
        // }

        // throw new Error("Can't create new  game, no game found and have no way to determine map ");
        // const newSessionData = await DBInterface.createGameSession(
        //     id,
        //     1, //get rid of token requirement on this,
        // );
        // req.session.gameSession = newSessionData.gameSession;
        // return newSessionData.game;
    }

    public static async saveSessionToDB(id: string, game: Game) {
        const gameSession = await DBInterface.writeSessionToDB(id, game);
        return gameSession;
    }

    public static async endSession(id: string, game: Game) {
        const sessionSaveResult = await this.saveSessionToDB(id, game);
        // console.log("SESSION SAVE: ", sessionSaveResult);
        //const result = await DBInterface.endGameSession(id);
        return sessionSaveResult;
    }
}
