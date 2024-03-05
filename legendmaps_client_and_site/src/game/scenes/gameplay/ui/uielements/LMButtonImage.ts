import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import { ToolTipManager } from "../toolTipManager";
import GFXUtil from "../../../../util/gfxUtil";

export class LMButtonImage extends LMUIElement {
    private width: number;
    private height: number;
    private size: Phaser.Math.Vector2;
    public image: Phaser.GameObjects.Image;
    private buttonAsset: Phaser.GameObjects.Rectangle;
    private onClick: () => void;
    private tip: string;

    constructor(
        scene: LMScene,
        imageAtlas: string,
        imageName: string,
        size: Phaser.Math.Vector2,
        pos: Phaser.Math.Vector2,
        clickHandler: () => void,
        tooltip: string = "test",
    ) {
        super(scene);
        this.tip = tooltip;
        this.onClick = clickHandler;
        this.size = size;
        this.buttonAsset = scene.add.rectangle(0, 0, this.size.x + 4, this.size.y + 4, 0x000000, 1).setOrigin(0, 0);
        this.buttonAsset.setStrokeStyle(1, 0xffffff, 1);
        this.buttonAsset.setInteractive({ cursor: "pointer" });

        this.image = scene.add
            .image(this.size.x / 2 + 2, this.size.y / 2 + 2, imageAtlas, imageName)
            .setOrigin(0.5, 0.5);

        this._container.add(this.buttonAsset);
        this._container.add(this.image);

        this.buttonAsset.on("pointerover", () => {
            // let wp = GFXUtil.GetWorldPos(this.container);
            // ToolTipManager.instance.Show(wp.x - 90, wp.y + 40, this.tip, this.container, 50, 90, 36);
        });

        this.buttonAsset.on("pointerout", () => {
            // ToolTipManager.instance.Clear();
        });
        this.buttonAsset.on("pointerdown", this.pointerDown);
        this.buttonAsset.on("pointerup", this.handleClick, this);
        this.setPosition(pos.x, pos.y);
    }

    //hacky but fine for now while we wait for real UI
    public setGoldStroke() {
        this.buttonAsset.setStrokeStyle(1, 0xa3a352, 1);
    }

    private pointerDown() {}

    private handleClick() {
        if (this.enabled) {
            this.onClick();
        }
    }
}
