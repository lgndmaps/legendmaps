import { InputController } from "../../../types/frontendTypes";
import GlobalConst from "../../../types/globalConst";
import { GameScene } from "../GameScene";
import { GameUI } from "./gameUI";
import { LMButtonText } from "./uielements/LMButtonText";
import { FONT, PHASER_DEPTH } from "../../../types/localConst";

export default class GeneralModal implements InputController {
    private scene: GameScene;
    private ui: GameUI;
    private cont: Phaser.GameObjects.Container;
    private bg: Phaser.GameObjects.Rectangle;
    private bginner: Phaser.GameObjects.Rectangle;
    public blockInput: boolean = false;
    private closeBtn: LMButtonText;
    title: Phaser.GameObjects.DynamicBitmapText;
    body: Phaser.GameObjects.DynamicBitmapText;
    image: Phaser.GameObjects.Image;

    constructor(scene: GameScene, gameUI: GameUI) {
        this.scene = scene;
        this.ui = gameUI;
        this.cont = scene.add.container(0, 0);
        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);

        this.bg = scene.add.rectangle(1, 1, 890, 689, 0x000000, 1).setOrigin(0, 0);
        this.bg.setStrokeStyle(1, 0xffffffff, 1);
        this.cont.add(this.bg);
        this.ui.alignGrid.placeAtIndex(39, this.bg, 0, 5);

        this.bginner = scene.add.rectangle(1, 1, 880, 680, 0x000000, 1).setOrigin(0, 0);
        this.bginner.setStrokeStyle(1, 0xffffffff, 1);
        this.cont.add(this.bginner);
        this.ui.alignGrid.placeAtIndex(39, this.bginner, 5, 10);

        this.title = this.scene.add
            .dynamicBitmapText(0, 0, FONT.TITLE_32, "")
            .setOrigin(0, 0)
            .setLeftAlign()
            .setMaxWidth(470);
        this.ui.alignGrid.placeAtIndex(78, this.title, 0, 0);

        this.body = this.scene.add
            .dynamicBitmapText(0, 0, FONT.BODY_24, "")
            .setOrigin(0, 0)
            .setLeftAlign()
            .setMaxWidth(470);
        this.ui.alignGrid.placeAtIndex(110, this.body, 0);

        this.closeBtn = new LMButtonText(
            scene,
            "Close",
            new Phaser.Math.Vector2(120, 42),
            Phaser.Math.Vector2.ZERO,
            this.close.bind(this),
        );
        this.ui.alignGrid.placeAtIndex(529, this.closeBtn.container, 0, 15);

        this.cont.add([
            this.title,
            this.body,
            this.closeBtn.container,
            //this.goldText.container,
        ]);
        this.closeBtn.hide();

        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);

        this.hide();
    }

    private ClearExisting() {
        this.closeBtn.hide();

        if (this.image != null) {
            this.image.destroy();
            this.image = null;
        }

        this.title.text = "";
        this.body.text = "";
    }

    keyPressed(keyCode: number): void {
        // throw new Error("Method not implemented.");
    }
    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {
        //throw new Error("Method not implemented.");
    }

    pointerMove(x: number, y: number) {}

    touch(point: Phaser.Geom.Point) {
        // throw new Error("Method not implemented.");
    }
    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Phaser.Geom.Point, swipeEnd: Phaser.Geom.Point): void {
        // throw new Error("Method not implemented.");
    }

    close() {
        this.ui.CloseGeneralModal();
    }

    escapePressed(): void {}
    optionPressed(opt: number): void {}
    confirmPressed(): void {}

    public hide() {
        this.cont.visible = false;
        this.cont.active = false;
    }

    public show(title: string, body: string, imagename: string) {
        this.ClearExisting();

        this.cont.visible = true;
        this.cont.active = true;

        this.image = this.scene.add.image(0, 58, "storyevent", imagename).setOrigin(0, 0);
        this.cont.add(this.image);
        this.ui.alignGrid.placeAtIndex(71, this.image, -18, -18);
        this.title.text = title;
        this.body.text = body;

        this.closeBtn.show();
    }

    public get container(): Phaser.GameObjects.Container {
        return this.cont;
    }
}
