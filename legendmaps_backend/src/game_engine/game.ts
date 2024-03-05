import Dungeon from "./dungeon";
import GameData from "./gameData";
import { GameDataD } from "./types/globalTypes";
import RandomUtil from "./utils/randomUtil";
import { SerializedCampaignD, SerializedCharacterD, SerializedGameSessionD } from "./types/types";
import StoryEvent from "./story/storyEvent";
import Merchant from "./merchant/merchant";

/**
 * Game is our top level class which owns all parts
 * of an actively played game.
 *
 * This class is not saved, so needs to be rebuilt
 * when a game is loaded using the GameData class.
 *
 */
export default class Game {
    private _gameData: GameData; //top level saveable class which owns all active game
    private _dungeon: Dungeon;
    public $activeEvent: StoryEvent | Merchant = null; //TODO: Need to move these elsewhere?

    constructor(isLocalTest: boolean = false) {
        this._dungeon = new Dungeon(this);
        this._gameData = new GameData(this);
    }

    //Checks if game data has been created or loaded.
    isInitialized(): boolean {
        //console.log("this._gameData.isInitialized" + this._gameData.isInitialized);
        if (this._gameData == null || !this._gameData.isInitialized) {
            return false;
        } else {
            return true;
        }
    }

    get data(): GameData {
        if (this._gameData) {
            return this._gameData;
        }
        throw new Error("NO Game Data");
    }

    get dungeon(): Dungeon {
        if (this._dungeon) return this._dungeon;
        throw new Error("NO dungeon");
    }

    //create a new game
    InitNewGame(
        tokenId: number,
        mapMetaData: JSON,
        mapMetaMetaData: JSON,
        rngSeed: number | null = null,
        campaignData: SerializedCampaignD,
        characterData: SerializedCharacterD,
        mapPowerup: number | null,
    ) {
        console.log("MAP POWERUP:", mapPowerup);
        if (RandomUtil.instance.seed == undefined || RandomUtil.instance.seed == -1) {
            RandomUtil.instance.setSeed(Math.random());
        }

        this._gameData.seed = RandomUtil.instance.seed;
        this._gameData.tokenId = tokenId;
        this._gameData.campaignId = campaignData.id;

        this._gameData.CreateNewGame(mapMetaData, mapMetaMetaData);
        console.log("INIT GAME");
        this._dungeon.DungeonStarted();
    }

    async LoadGame(
        session: SerializedGameSessionD,
        campaignData: SerializedCampaignD,
        characterData: SerializedCharacterD,
    ) {
        //@ts-ignore
        let parsed: GameDataD = session.sessionData as GameDataD;
        let tokenId: number = parsed.tokenId;
        // console.log("PARSED DATA IS " + JSON.stringify(parsed));
        console.log("LOAD GAME");
        if (parsed.cname == "GameData") {
            this._gameData.seed = parsed.seed;
            RandomUtil.instance.setSeed(this._gameData.seed);
            this._gameData.LoadGameData(parsed, characterData);

            this._dungeon.DungeonCheckForReturnMessage();
        }
    }
}
