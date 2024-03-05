import { InputController } from "../../../../types/frontendTypes";
import GlobalConst from "../../../../types/globalConst";
import { GameScene } from "../../GameScene";
import { GameUI } from "../gameUI";
import { FONT, PHASER_DEPTH } from "../../../../types/localConst";
import { LMButtonImageBasic } from "../uielements/LMButtonImageBasic";
import { TabButton } from "./TabButton";
import { LMScrollBox } from "../uielements/LMScrollBox";
import { EquipSortButton } from "./EquipSortButton";
import { InventoryListItem } from "./InventoryListItem";
import { InventoryItemStatBox } from "./InventoryItemStatBox";
import InventoryItem from "../../entities/InventoryItem";
import InputManager from "../../InputManager";
import GameUtil from "../../../../util/gameUtil";

export class CharacterSheetInventory implements InputController {
    private scene: GameScene;
    public ui: GameUI;
    private cont: Phaser.GameObjects.Container;
    private closeBtn: LMButtonImageBasic;
    private advName: Phaser.GameObjects.BitmapText;
    private bntTabInv: TabButton;
    private bntTabStats: TabButton;
    public blockInput: boolean = false;
    sortButtons: EquipSortButton[];
    private itemBox: LMScrollBox;
    private activeStatsBox: InventoryItemStatBox;
    private equipStatBox: InventoryItemStatBox;
    private activeSlot: GlobalConst.EQUIPMENT_SLOT | "food" | "all" = "all";

    constructor(scene: GameScene, gameUI: GameUI) {
        this.scene = scene;
        this.ui = gameUI;
        this.cont = scene.add.container(0, 0);
        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);

        let bg = scene.add.rectangle(1, 1, 1260, 760, 0x000000, 1).setOrigin(0, 0);
        this.cont.add(bg);

        /**
         * INV BOX (Must be layered at bottom, so placing first
         */
        this.itemBox = new LMScrollBox(this.scene as GameScene, 720, 570);
        this.itemBox.setPosition(140, 165);

        this.cont.add(this.itemBox.container);

        this.cont.add(this.scene.add.image(495, 159, "ui", "divider_large.png").setOrigin(0.5, 0.5));
        this.cont.add(this.scene.add.image(495, 734, "ui", "divider_large.png").setOrigin(0.5, 0.5));
        /**
         * TOP BAR
         */
        this.closeBtn = new LMButtonImageBasic(
            this.scene,
            "sheet_closebtn.png",
            new Phaser.Math.Vector2(1180, 42),
            this.close.bind(this),
        );
        this.cont.add(this.closeBtn.container);

        this.cont.add(this.scene.add.image(104, 40, "ui", "dweller_header.png").setOrigin(0.5, 0.5));
        this.cont.add(this.scene.add.image(320, 40, "ui", "divider_header.png").setOrigin(0.5, 0.5));
        let img = this.scene.add.image(946, 43, "ui", "divider_header.png").setOrigin(0.5, 0.5);
        img.setScale(-1, 1);
        this.cont.add(img);

        this.bntTabStats = new TabButton(
            this.scene,
            "Character",
            "sheet_tab.png",
            new Phaser.Math.Vector2(563, 41),
            () => {
                this.ui.OpenCharSheetStats();
            },
        );
        this.cont.add(this.bntTabStats.container);

        this.bntTabInv = new TabButton(
            this.scene,
            "Items",
            "sheet_tab.png",
            new Phaser.Math.Vector2(700, 41),
            () => {},
        );
        this.cont.add(this.bntTabInv.container);
        this.bntTabInv.image.setScale(-1, 1);
        this.bntTabStats.container.setAlpha(0.6);

        this.advName = this.scene.add
            .dynamicBitmapText(640, 110, FONT.TITLE_40, "name")
            .setOrigin(0.5, 0.5)
            .setCenterAlign()
            .setMaxWidth(1200)
            .setLetterSpacing(-44);
        this.cont.add(this.advName);

        /**
         * SORT BTNS
         */
        this.sortButtons = [];

