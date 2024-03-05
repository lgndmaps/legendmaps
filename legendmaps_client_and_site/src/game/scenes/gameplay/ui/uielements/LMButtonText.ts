import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import { FONT } from "../../../../types/localConst";

export class LMButtonText extends LMUIElement {
    private size: Phaser.Math.Vector2;
    private text: string;
    public textAsset: Phaser.GameObjects.BitmapText;
    public buttonAsset: Phaser.GameObjects.Rectangle;
    private onClick: () => void;

    //NOTE: bind(this) on handler if needed
    constructor(
        scene: LMScene,
        text: string,
        size: Phaser.Math.Vector2,
        pos: Phaser.Math.Vector2,
        clickHandler: () => void,
        icon: string = "",
    ) {
        super(scene);
        this.text = text;
        this.onClick = clickHandler;
        this.size = size;
        if (size.y != 32) {
            console.log("using old button size, y should be 32");
            this.size.y = 32;
        }
        this.buttonAsset = scene.add.rectangle(0, 0, this.size.x, this.size.y, 0x000000, 0).setOrigin(0, 0);
        //this.buttonAsset.setStrokeStyle(1, 0xa3a352ff, 1);
        this.buttonAsset.setInteractive({ cursor: "pointer" });
        this._container.add(this.buttonAsset);

        this._container.add(
            scene.add
                .image(6, 0, "ui", "btn_mid_2px.png")
                .setOrigin(0, 0)
                .setScale((size.x - 12) / 2, 1),
        );
        this._container.add(scene.add.image(0, 0, "ui", "btn_endcap.png").setScale(-1, 1).setOrigin(1, 0));
        this._container.add(scene.add.image(size.x - 6, 0, "ui", "btn_endcap.png").setOrigin(0, 0));

        this.textAsset = scene.add
            .bitmapText((this.size.x - 5) / 2, 14, FONT.BODY_20, text)
            .setLetterSpacing(-1)
            .setOrigin(0.5, 0.5);

        if (icon) {
            this._container.add(scene.add.image(8, 4, "ui", icon).setOrigin(0, 0));
            this.textAsset.setLeftAlign().setOrigin(0, 0.5);
            this.textAsset.setPosition(40, this.textAsset.y);
        }

        this._container.add(this.textAsset);
        // this.buttonAsset.on("pointerover", () => {this.buttonAsset.setTint(0xFFFFFF)});
        this.buttonAsset.on("pointerdown", this.pointerDown);
        this.buttonAsset.on("pointerup", this.handleClick, this);
        this.setPosition(pos.x, pos.y);
    }

    public setText(text: string) {
        this.text = text;
        this.textAsset.text = text;
    }

    private pointerDown() {}

    private handleClick() {
        if (this.enabled) {
            this.onClick();
        }
    }
}
