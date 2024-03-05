import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import {FONT} from "../../../../types/localConst";

export class LMLabeledValueBox extends LMUIElement {
    private textAsset: Phaser.GameObjects.DynamicBitmapText;
    private label: Phaser.GameObjects.BitmapText;
    private background: Phaser.GameObjects.Rectangle;

    constructor(scene: LMScene, labelText: string, valueText: string, width: number) {
        super(scene);

        let height: number = 30;
        this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0, 0);
        this.background.setStrokeStyle(1, 0xffffffff, 1);

        this.textAsset = scene.add.dynamicBitmapText(width / 2, height / 2, FONT.BODY_20, valueText).setOrigin(0.5, 0.5);
        this.label = scene.add.bitmapText(-5, height / 2, FONT.BODY_24, labelText).setOrigin(1, 0.5);
        this._container.add([this.background, this.textAsset, this.label]);
    }

    public set text(text: string) {
        this.textAsset.text = text;
    }

    public get text(): string {
        return this.textAsset.text;
    }
}