        let y = 180;
        let dist = 65;
        this.sortButtons.push(
            new EquipSortButton(this.scene, this, "inv_all.png", new Phaser.Math.Vector2(100, y), "all"),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(
                this.scene,
                this,
                "inv_consumables.png",
                new Phaser.Math.Vector2(100, y),
                GlobalConst.EQUIPMENT_SLOT.NONE,
            ),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(this.scene, this, "inv_food.png", new Phaser.Math.Vector2(100, y), "food"),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(
                this.scene,
                this,
                "inv_wpn.png",
                new Phaser.Math.Vector2(100, y),
                GlobalConst.EQUIPMENT_SLOT.WEAPON,
            ),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(
                this.scene,
                this,
                "inv_head.png",
                new Phaser.Math.Vector2(100, y),
                GlobalConst.EQUIPMENT_SLOT.HEAD,
            ),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(
                this.scene,
                this,
                "inv_body.png",
                new Phaser.Math.Vector2(100, y),
                GlobalConst.EQUIPMENT_SLOT.BODY,
            ),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(
                this.scene,
                this,
                "inv_foot.png",
                new Phaser.Math.Vector2(100, y),
                GlobalConst.EQUIPMENT_SLOT.FEET,
            ),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(
                this.scene,
                this,
                "inv_shield.png",
                new Phaser.Math.Vector2(100, y),
                GlobalConst.EQUIPMENT_SLOT.SHIELD,
            ),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        y += dist;
        this.sortButtons.push(
            new EquipSortButton(
                this.scene,
                this,
                "inv_jewelry.png",
                new Phaser.Math.Vector2(100, y),
                GlobalConst.EQUIPMENT_SLOT.JEWELRY,
            ),
        );
        this.container.add(this.sortButtons[this.sortButtons.length - 1].container);

        this.setView("all");
        this.hide();
    }

    setView(view: GlobalConst.EQUIPMENT_SLOT | "all" | "food") {
        this.ClearItemViews();
        this.activeSlot = view;
        for (let s = 0; s < this.sortButtons.length; s++) {
            if (this.sortButtons[s].slot == view) {
                this.sortButtons[s].setState("active");
            } else {
                this.sortButtons[s].setState("inactive");
            }
        }
        this.playerInventoryUpdated();
    }

    showItem(item: InventoryItem) {
        this.ClearItemViews();

        this.activeStatsBox = new InventoryItemStatBox(this.scene as GameScene, this, item, true);
        this.activeStatsBox.setPosition(900, 160);
        this.container.add(this.activeStatsBox.container);

        if (
            item.itemData.slot != GlobalConst.EQUIPMENT_SLOT.NONE &&
            item.itemData.equippedslot == GlobalConst.EQUIPMENT_SLOT.NONE &&
            item.itemData.slot != GlobalConst.EQUIPMENT_SLOT.JEWELRY
        ) {
            //find currently eq item
            let itemLoaded = false;
            for (let i = 0; i < this.scene.player.inventory.length; i++) {
                if (
                    !itemLoaded &&
                    this.scene.player.inventory[i].itemData.id != item.itemData.id &&
                    this.scene.player.inventory[i].itemData.equippedslot == item.itemData.slot
                ) {
                    itemLoaded = true;
                    this.equipStatBox = new InventoryItemStatBox(
                        this.scene as GameScene,
                        this,
                        this.scene.player.inventory[i],
                        false,
                    );
                    this.equipStatBox.setPosition(900, 460);
                    this.container.add(this.equipStatBox.container);
                }
            }
        }
    }

    ClearItemViews() {
        if (this.activeStatsBox != null) {
            this.activeStatsBox.container.destroy();
            this.activeStatsBox = null;
        }
        if (this.equipStatBox != null) {
            this.equipStatBox.container.destroy();
            this.equipStatBox = null;
        }
    }

    keyPressed(keyCode: number): void {
        // throw new Error("Method not implemented.");
        if (InputManager.instance.keyCharsheet.includes(keyCode)) {
            this.ui.OpenCharSheetStats();
        }
    }

    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {
        //throw new Error("Method not implemented.");
    }

    pointerMove(x: number, y: number) {}

