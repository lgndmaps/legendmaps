import {gameStore, rootStore, RootStore} from "../../../stores/RootStore";

import {LMScene} from "../LMScene";
import {sessionManager} from "../../util/session";
import {GameMap} from "./map/GameMap";
import {PlayerCharacter} from "./entities/PlayerCharacter";
import {GameUI} from "./ui/gameUI";

import TurnText from "./ui/TurnText";
import InputManager from "./InputManager";
import {Handler} from "../global/Handler";
import UpdateQueue from "./updateQueue/UpdateQueue";
import EffectManager from "./EffectManager";
import {ToolTipManager} from "./ui/toolTipManager";
import Dweller from "./entities/Dweller";
import CombatFlow from "./ui/combatFlow";
import AudioManager from "./sound/audioManager";
import gameConfig from "./gameConfig.json";
import CommandManager from "./CommandManager";

export class GameScene extends LMScene {
    static GAME_TOTAL_WIDTH: number = 1260;
    static GAME_TOTAL_HEIGHT: number = 760;
    static GAME_MAP_X: number = 240;
    static GAME_MAP_Y: number = 0;

    store: RootStore;
    initialWidth: number;
    graphics: any;

    map: GameMap;
    ui: GameUI;
    uiCombat: CombatFlow;

    player: PlayerCharacter;

    rt;
    layer;

    turnText: TurnText;
    turn: number = -1;

    activeDwellers: Dweller[] = [];

    constructor() {
        super("GameScene");
        this.store = rootStore;
    }

    initializeSceneVars() {
        this.handlerScene = this.scene.get("Handler") as Handler;
        this.handlerScene.activeSceneName = this.scene.key;
        sessionManager.setSessionUpdateCallback(this.updateUserData.bind(this));
        this.sceneActive = true;
    }

    preload() {
        super.preload();
        this.scale.refresh();
        this.initializeSceneVars();

        if (gameStore.activeAdventurer?.tokenId) {
            this.load.image(
                "adventurer_portrait",

                `https://files.legendmaps.io/adv/p250/portrait_${gameStore.activeAdventurer.tokenId}.png`,
            );
        }

        console.log(
            "PRELOAD" + `https://files.legendmaps.io/adv/p250/portrait_${gameStore.activeAdventurer.tokenId}.png`,
        );

        EffectManager.instance.init(this);
        this.map = new GameMap(this);
        this.map.Preload();
        this.ui = new GameUI(this);
        this.player = new PlayerCharacter();

        this.load.image("px_mote", "/gamegfx/px_mote.png");
        this.load.image("px_4point_10", "/gamegfx/px_4point_10.png");
        this.load.image("px_plus_14", "/gamegfx/px_plus_14.png");
        this.load.image("px_round_12", "/gamegfx/px_round_12.png");
        this.load.image("px_star_10", "/gamegfx/px_star_10.png");
        this.load.image("px_x_4", "/gamegfx/px_x_4.png");
        this.load.image("px_splat_30", "/gamegfx/px_splat_30.png");
        this.load.image("px_arrow", "/gamegfx/px_arrow.png");
    }

    async create() {
        super.create();
        ToolTipManager.instance.Init(this);
        this.turnText = new TurnText(this);
        UpdateQueue.instance.SetGameScene(this);
        InputManager.instance.Init(this);

        this.ui.Initialize();
        this.uiCombat = new CombatFlow(this);

        this.scale.refresh();

        CommandManager.instance.webSocketManager.errorCallback = this.onSocketError.bind(this);
        CommandManager.instance.webSocketManager.closeCallback = this.onSocketClosed.bind(this);
        if (gameConfig.gameMusic) {
            AudioManager.instance.playAudio(this, "bgmusic", null, AudioManager.instance.base_musicVolume, true);
        }
    }

    onSocketError() {
        if (this.ui) {
            this.ui.confirmModal.Show(this.ui.confirmModal, "Connection Error", "Your connection to the server has been lost. Please refresh the page to reconnect.", "", null);
        }
    }

    onSocketClosed() {

    }
}
