import {Item} from "../../entities/Item";
import LMUIElement from "../uielements/LMUIElement";
import {EffectD} from "../../../../types/globalTypes";
import GlobalConst from "../../../../types/globalConst";
import {GameScene} from "../../GameScene";
import EffectManager from "../../EffectManager";
import GameUtil from "../../../../util/gameUtil";
import {FONT} from "../../../../types/localConst";
import FlagUtil from "../../../../util/flagUtil";
import {LMButtonText} from "../uielements/LMButtonText";
import CommandManager from "../../CommandManager";
import {CharacterSheetInventory} from "./CharacterSheetInventory";
import InventoryItem from "../../entities/InventoryItem";
import InputManager from "../../InputManager";
import {ToolTipManager} from "../toolTipManager";

export class InventoryItemStatBox extends LMUIElement {
    parentSheet: CharacterSheetInventory;
    public invItem: InventoryItem;
    private img: Phaser.GameObjects.Image;
    private gameScene: GameScene;
    private equipBtn: LMButtonText;
    private trashBtn: LMButtonText;

    constructor(
        scene: GameScene,
        parentSheet: CharacterSheetInventory,
        item: InventoryItem,
        showButtons: boolean = false,
    ) {
        super(scene);
        ToolTipManager.instance.Clear();
        this.gameScene = scene;
        this.invItem = item;
        this.parentSheet = parentSheet;
        let rect: Phaser.GameObjects.Rectangle = this.scene.add.rectangle(0, 0, 320, 280, 0x000000, 1).setOrigin(0, 0);
        this.container.add([rect]);
        let yshift = 0;

        if (showButtons) {
            rect.setStrokeStyle(1, 0xffffff);
        } else {
            yshift = 8;
            rect.setStrokeStyle(1, 0xc0a255);
            let rect2: Phaser.GameObjects.Rectangle = this.scene.add
                .rectangle(160, 5, 90, 30, 0x000000, 1)
                .setOrigin(0.5, 0.5);

            let eqtxt: Phaser.GameObjects.BitmapText = this.scene.add
                .bitmapText(160, -2, FONT.BODY_20, "Equipped", 20)
                .setMaxWidth(110)
                .setOrigin(0.5, 0.5)
                .setTint(0xc0a255);

            this.container.add([rect2, eqtxt]);
        }

        this.img = this.scene.add
            .image(3, 3 + yshift, "maptiles", Item.GraphicFileName(item.itemData.kind, item.itemData.rarity))
            .setOrigin(0, 0)
            .setPosition(4, 4 + yshift)
            .setScale(40 / 60, 40 / 60);

        let title: Phaser.GameObjects.BitmapText = this.scene.add
            .bitmapText(45, 2, FONT.BODY_20, "", 20)
            .setMaxWidth(230)
            .setOrigin(0, 0)
            .setPosition(55, 5 + yshift);
        title.text = item.name;

        let descRight: Phaser.GameObjects.BitmapText = this.scene.add
            .bitmapText(45, 2, FONT.ASCII_18, "", 18)
            .setMaxWidth(230)
            .setOrigin(1, 0)
            .setPosition(306, 50 + yshift)
            .setRightAlign();

        let desc: Phaser.GameObjects.BitmapText = this.scene.add
            .bitmapText(45, 2, FONT.ASCII_18, "", 18)
            .setMaxWidth(250)
            .setOrigin(0, 0)
            .setPosition(13, 50 + yshift);
        let leftlines = 0;
        let rightlines = 0;

        desc.text = GameUtil.GetRarityString(this.invItem.itemData.rarity) + " " + this.invItem.itemData.kind;
        leftlines++;
        if (FlagUtil.IsSet(this.invItem.itemData.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED)) {
            desc.text += " (2-handed)";
        }
        desc.text += "\n";
        descRight.text += "CR: " + this.invItem.itemData.cr + "\n";
        rightlines++;
        if (this.invItem.itemData.slot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
            descRight.text +=
                "attr: " +
                GlobalConst.GetWeaponAttribute(this.invItem.itemData.kind as GlobalConst.WEAPON_BASE_TYPE) +
                "\n";
            rightlines++;
        }

        descRight.text += "ascii: " + this.invItem.itemData.ascii + "\n";
        rightlines++;
        desc.text += "value: " + this.invItem.itemData.value + " gp\n";
        leftlines++;

        if (Item.GetRange(this.invItem.itemData) > 0) {
            let rangeDesc: string = "";
            if (FlagUtil.IsSet(this.invItem.itemData.itemFlags, GlobalConst.ITEM_FLAGS.IS_BEAM)) {
                rangeDesc = " (beam";
            }
            if (FlagUtil.IsSet(this.invItem.itemData.itemFlags, GlobalConst.ITEM_FLAGS.IS_AOE)) {
                rangeDesc += rangeDesc.length <= 0 ? " (" : ", ";
                rangeDesc = "AOE";
            }
            if (rangeDesc.length > 0) {
                rangeDesc += ")";
            }
            desc.text += "range: " + Item.GetRange(this.invItem.itemData) + rangeDesc + "\n";
            leftlines++;
        }

        desc.text += "\n";
        if (leftlines < rightlines) {
            desc.text += "\n";
        }
        if (this.invItem.itemData.slot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
            let att: GlobalConst.ATTRIBUTES = GlobalConst.GetWeaponAttribute(
                this.invItem.itemData.kind as GlobalConst.WEAPON_BASE_TYPE,
            );
            let hitbonus = 0;
            let dambonus = 0;
            if (att == GlobalConst.ATTRIBUTES.SPIRIT) {
                hitbonus = GlobalConst.GetToHitBonusByBAGS(this.gameScene.player.sp);
                dambonus = GlobalConst.GetDamageBonusByBAGS(this.gameScene.player.sp);
            } else if (att == GlobalConst.ATTRIBUTES.AGILITY) {
                hitbonus = GlobalConst.GetToHitBonusByBAGS(this.gameScene.player.ag);
                dambonus = GlobalConst.GetDamageBonusByBAGS(this.gameScene.player.ag);
            } else if (att == GlobalConst.ATTRIBUTES.BRAWN) {
                hitbonus = GlobalConst.GetToHitBonusByBAGS(this.gameScene.player.br);
                dambonus = GlobalConst.GetDamageBonusByBAGS(this.gameScene.player.br);
            }
            let hitstring = hitbonus >= 0 ? "+" : "";
            let damstring = dambonus >= 0 ? "+" : "";
            hitstring += "" + hitbonus + " to hit (" + att + ")\n";
            damstring += "" + dambonus + " to dmg (" + att + ")\n";
            desc.text += hitstring;
            desc.text += damstring;
        }

        for (let e = 0; e < this.invItem.itemData.effects.length; e++) {
            let eff: EffectD = this.invItem.itemData.effects[e];
            let effstr: string = "";
            let gameScene: GameScene = this.scene as GameScene;
            effstr += EffectManager.instance.GetEffectDescription(eff) + "\n";
            desc.text += effstr;
        }

        this.container.add([this.img, title, desc, descRight]);

        if (showButtons) {
            let xp = 220;

            if (this.invItem.itemData.slot !== GlobalConst.EQUIPMENT_SLOT.NONE) {
                let equiplabel =
                    this.invItem.itemData.equippedslot === GlobalConst.EQUIPMENT_SLOT.NONE ? "Equip" : "Remove";

                this.equipBtn = new LMButtonText(
                    scene,
                    equiplabel,
                    new Phaser.Math.Vector2(90, 35),
                    new Phaser.Math.Vector2(220, 235),
                    this.toggleEquip.bind(this),
                );

                this.container.add(this.equipBtn.container);
                xp = 120;
            }

            this.trashBtn = new LMButtonText(
                scene,
                "Trash",
                new Phaser.Math.Vector2(90, 35),
                new Phaser.Math.Vector2(xp, 235),
                () => {
                    this.trashMe();
                },
            );

            this.container.add(this.trashBtn.container);
        }
    }

    toggleEquip() {
        if (InputManager.instance.allowInput() && this.equipBtn.container.active) {
            console.log("changing equip state " + this.invItem.itemData.equippedslot);
            CommandManager.instance.SendEquip(
                this.invItem.id,
                this.invItem.itemData.slot,
                this.invItem.itemData.equippedslot === GlobalConst.EQUIPMENT_SLOT.NONE,
            );
        }
    }

    trashMe() {
        if (this.invItem.itemData.equippedslot === GlobalConst.EQUIPMENT_SLOT.NONE) {
            this.parentSheet.ui.confirmModal.Show(
                this.parentSheet.ui.charSheetStats,
                "Confirm delete item?",
                "Are you sure you want to destroy your " + this.invItem.itemData.name + " forever?",
                "Destroy",
                this.confirmTrash.bind(this),
                "Cancel",
                null,
            );
        } else {
            this.parentSheet.ui.confirmModal.Show(
                this.parentSheet.ui.charSheetStats,
                "Can not delete",
                "You can not delete an equipped item. You need to Unequip it first.",
                "Okay",
                null,
            );
        }
    }

    confirmTrash() {
        CommandManager.instance.SendDelete(this.invItem.id);
    }
}
