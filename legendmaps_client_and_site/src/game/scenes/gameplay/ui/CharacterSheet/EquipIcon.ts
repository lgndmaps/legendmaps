import {LMScene} from "../../../LMScene";
import LMUIElement from "../uielements/LMUIElement";
import GlobalConst from "../../../../types/globalConst";
import InventoryItem from "../../entities/InventoryItem";
import {Item} from "../../entities/Item";
import {GameScene} from "../../GameScene";

export class EquipIcon extends LMUIElement {
    bg: Phaser.GameObjects.Image;
    image: Phaser.GameObjects.Image;
    imageActive: Phaser.GameObjects.Image;
    slotIndex: number;
    slot: GlobalConst.EQUIPMENT_SLOT;

    constructor(
        scene: LMScene,
        imageName: string,
        pos: Phaser.Math.Vector2,
        slot: GlobalConst.EQUIPMENT_SLOT,
        slotNumber: number = 0,
    ) {
        super(scene);

        this.slotIndex = slotNumber;
        this.slot = slot;

        this.bg = scene.add.image(0, 0, "ui", "port_inv_button_border.png").setOrigin(0.5, 0.5);
        this.bg.setInteractive({cursor: "pointer"});
        this._container.add(this.bg);

        this.image = scene.add.image(0, 0, "ui", imageName).setOrigin(0.5, 0.5);
        this._container.add(this.image);

        this.bg.on("pointerover", () => {

        });

        this.bg.on("pointerout", () => {
            // ToolTipManager.instance.Clear();
        });
        this.bg.on("pointerdown", this.pointerDown);
        this.bg.on("pointerup", this.handleClick, this);
        this.setPosition(pos.x, pos.y);
        this.Clear();
    }

    activeItem: InventoryItem;

    public Clear() {
        this.activeItem = undefined;
        if (this.imageActive != undefined) {
            this.imageActive.destroy();
            this.imageActive = undefined;
        }
        this.bg.alpha = 0.4;
        this.image.alpha = 0.1;
        //this.image.alpha = 1;
    }

    public SetItem(item: InventoryItem) {
        this.imageActive = this.scene.add
            .image(0, 0, "maptiles", Item.GraphicFileName(item.itemData.kind, item.itemData.rarity))
            .setOrigin(0.5, 0.5)
            .setScale(40 / 60, 40 / 60);
        this.container.add(this.imageActive);
        this.image.alpha = 0;
        this.bg.alpha = 1;
        this.container.alpha = 1;
    }

    private pointerDown() {
    }

    private handleClick() {
        if (this.enabled) {
            let gs = this.scene as GameScene;
            gs.ui.OpenCharSheet(this.slot);
        }
    }
}
