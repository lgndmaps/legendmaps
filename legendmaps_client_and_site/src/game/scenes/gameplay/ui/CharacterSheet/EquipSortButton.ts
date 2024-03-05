import {LMScene} from "../../../LMScene";
import LMUIElement from "../uielements/LMUIElement";
import {ToolTipManager} from "../toolTipManager";
import GFXUtil from "../../../../util/gfxUtil";
import GlobalConst from "../../../../types/globalConst";
import {CharacterSheetInventory} from "./CharacterSheetInventory";

export class EquipSortButton extends LMUIElement {
    bg: Phaser.GameObjects.Image;
    image: Phaser.GameObjects.Image;
    slot: GlobalConst.EQUIPMENT_SLOT | "all" | "food";
    parentScreen: CharacterSheetInventory;
    state: "active" | "inactive";

    constructor(
        scene: LMScene,
        parentScreen: CharacterSheetInventory,
        imageName: string,
        pos: Phaser.Math.Vector2,
        slot: GlobalConst.EQUIPMENT_SLOT | "all" | "food",
    ) {
        super(scene);

        this.parentScreen = parentScreen;
        this.slot = slot;

        this.bg = scene.add.image(0, 0, "ui", "port_inv_button_border.png").setOrigin(0.5, 0.5);
        this.bg.setInteractive({cursor: "pointer"});
        this._container.add(this.bg);

        this.image = scene.add.image(0, 0, "ui", imageName).setOrigin(0.5, 0.5);
        this._container.add(this.image);

        this.bg.on("pointerover", () => {
            let wp = GFXUtil.GetWorldPos(this.container);
            ToolTipManager.instance.Show(wp.x + 10, wp.y + 25, "" + this.slot, this.container, 150, 80, 30);
        });

        this.bg.on("pointerout", () => {
            ToolTipManager.instance.Clear();
        });
        this.bg.on("pointerdown", this.pointerDown);
        this.bg.on("pointerup", this.handleClick, this);
        this.setPosition(pos.x, pos.y);
    }

    private pointerDown() {
    }

    private handleClick() {
        if (this.enabled) {
            if (this.state == "inactive") {
                this.parentScreen.setView(this.slot);
            }
        }
    }

    public setState(newState: "active" | "inactive") {
        this.state = newState;
        if (this.state == "active") {
            this.container.alpha = 1;
        } else {
            this.container.alpha = 0.4;
        }
    }
}
