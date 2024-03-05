import Phaser from "phaser";
import { LMScene } from "../LMScene";
import { RootStore, rootStore } from "../../../stores/RootStore";

export class Handler extends Phaser.Scene {
    activeScene: LMScene;
    activeSceneName: string;
    gameScene: LMScene;
    store: RootStore;
    public loading: false;
    // public activeScene: string = "";
    constructor() {
        super("Handler");
        this.store = rootStore;
    }

    async create() {
        await this.launchScene("Preload");
    }

    public launchScene(scene: string, data?: any) {
        this.scene.launch(scene, data);
        this.activeScene = this.scene.get(scene) as LMScene;
        console.log("game scene loaded: " + this.activeScene);
    }
}
