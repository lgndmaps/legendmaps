import { GameScene } from "../GameScene";
import gameConfig from "../../gameplay/gameConfig.json";
import { FONT, PHASER_DEPTH } from "../../../types/localConst";
import LMUIElement from "./uielements/LMUIElement";
import game from "../../../../pages/game";

export class ToolTipManager {
    private static _instance: ToolTipManager;
    public container: Phaser.GameObjects.Container;
    private rect: Phaser.GameObjects.Rectangle;
    private txt: Phaser.GameObjects.BitmapText;
    private timedEvent: Phaser.Time.TimerEvent;
    public target: Object;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public gameScene: GameScene;

    constructor() {}

    Init(scene: GameScene) {
        this.gameScene = scene;
        this.container = this.gameScene.add.container(-1, -1);
        this.rect = this.gameScene.add.rectangle(0, 0, 150, 80, 0x000000, 1).setOrigin(0, 0);
        this.rect.setStrokeStyle(1, 0xffffff);

        this.txt = this.gameScene.add.dynamicBitmapText(8, 8, FONT.ASCII_18, "...").setMaxWidth(136).setOrigin(0, 0);

        this.container.add([this.rect, this.txt]);
        this.container.setDepth(PHASER_DEPTH.GAME_UI_OVERLAY);
        this.container.setVisible(false);
        this.container.setActive(false);
    }

    Clear() {
        if (!this.container.visible) return;

        if (this.timedEvent != null) {
            this.timedEvent.destroy();
        }
        this.target = null;
        this.txt.text = "";
        this.container.setVisible(false);
        this.container.setActive(false);
    }

    Show(
        x: number,
        y: number,
        text: string,
        target: Object,
        delay: number = 200,
        sizeX: number = 150,
        sizeY: number = 80,
    ) {
        if (target == this.target) return;
        this.Clear();
        this.rect.setSize(sizeX, sizeY);
        this.txt.setMaxWidth(sizeX - 14);
        this.target = target;

        //Phaser get the height of the text in this.txt

        this.txt.text = text;
        this.timedEvent = this.gameScene.time.delayedCall(
            delay,
            (x: number, y: number) => {
                this.container.setVisible(true);
                this.container.setActive(true);
                this.container.setPosition(x, y);
                this.container.setDepth(PHASER_DEPTH.ABOVE_ALL);
            },
            [x, y],
            this,
        );
    }
}
