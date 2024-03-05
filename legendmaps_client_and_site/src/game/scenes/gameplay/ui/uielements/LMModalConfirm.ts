import {LMScene} from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import {LMButtonText} from "./LMButtonText";
import {InputController} from "../../../../types/frontendTypes";
import GlobalConst from "../../../../types/globalConst";
import {GameUI} from "../gameUI";
import InputManager from "../../InputManager";
import {FONT} from "../../../../types/localConst";

export class LMModalConfirm extends LMUIElement implements InputController {
    blockInput: boolean = false;
    private fadeout: Phaser.GameObjects.Rectangle;

    private box: Phaser.GameObjects.Rectangle;

    private title: Phaser.GameObjects.DynamicBitmapText;
    private body: Phaser.GameObjects.DynamicBitmapText;

    private confirmbtn: LMButtonText;
    private cancelbtn: LMButtonText;

    private confirmFx: Function;
    private cancelFx: Function;
    private returnControl: InputController;

    public ui: GameUI;

    constructor(scene: LMScene, ui: GameUI) {
        super(scene);
        this.ui = ui;

        this.fadeout = scene.add.rectangle(0, 0, 1260, 760, 0x000000, 0.6).setOrigin(0, 0);
        this.fadeout.setInteractive();

        this.box = scene.add.rectangle(330, 50, 600, 450, 0x000000, 1).setOrigin(0, 0);
        this.box.setStrokeStyle(2, 0xffffffff, 1);
        this.box.setInteractive();

        this.title = scene.add
            .dynamicBitmapText(380, 80, FONT.TITLE_24, "title adfgsd gf dsgsd sg s", 24)
            .setOrigin(0, 0)
            .setMaxWidth(530);
        this.body = scene.add
            .dynamicBitmapText(380, 140, FONT.BODY_24, "body sgsdg sdg sdg sd sdg sdg sdg sdg sdg sdgsdg sdgsdg ", 24)
            .setOrigin(0, 0)
            .setMaxWidth(510);
        this.cancelbtn = new LMButtonText(
            this.scene,
            "cancel",
            new Phaser.Math.Vector2(120, 38),
            new Phaser.Math.Vector2(640, 440),
            this.cancel.bind(this),
        );
        this.confirmbtn = new LMButtonText(
            this.scene,
            "okay",
            new Phaser.Math.Vector2(120, 38),
            new Phaser.Math.Vector2(780, 440),
            this.confirm.bind(this),
        );

        this.container.add([
            this.fadeout,
            this.box,
            this.title,
            this.body,
            this.confirmbtn.container,
            this.cancelbtn.container,
        ]);
        this.container.setPosition(0, 0);

        this.Close();
    }

    public Show(
        returnControlTo: InputController,
        title: string,
        body: string,
        confirmBtnLabel: string,
        confirmBtnCallback: Function,
        cancelBtnLabel?: string,
        cancelButtonCallback?: Function,
    ) {
        this.title.text = title;
        this.body.text = body;
        this.confirmbtn.textAsset.text = confirmBtnLabel;
        this.confirmFx = confirmBtnCallback;

        if (cancelBtnLabel != undefined) {
            this.cancelbtn.container.setVisible(true);
            this.cancelbtn.container.setActive(true);
            this.cancelbtn.textAsset.text = cancelBtnLabel;
            this.cancelFx = cancelButtonCallback;
        } else {
            this.cancelbtn.container.setVisible(false);
            this.cancelbtn.container.setActive(false);
        }

        if (confirmBtnCallback == null) {
            this.confirmbtn.container.setVisible(false);
            this.confirmbtn.container.setActive(false);
        }

        this.returnControl = returnControlTo;

        InputManager.instance.setActiveController(this);

        this.container.setVisible(true);
        this.container.setActive(true);
    }

    public Close() {
        if (this.returnControl != undefined) {
            InputManager.instance.setActiveController(this.returnControl);
        }
        this.container.setVisible(false);
        this.container.setActive(false);
    }

    cancel() {
        this.Close();

        if (this.cancelFx != undefined) {
            this.cancelFx();
        }
    }

    confirm() {
        this.Close();
        if (this.confirmFx != undefined) {
            this.confirmFx();
        }
    }

    keyPressed(keyCode: number): void {
    }

    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {
    }

    pointerMove(x: number, y: number) {
    }

    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Phaser.Geom.Point, swipeEnd: Phaser.Geom.Point): void {
    }

    touch(point: Phaser.Geom.Point) {
    }

    escapePressed(): void {
        this.cancel();
    }

    optionPressed(opt: number): void {
    }

    confirmPressed(): void {
        this.confirm();
    }
}
