import { InputController } from "../../../types/frontendTypes";
import GlobalConst from "../../../types/globalConst";
import { GameScene } from "../GameScene";
import { GameUI } from "../ui/gameUI";
import { LMButtonText } from "../ui/uielements/LMButtonText";
import { FONT, PHASER_DEPTH } from "../../../types/localConst";
import {
    M_ItemMerchant,
    M_MerchantResponse,
    M_MerchantReveal,
    M_StoryEventOutcome,
    M_StoryEventReveal,
} from "../../../types/globalTypes";
import MathUtil from "../../../util/mathUtil";
import { ShopListItem } from "../ui/ShopListItem";
import { InventoryListItem } from "../ui/CharacterSheet/InventoryListItem";
import { ItemStatBox } from "../ui/ItemStatBox";
import CommandManager from "../CommandManager";
import TurnEventMerchantUpdate from "../updateQueue/turnEventMerchantUpdate";

export default class MerchantModal implements InputController {
    private scene: GameScene;
    private ui: GameUI;
    private cont: Phaser.GameObjects.Container;
    private shopitems: Phaser.GameObjects.Container;
    private items: ShopListItem[];
    private bg: Phaser.GameObjects.Rectangle;
    private bginner: Phaser.GameObjects.Rectangle;
    public blockInput: boolean = false;
    private closeBtn: LMButtonText;
    private statsBox?: ItemStatBox;
    title: Phaser.GameObjects.DynamicBitmapText;
    body: Phaser.GameObjects.DynamicBitmapText;

    private slatedToClose: boolean = false;
    image: Phaser.GameObjects.Image;

    constructor(scene: GameScene, gameUI: GameUI) {
        this.scene = scene;
        this.ui = gameUI;
        this.cont = scene.add.container(0, 0);
        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);
        this.shopitems = scene.add.container(0, 0);
        this.shopitems.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI + 1);

        this.bg = scene.add.rectangle(1, 1, 960, 709, 0x000000, 1).setOrigin(0, 0);
        this.bg.setStrokeStyle(1, 0xffffffff, 1);
        this.cont.add(this.bg);
        this.ui.alignGrid.placeAtIndex(39, this.bg, 0, -15);

        this.bginner = scene.add.rectangle(1, 1, 950, 700, 0x000000, 1).setOrigin(0, 0);
        this.bginner.setStrokeStyle(1, 0xffffffff, 1);
        this.cont.add(this.bginner);
        this.ui.alignGrid.placeAtIndex(39, this.bginner, 5, -10);

        this.title = this.scene.add
            .dynamicBitmapText(0, 0, FONT.TITLE_32, "")
            .setOrigin(0, 0)
            .setLeftAlign()
            .setMaxWidth(580);
        this.ui.alignGrid.placeAtIndex(47, this.title, 0, 15);

        this.body = this.scene.add
            .dynamicBitmapText(0, 0, FONT.BODY_24, "")
            .setOrigin(0, 0)
            .setLeftAlign()
            .setMaxWidth(570);
        this.ui.alignGrid.placeAtIndex(78, this.body, 0, 10);

        this.closeBtn = new LMButtonText(
            scene,
            "Close",
            new Phaser.Math.Vector2(120, 42),
            Phaser.Math.Vector2.ZERO,
            this.close.bind(this),
        );
        this.ui.alignGrid.placeAtIndex(59, this.closeBtn.container, 15, 5);

        this.cont.add([
            this.title,
            this.body,
            this.closeBtn.container,
            this.shopitems,
            //this.goldText.container,
        ]);

        this.items = [];

        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);

        this.hide();
    }

    public ClearItems(): void {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].container.destroy();
            this.items[i] = null;
        }
        this.items = [];
    }

    private ClearExisting() {
        this.ClearItems();

        if (this.image != null) {
            this.image.destroy();
            this.image = null;
        }

        this.title.text = "";
        this.body.text = "";
        this.slatedToClose = false;
        if (this.statsBox != null) {
            this.statsBox.container.destroy();
            this.statsBox = null;
        }
    }

    keyPressed(keyCode: number): void {
        // throw new Error("Method not implemented.");
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

    optionPressed(opt: number): void {
        if (opt > this.items.length) {
            return;
        }
        this.items[opt - 1].buy();
    }

    confirmPressed(): void {}

    close() {
        // this.ui.CloseMerchant();
        CommandManager.instance.SendMerchantAction(true);
    }

    public hide() {
        this.cont.visible = false;
        this.cont.active = false;
    }

    public show(merchantInfo: M_MerchantReveal) {
        this.ClearExisting();

        this.cont.visible = true;
        this.cont.active = true;

        let imagename: string = "" + merchantInfo.image + ".png";
        this.image = this.scene.add.image(0, 58, "storyevent", imagename).setOrigin(0, 0);
        this.cont.add(this.image);
        this.ui.alignGrid.placeAtIndex(71, this.image, -20, -30);
        this.title.text = merchantInfo.title;
        this.body.text = merchantInfo.body + "\n";
        this.ui.alignGrid.placeAtIndex(292, this.shopitems, -20, 0);

        this.buildItemDisplay(merchantInfo.items, merchantInfo.stealInfo);
    }

    updateReceived(upd: M_MerchantResponse) {
        if (this.statsBox != null) {
            this.statsBox.hide();
        }
        if (upd.closeAfter && upd.text == "") {
            this.ui.CloseMerchant();
            return;
        }

        if (upd.items != undefined) {
            this.ClearItems();
            this.buildItemDisplay(upd.items, upd.stealInfo);
        }

        if (upd.closeAfter) {
            this.slatedToClose = true;
        }

        if (upd.text != "") {
            this.ui.confirmModal.Show(
                this.ui.merchantModal,
                "Merchant",
                upd.text,
                "Okay",
                this.updateConfirmed.bind(this),
            );
        }
    }

    updateConfirmed() {
        if (this.slatedToClose) {
            console.log("CLOSING MERCH");
            this.ui.CloseMerchant();
        }
    }

    private buildItemDisplay(itemsData: M_ItemMerchant[], stealInfo: string) {
        for (let i = 0; i < itemsData.length; i++) {
            let listitem = new ShopListItem(this.scene as GameScene, i, itemsData[i], stealInfo);
            this.shopitems.add(listitem.container);
            this.items.push(listitem);
            listitem.container.setPosition(listitem.container.x, listitem.container.y + i * 65);
            // this.body.text += "\n$" + Math.round(merchantInfo.items[i].price) + " " + merchantInfo.items[i].item.name;
        }
    }

    public showItemStats(item: M_ItemMerchant) {
        if (this.statsBox != null) {
            this.statsBox.container.destroy();
        }
        this.statsBox = new ItemStatBox(this.scene as GameScene, item.item);
        this.ui.alignGrid.placeAtIndex(275, this.statsBox.container, 0, 0);
        this.container.add(this.statsBox.container);
    }

    public get container(): Phaser.GameObjects.Container {
        return this.cont;
    }
}
