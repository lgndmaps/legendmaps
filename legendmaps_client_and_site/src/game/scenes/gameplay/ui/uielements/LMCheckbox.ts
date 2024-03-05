import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import {FONT} from "../../../../types/localConst";

export default class LMCheckBox extends LMUIElement {
    private pos: Phaser.Math.Vector2;
    private label: string;
    private labelAsset: Phaser.GameObjects.BitmapText;
    private box: Phaser.GameObjects.Rectangle;
    private checkMark: Phaser.GameObjects.Image;

    constructor(scene: LMScene, label: string, pos: Phaser.Math.Vector2) {
        super(scene);
        this.label = label;
        this.pos = pos;

        this.box = scene.add.rectangle(0, 0, 27, 27, 0x000000, 0).setOrigin(0, 0.5);
        this.box.setStrokeStyle(1, 0xffffffff, 1);
        this.box.setInteractive();
        this.checkMark = scene.add.image(-4, 0, "uigfx", "checkmark.png").setOrigin(0, 0.5);
        this.checkMark.visible = false;
        this.labelAsset = scene.add.bitmapText(35, 0, FONT.BODY_24, "", 24).setOrigin(0.5).setOrigin(0, 0.5);
        this.labelAsset.text = label;

        this._container.add([this.box, this.checkMark, this.labelAsset]);
        this.setPosition(pos.x, pos.y);
        this.box.on("pointerup", this.handleClick, this);
    }

    private handleClick() {
        if (this.enabled) {
            if (this.checkMark.visible) {
                this.checkMark.visible = false;
            } else {
                this.checkMark.visible = true;
            }
        }
    }

    public setChecked(state: boolean) {
        if (this.enabled) {
            if (state) {
                this.checkMark.visible = true;
            } else {
                this.checkMark.visible = false;
            }
        }
    }
    public isChecked(): boolean {
        return this.checkMark.visible;
    }
}
