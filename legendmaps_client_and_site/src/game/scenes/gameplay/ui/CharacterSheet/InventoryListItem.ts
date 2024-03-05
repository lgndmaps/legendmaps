import GlobalConst from "../../../../types/globalConst";
import {LMScene} from "../../../LMScene";
import CommandManager from "../../CommandManager";
import InventoryItem from "../../entities/InventoryItem";
import InputManager from "../../InputManager";
import {LMButtonText} from "../uielements/LMButtonText";
import LMUIElement from "../uielements/LMUIElement";
import gameConfig from "../../gameConfig.json";
import {FONT} from "../../../../types/localConst";
import FlagUtil from "../../../../util/flagUtil";
import TimeUtil from "../../../../util/timeUtil";
import {CharacterSheetInventory} from "./CharacterSheetInventory";

export class InventoryListItem extends LMUIElement {
    private parentSheet: CharacterSheetInventory;
    public invItem: InventoryItem;
    private statsBtn: LMButtonText;
    private useBtn: LMButtonText;
    private eqBtn: LMButtonText;

    private img: Phaser.GameObjects.Image;

    private descText: Phaser.GameObjects.BitmapText;

    constructor(scene: LMScene, list: CharacterSheetInventory, invItem: InventoryItem) {
        super(scene);
        this.parentSheet = list;

        let xb = 25;

        let rect: Phaser.GameObjects.Rectangle = this.scene.add
            .rectangle(xb + 1, 65, 645, 1, 0xffffff, 0.35)
            .setOrigin(0, 0);
        // rect.setStrokeStyle(1, 0x888888);
        let name = invItem.itemData.name;
        if (
            invItem.itemData.slot !== GlobalConst.EQUIPMENT_SLOT.NONE &&
            invItem.itemData.equippedslot !== GlobalConst.EQUIPMENT_SLOT.NONE
        ) {
            name += " [Equipped]";
        }
        if (invItem.itemData.uses > 1) {
            name += " (" + invItem.itemData.uses + ")";
        }
        this.descText = this.scene.add
            .bitmapText(xb + 55, 24, FONT.BODY_20, name)
            .setWordTint("[Equipped]", -1, true, 0xc0a255)
            .setMaxWidth(420)
            .setOrigin(0, 0.5);

        this.img = this.scene.add
            .image(xb + 3, 24, "maptiles", invItem.GetGraphicName())
            .setOrigin(0, 0.5)
            .setScale(40 / gameConfig.tileSize);

        this.useBtn = new LMButtonText(
            scene,
            "Use",
            new Phaser.Math.Vector2(50, 35),
            Phaser.Math.Vector2.ZERO,
            this.useItem.bind(this),
        );

        let equiplabel = invItem.itemData.equippedslot === GlobalConst.EQUIPMENT_SLOT.NONE ? "Equip" : "Remove";

        this.eqBtn = new LMButtonText(
            scene,
            equiplabel,
            new Phaser.Math.Vector2(85, 35),
            Phaser.Math.Vector2.ZERO,
            this.toggleEquip.bind(this),
        );

        this.statsBtn = new LMButtonText(
            scene,
            "View",
            new Phaser.Math.Vector2(75, 35),
            Phaser.Math.Vector2.ZERO,
            this.showStats.bind(this),
        );

        this.container.add([
            rect,
            this.img,
            this.descText,
            this.statsBtn.container,
            this.useBtn.container,
            this.eqBtn.container,
        ]);

        this.eqBtn.setPosition(505, 8);
        this.useBtn.setPosition(540, 8);
        this.statsBtn.setPosition(597, 8);
        list.container.add(this.container);
        this.updateData(invItem);
    }

    updateData(newItem: InventoryItem) {
        this.invItem = newItem;

        if (this.invItem.itemData.slot === GlobalConst.EQUIPMENT_SLOT.NONE) {
            this.eqBtn.container.alpha = 0;
            this.eqBtn.container.active = false;
        }

        if (!this.invItem.IsUsable()) {
            this.useBtn.container.alpha = 0;
            this.useBtn.container.active = false;
        }
    }

    showStats() {
        this.parentSheet.showItem(this.invItem);
    }

    toggleEquip() {
        if (InputManager.instance.allowInput() && this.eqBtn.container.active) {
            CommandManager.instance.SendEquip(
                this.invItem.id,
                this.invItem.itemData.slot,
                this.invItem.itemData.equippedslot === GlobalConst.EQUIPMENT_SLOT.NONE,
            );
        }
    }

    useItem() {
        if (InputManager.instance.allowInput() && this.useBtn.container.active) {
            console.log("using item id: " + this.invItem.id + " | " + this.invItem.itemData.id + " | " + this.invItem.itemData.name);
            if (FlagUtil.IsSet(this.invItem.itemData.itemFlags, GlobalConst.ITEM_FLAGS.IS_DWELLER_TARGET)) {
                this.parentSheet.blockInput = true;
                this.openTargetUI(this.invItem);
            } else {
                CommandManager.instance.SendUse(this.invItem.id);
            }

            //
        }
    }

    async openTargetUI(invItem) {
        await TimeUtil.sleep(25);
        this.parentSheet.close();
        this.parentSheet.blockInput = false;
        this.parentSheet.ui.OpenItemTargetUI(this.invItem);
    }
}
