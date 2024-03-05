import LMUIElement from "./uielements/LMUIElement";
import { LMButtonText } from "./uielements/LMButtonText";
import { InputController } from "../../../types/frontendTypes";
import GlobalConst from "../../../types/globalConst";
import { GameUI } from "./gameUI";
import InputManager from "../InputManager";
import { GameScene } from "../GameScene";
import { FONT } from "../../../types/localConst";
import InventoryItem from "../entities/InventoryItem";
import { GameMapTile } from "../map/GameMapTile";
import CommandManager from "../CommandManager";

export class ItemUseTargetUI extends LMUIElement implements InputController {
    blockInput: boolean = false;
    private box: Phaser.GameObjects.Rectangle;
    private desc: Phaser.GameObjects.DynamicBitmapText;
    private cancelButton: LMButtonText;

    private item: InventoryItem;
    private returnControl: InputController;

    public ui: GameUI;
    private gameScene: GameScene;

    private inKeyboardMode: boolean = false;

    constructor(scene: GameScene, ui: GameUI) {
        super(scene);

        let BASEX = 250;
        let BASEY = 10;
        this.gameScene = scene;
        this.ui = ui;

        this.box = scene.add.rectangle(BASEX, BASEY, 600, 60, 0x000000, 1).setOrigin(0, 0);
        this.box.setStrokeStyle(2, 0xffffffff, 1);
        this.box.setInteractive();

        this.desc = scene.add
            .dynamicBitmapText(BASEX + 260, BASEY + 30, FONT.BODY_24, "...", 24)
            .setOrigin(0.5, 0.5)
            .setMaxWidth(440);

        this.cancelButton = new LMButtonText(
            this.scene,
            "X",
            new Phaser.Math.Vector2(40, 40),
            new Phaser.Math.Vector2(BASEX + 552, BASEY + 8),
            this.Close.bind(this),
        );

        this.container.add([this.box, this.desc, this.cancelButton.container]);
        this.container.setPosition(0, 0);

        this.container.setVisible(false);
        this.container.setActive(false);
    }

    public SetItem(item: InventoryItem) {
        this.item = item;
        this.desc.text = "Using " + item.name + ", select a dweller to target:";
    }

    public show() {
        InputManager.instance.setActiveController(this);

        this.container.setVisible(true);
        this.container.setActive(true);

        this.gameScene.map.UpdateIndicators(true, 6);
    }

    public Close() {
        InputManager.instance.setActiveController(this.ui);
        this.container.setVisible(false);
        this.container.setActive(false);
        this.inKeyboardMode = false;
    }

    keyPressed(keyCode: number): void {
        if (InputManager.instance.keyAttackCycleRight.includes(keyCode)) {
            this.cycleTargets(1);
        } else if (InputManager.instance.keyAttackCycleLeft.includes(keyCode)) {
            this.cycleTargets(-1);
        }
    }

    cycleTargets(dir: number) {
        this.inKeyboardMode = true;
        this.gameScene.map.UpdateAttackIndicatorsKeyboard(dir);
    }

    confirmPressed(): void {
        if (this.inKeyboardMode && this.gameScene.map.attackKeyboardActiveDwellerTarget != undefined) {
            let t = this.gameScene.map.attackKeyboardActiveDwellerTarget;
            if (t != undefined && t.hasDweller) {
                CommandManager.instance.SendUse(this.item.id, t.GetDweller());
                this.Close();
            }
        }
    }

    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {}

    pointerMove(x: number, y: number) {}

    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Phaser.Geom.Point, swipeEnd: Phaser.Geom.Point): void {}

    escapePressed(): void {
        this.Close();
    }

    optionPressed(opt: number): void {}

    touch(point: Phaser.Geom.Point) {
        let t: GameMapTile = this.gameScene.map.GetTileAtPoint(point.x, point.y);
        if (t != undefined && t.hasDweller) {
            CommandManager.instance.SendUse(this.item.id, t.GetDweller());
            this.Close();
        }
    }
}
