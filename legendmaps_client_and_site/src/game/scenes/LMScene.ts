import { DEBUG_MODE, gameSizing } from "../config";
import AlignGrid from "../util/alignGrid";
import { sessionManager } from "../util/session";
import { Handler } from "./global/Handler";
import gameConfig from "./gameplay/gameConfig.json";
import UpdateQueue from "./gameplay/updateQueue/UpdateQueue";
import { M_Game } from "../types/globalTypes";
import {useEventEmitter} from "phaser-react-tools";
import events from "../events";

export class LMScene extends Phaser.Scene {
    public handlerScene: Handler;
    public sceneActive: boolean = false;
    public alignGrid: AlignGrid;

    initializeSceneVars() {
        this.sceneActive = true;
        this.handlerScene = this.scene.get("Handler") as Handler;
        this.handlerScene.activeSceneName = this.scene.key;
        sessionManager.setSessionUpdateCallback(this.updateUserData.bind(this));
    }

    changeScene(sceneId: string) {
        this.handlerScene.launchScene(sceneId);
        this.scene.stop();
    }

    preload() {}

    create() {

        let gridConfig: AlignGrid.GridConfig = {
            cols: gameConfig.pixelWidth / 40,
            rows: gameConfig.pixelHeight / 40,
            width: gameConfig.pixelWidth,
            height: gameConfig.pixelHeight,
            lmscene: this,
            depth: 9999999,
        };
        this.alignGrid = new AlignGrid(gridConfig);

        if (gameConfig.showAlignGrid) {
            this.alignGrid.show();
            this.alignGrid.showNumbers();
        }
    }

    cleanupScene() {}

    updateUserData(): void {
        if (this.game == undefined || this.game.scene == undefined) return;

        if (sessionManager.session === undefined) {
            throw new Error("Session update called with null value");
        }
        const updateJSON: any = JSON.parse(sessionManager.session);
        if (updateJSON.gameData === undefined) {
            throw new Error("BAD GAME UPDATE " + sessionManager.session);
        }
        UpdateQueue.instance.AddUpdate(updateJSON.gameData as M_Game);
    }
}