    touch(point: Phaser.Geom.Point) {
        // throw new Error("Method not implemented.");
    }
    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Phaser.Geom.Point, swipeEnd: Phaser.Geom.Point): void {
        // throw new Error("Method not implemented.");
    }

    escapePressed(): void {
        this.close();
    }

    optionPressed(opt: number): void {}

    confirmPressed(): void {}

    close() {
        this.ui.CloseCharSheet();
    }

    public updateData() {
        this.advName.text = this.scene.player.full_name + "";
    }

    public hide() {
        this.cont.visible = false;
        this.cont.active = false;
    }

    public show(openSlot: GlobalConst.EQUIPMENT_SLOT = null) {
        this.cont.visible = true;
        this.cont.active = true;
        this.updateData();
        if (openSlot != null) {
            this.setView(openSlot);
        } else {
            this.setView("all");
        }
    }

    public IsOpen() {
        return this.cont.visible;
    }

    playerInventoryUpdated(): void {
        this.itemBox.Reset();

        if (!this.cont.active || this.scene.player.inventory == undefined) {
            return;
        }
        let statboxitem: InventoryItem;

        let invListItems: InventoryListItem[] = [];
        for (let i = 0; i < this.scene.player.inventory.length; i++) {
            let showItem = true;

            if (this.activeSlot == "all") {
                //show all
            } else if (this.activeSlot == GlobalConst.EQUIPMENT_SLOT.NONE) {
                if (this.scene.player.inventory[i].itemData.slot != this.activeSlot) {
                    showItem = false;
                } else if (this.scene.player.inventory[i].itemData.kind.toLowerCase() == "food") {
                    showItem = false;
                }
            } else if (this.activeSlot == "food") {
                if (this.scene.player.inventory[i].itemData.slot != GlobalConst.EQUIPMENT_SLOT.NONE) {
                    showItem = false;
                } else if (this.scene.player.inventory[i].itemData.kind.toLowerCase() != "food") {
                    showItem = false;
                }
            } else if (this.scene.player.inventory[i].itemData.slot != this.activeSlot) {
                showItem = false;
            }

            if (showItem) {
                if (
                    this.activeStatsBox != undefined &&
                    this.activeStatsBox.invItem.id == this.scene.player.inventory[i].id
                ) {
                    statboxitem = this.scene.player.inventory[i];
                }
                let item = new InventoryListItem(this.scene, this, this.scene.player.inventory[i]);
                invListItems.push(item);
            }
        }

        //sort invListItems by isEquipped
        invListItems.sort((a, b) => {
            if (
                a.invItem.itemData.equippedslot == GlobalConst.EQUIPMENT_SLOT.NONE &&
                b.invItem.itemData.equippedslot != GlobalConst.EQUIPMENT_SLOT.NONE
            ) {
                return 1;
            } else if (
                a.invItem.itemData.equippedslot != GlobalConst.EQUIPMENT_SLOT.NONE &&
                b.invItem.itemData.equippedslot == GlobalConst.EQUIPMENT_SLOT.NONE
            ) {
                return -1;
            } else {
                if (a.invItem.IsUsable() && !b.invItem.IsUsable()) {
                    return -1;
                } else if (a.invItem.IsUsable() && !b.invItem.IsUsable()) {
                    return 1;
                } else {
                    //sort by rarity
                    if (
                        GameUtil.GetRarityNumeric(a.invItem.itemData.rarity) >
                        GameUtil.GetRarityNumeric(b.invItem.itemData.rarity)
                    ) {
                        return -1;
                    } else if (
                        GameUtil.GetRarityNumeric(a.invItem.itemData.rarity) <
                        GameUtil.GetRarityNumeric(b.invItem.itemData.rarity)
                    ) {
                        return 1;
                    } else {
                        //sort by cr
                        if (a.invItem.itemData.cr > b.invItem.itemData.cr) {
                            return -1;
                        } else if (a.invItem.itemData.cr < b.invItem.itemData.cr) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        });

        for (let i = 0; i < invListItems.length; i++) {
            this.itemBox.addContainer(invListItems[i].container, 75);
        }

        this.ClearItemViews();
        if (statboxitem != undefined) {
            this.showItem(statboxitem);
        }
    }

    public get container(): Phaser.GameObjects.Container {
        return this.cont;
    }
}
