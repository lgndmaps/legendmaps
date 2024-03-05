import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import { FONT } from "../../../../types/localConst";

export class LMMeter extends LMUIElement {
    private width: number;
    private height: number;

    private background: Phaser.GameObjects.Rectangle;
    private fill: Phaser.GameObjects.Rectangle;

    private label: Phaser.GameObjects.DynamicBitmapText;

    constructor(scene: LMScene, width: number, height: number, fillColor: number = 0xff3333, widthAdjust: number = 1) {
        super(scene);

        this.width = width;
        this.height = height;
        this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 1).setOrigin(0, 0);
        //this.background.setStrokeStyle(1, 0xffffff, 1);
        this.fill = scene.add.rectangle(widthAdjust, 0, width - widthAdjust * 2, height, fillColor, 1).setOrigin(0, 0);

        this.label = scene.add
            .dynamicBitmapText(15 + width / 2, 1 + height / 2, FONT.METER_18, "")
            .setOrigin(0.5, 0.5) //Phaser position weirdness
            .setLetterSpacing(-44)
            .setCenterAlign()
            .setTint(fillColor);

        this._container.add([this.background, this.fill, this.label]);
    }

    //Sets label as well as fill, should only be used for player hp
    public setHP(cur: number, max: number) {
        this.label.text = cur + "/" + max + "";
        this.setFillPercent(cur / max);
    }

    public setLabel(text: string) {
        this.label.text = text;
    }

    public setFillPercent(value: number) {
        this.scene.tweens.add({
            targets: this.fill,
            scaleX: value,
            scaleY: 1,
            ease: "Expo.easeOut",
            delay: 100,
        });
    }
}
