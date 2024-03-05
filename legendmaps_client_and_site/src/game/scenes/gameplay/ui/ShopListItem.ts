import GlobalConst from "../../../types/globalConst";
import CommandManager from "../CommandManager";
import { Item } from "../entities/Item";
import { GameScene } from "../GameScene";
import { LMButtonText } from "./uielements/LMButtonText";
import LMUIElement from "./uielements/LMUIElement";
import gameConfig from "../gameConfig.json";
import { M_ItemMerchant } from "../../../types/globalTypes";
import { LMButtonImage } from "./uielements/LMButtonImage";
import { FONT } from "../../../types/localConst";

export class ShopListItem extends LMUIElement {
    public item: M_ItemMerchant;
    private buyBtn: LMButtonText;
    private statsBtn: LMButtonText;
    private stealButton: LMButtonText;
    private trashBtn: LMButtonImage;

    private img: Phaser.GameObjects.Image;
    private gameScene: GameScene;

    private descText: Phaser.GameObjects.DynamicBitmapText;
    private stealInfo: string;
    private index: number;

    constructor(scene: GameScene, index: number, item: M_ItemMerchant, stealInfo: string) {
        super(scene);
        this.index = index;
        this.gameScene = scene;
        this.item = item;
        this.stealInfo = stealInfo;
        let rect: Phaser.GameObjects.Rectangle = this.scene.add.rectangle(1, 0, 604, 60, 0x000000, 1).setOrigin(0, 0);
        rect.setStrokeStyle(1, 0x888888);
        rect.setFillStyle(0x161616, 1);
        this.descText = this.scene.add.dynamicBitmapText(45, 2, FONT.BODY_20, "").setMaxWidth(275).setOrigin(0, 0);

        this.img = this.scene.add
            .image(3, 3, "maptiles", Item.GraphicFileName(item.item.kind, item.item.rarity as GlobalConst.RARITY))
            .setOrigin(0, 0)
            .setPosition(4, 4)
            .setScale(40 / gameConfig.tileSize);

        this.stealButton = new LMButtonText(
            scene,
            "steal",
            new Phaser.Math.Vector2(75, 35),
            Phaser.Math.Vector2.ZERO,
            this.steal.bind(this),
        );

        this.buyBtn = new LMButtonText(
            scene,
            "buy",
            new Phaser.Math.Vector2(60, 35),
            Phaser.Math.Vector2.ZERO,
            this.buy.bind(this),
        );

        this.statsBtn = new LMButtonText(
            scene,
            "stats",
            new Phaser.Math.Vector2(75, 35),
            Phaser.Math.Vector2.ZERO,
            this.showStats.bind(this),
        );

        this.container.add([
            rect,
            this.img,
            this.descText,
            this.buyBtn.container,
            this.statsBtn.container,
            this.stealButton.container,
        ]);

        this.stealButton.setPosition(380, 7);
        this.statsBtn.setPosition(460, 7);
        this.buyBtn.setPosition(540, 7);

        this.updateData(item);
    }

    steal() {
        this.gameScene.ui.confirmModal.Show(
            this.gameScene.ui.merchantModal,
            "Confirm steal?",
            "Try to steal the " + this.item.item.name + "? " + this.stealInfo,
            "Steal",
            this.confirmSteal.bind(this),
            "Cancel",
            null,
        );
    }

    confirmSteal() {
        //CommandManager.instance.SendDelete(this.item.id);
        CommandManager.instance.SendMerchantAction(false, this.item.item.id, true);
    }

    updateData(newItem: M_ItemMerchant) {
        this.item = newItem;

        this.descText.text = this.index + 1 + ": [$" + this.item.price + "]" + this.item.item.name;

        if (false) {
            this.stealButton.container.alpha = 0.2;
            this.stealButton.container.active = false;
        }
    }

    showStats() {
        console.log("show stats");
        this.gameScene.ui.merchantModal.showItemStats(this.item);
        // this.parentList.showStats(this);
    }

    buy() {
        console.log("BUY");
        CommandManager.instance.SendMerchantAction(false, this.item.item.id, false);
    }
}
