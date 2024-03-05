import { LMScene } from "../../../LMScene";
import LMUIElement from "../uielements/LMUIElement";
import { ToolTipManager } from "../toolTipManager";
import GFXUtil from "../../../../util/gfxUtil";
import { FONT } from "../../../../types/localConst";

export class TabButton extends LMUIElement {
    public image: Phaser.GameObjects.Image;
    private onClick: () => void;

    constructor(scene: LMScene, text: string, imageName: string, pos: Phaser.Math.Vector2, clickHandler: () => void) {
        super(scene);
        this.onClick = clickHandler;

        this.image = scene.add.image(0, 0, "ui", imageName).setOrigin(0.5, 0.5);
        this.image.setInteractive({ cursor: "pointer" });
        this._container.add(this.image);

        let txt = scene.add.bitmapText(0, -2, FONT.BODY_24, text).setCenterAlign().setOrigin(0.5, 0.5);
        this._container.add(txt);
        this.image.on("pointerover", () => {
            // let wp = GFXUtil.GetWorldPos(this.container);
            // ToolTipManager.instance.Show(wp.x - 90, wp.y + 40, this.tip, this.container, 50, 90, 36);
        });

        this.image.on("pointerout", () => {
            // ToolTipManager.instance.Clear();
        });
        this.image.on("pointerdown", this.pointerDown);
        this.image.on("pointerup", this.handleClick, this);
        this.setPosition(pos.x, pos.y);
    }

    private pointerDown() {}

    private handleClick() {
        if (this.enabled) {
            this.onClick();
        }
    }
}
