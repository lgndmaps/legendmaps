import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import {FONT} from "../../../../types/localConst";

export class LMTextBox extends LMUIElement {
    private width: number;
    private height: number;
    private size: Phaser.Math.Vector2;
    private pos: Phaser.Math.Vector2;
    private textAsset: Phaser.GameObjects.BitmapText;
    private promptTextAsset: Phaser.GameObjects.BitmapText;
    private boxAsset: Phaser.GameObjects.Image;
    private focused: boolean = false;
    private promptText: string;
    private text: string;
    private box: Phaser.GameObjects.Rectangle;
    private flashTimer;

    constructor(scene: LMScene, promptText: string, size: Phaser.Math.Vector2, pos: Phaser.Math.Vector2) {
        super(scene);
        this.promptText = promptText;
        this.text = "";
        this.size = size;
        this.pos = pos;

        this.box = scene.add.rectangle(0, 0, this.size.x, 32, 0x000000, 0).setOrigin(0, 0.5);
        this.box.setStrokeStyle(1, 0xffffffff, 1);
        this.box.setInteractive();

        this.promptTextAsset = scene.add.bitmapText(5, 0, FONT.BODY_24, promptText, 24).setOrigin(0, 0.5).setAlpha(0.1);
        this.textAsset = scene.add.bitmapText(5, 0, FONT.BODY_24, "", 24).setOrigin(0.5).setOrigin(0, 0.5);
        this._container.add([this.box, this.promptTextAsset, this.textAsset]);
        this.box.on("pointerup", this.handleFocusClick, this);
        this.scene.input.keyboard.on("keydown", this.handleKey, this);
        this.scene.input.on("pointerdown", this.handleGlobalClick, this);
        this.setPosition(pos.x, pos.y);
    }

    public getText(): string {
        return this.text;
    }

    public setText(text: string) {
        this.text = text;
        this.textAsset.text = text;
        if (this.text.length > 0) {
            this.promptTextAsset.text = "";
        } else {
            this.promptTextAsset.text = this.promptText;
        }
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    private handleGlobalClick(event) {
        if (this.enabled && this.focused) {
            this.unfocus();
        }
    }

    private handleFocusClick() {
        if (this.enabled) {
            this.focus();
        }
    }

    private focus() {
        this.focused = true;
        this.flashTimer = this.scene.time.addEvent({
            delay: 200, // ms
            callback: this.update,
            callbackScope: this,
            loop: true,
        });
    }

    private unfocus() {
        if (this.flashTimer != null) {
            this.flashTimer.remove();
            this.flashTimer = null;
        }
        this.focused = false;
        if (this.textAsset.text != this.text) {
            this.textAsset.text = this.text;
        }
    }

    private handleKey(event) {
        console.log("handle key");
        if (this.enabled && this.focused) {
            if (this.flashTimer != null) {
                this.flashTimer.paused = true;
            }
            console.log("JE DGF " + event.key);
            if (event.key == "Backspace") {
                this.setText(this.text.substring(0, this.text.length - 1));
            } else {
                this.setText(this.text + event.key);
            }

            if (this.flashTimer != null) {
                this.flashTimer.paused = false;
            }
        }
    }

    update() {
        if (this.textAsset.text != this.text) {
            this.textAsset.text = this.text;
        } else {
            this.textAsset.text = this.text + "|";
        }
    }
}
