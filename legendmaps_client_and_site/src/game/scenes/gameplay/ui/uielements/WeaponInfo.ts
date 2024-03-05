import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import { ToolTipManager } from "../toolTipManager";
import GFXUtil from "../../../../util/gfxUtil";
import { FONT } from "../../../../types/localConst";
import GlobalConst from "../../../../types/globalConst";
import InventoryItem from "../../entities/InventoryItem";
import { Item } from "../../entities/Item";
import { GameScene } from "../../GameScene";
import { LMButtonImage } from "./LMButtonImage";
import gameConfig from "../../gameConfig.json";

export class WeaponInfo extends LMUIElement {
    bg: Phaser.GameObjects.Rectangle;

    image: Phaser.GameObjects.Image;
    weaponName: Phaser.GameObjects.DynamicBitmapText;
    weaponDam: Phaser.GameObjects.DynamicBitmapText;
    swapButton: LMButtonImage;

    constructor(scene: LMScene) {
        super(scene);

        this.bg = scene.add.rectangle(0, 0, 214, 64, 0x000000, 1).setOrigin(0, 0);
        this.bg.setStrokeStyle(1, 0xffffff, 1);
        this._container.add(this.bg);

        this.image = scene.add
            .image(32, 32, "maptiles", "inv_hand.png")
            .setOrigin(0.5, 0.5)
            .setScale(40 / gameConfig.tileSize);
        this._container.add(this.image);

        this.weaponName = scene.add
            .dynamicBitmapText(64, 20, FONT.ASCII_18, "unarmed")
            .setLetterSpacing(-1)
            .setOrigin(0, 0.5)
            .setMaxWidth(152);

        this.weaponDam = scene.add
            .dynamicBitmapText(64, 49, FONT.ASCII_18, "bludgeon")
            .setLetterSpacing(-1)
            .setOrigin(0, 0.5)
            .setMaxWidth(152)
            .setTint(0xcccccc);
        this._container.add(this.weaponName);
        this._container.add(this.weaponDam);

        //phaser use pointer cursor on bg
        this.bg.setInteractive({ cursor: "pointer" });
        this.bg.on("pointerup", this.handleClick, this);

        this.Clear();
    }

    activeItem: InventoryItem;

    public Clear() {}

    public SetItem(item: InventoryItem) {
        if (item == null) {
            this.image.setFrame("fists.png");
            this.weaponName.text = "fists";
            this.weaponDam.text = "[type: bludgeon]";
            return;
        }
        this.image.setFrame(Item.GraphicFileName(item.itemData.kind, item.itemData.rarity));
        this.container.add(this.image);
        let name = item.itemData.name;
        if (name.length > 50) {
            name = name.substring(0, 48) + "...";
        }
        this.weaponName.text = name;
        this.weaponDam.text = "[type: " + item.GetPrimaryDamageType() + "]";
        this.image.alpha = 1;
        this.container.alpha = 1;
    }

    private pointerDown() {}

    private handleClick() {
        if (this.enabled) {
            let gs = this.scene as GameScene;
            gs.ui.OpenCharSheet(GlobalConst.EQUIPMENT_SLOT.WEAPON);
        }
    }
}
