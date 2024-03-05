import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import { FONT } from "../../../../types/localConst";

export class LMMeterDweller extends LMUIElement {
    private width: number;
    private height: number;

    private background: Phaser.GameObjects.Rectangle;
    private fill: Phaser.GameObjects.Rectangle;

    private label: Phaser.GameObjects.BitmapText;

    constructor(
        scene: LMScene,
        width: number,
        height: number,
        name: string,
        fillColor: number = 0xff3333,
        widthAdjust: number = 1,
    ) {
        super(scene);

        this.width = width;
        this.height = height;
        this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 1).setOrigin(0, 0);
        //this.background.setStrokeStyle(1, 0xffffff, 1);
        this.fill = scene.add.rectangle(0, 0, width, height, fillColor, 1).setOrigin(0, 0);

        this.label = scene.add
            .bitmapText(width / 2, 0, FONT.BODY_20, name.substring(0, 16))
            .setOrigin(0.5, 0) //Phaser position weirdness
            .setCenterAlign()
            .setLetterSpacing(-1)
            .setMaxWidth(width)
            .setTint(0xffffff);

        this._container.add([this.background, this.fill, this.label]);
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
