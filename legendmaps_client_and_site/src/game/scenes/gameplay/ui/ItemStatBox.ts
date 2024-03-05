import { Item } from "../entities/Item";
import LMUIElement from "./uielements/LMUIElement";
import { EffectD, M_InventoryItem, M_Item } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import { GameScene } from "../GameScene";
import EffectManager from "../EffectManager";
import GameUtil from "../../../util/gameUtil";
import { FONT } from "../../../types/localConst";
import FlagUtil from "../../../util/flagUtil";
import { LMButtonText } from "./uielements/LMButtonText";
import { LMButtonImage } from "./uielements/LMButtonImage";
import CommandManager from "../CommandManager";

export class ItemStatBox extends LMUIElement {
    private item: M_InventoryItem | M_Item;
    private img: Phaser.GameObjects.Image;
    private gameScene: GameScene;
    private equipBtn: LMButtonText;
    private trashBtn: LMButtonImage;

    constructor(scene: GameScene, item: M_InventoryItem | M_Item) {
        super(scene);
        this.gameScene = scene;
        this.item = item;

        let rect: Phaser.GameObjects.Rectangle = this.scene.add.rectangle(0, 0, 320, 400, 0x000000, 1).setOrigin(0, 0);
        rect.setStrokeStyle(1, 0xffffff);

        this.img = this.scene.add
            .image(3, 3, "maptiles", Item.GraphicFileName(item.kind, item.rarity))
            .setOrigin(0, 0)
            .setPosition(4, 4)
            .setScale(40 / 60, 40 / 60);

        let title: Phaser.GameObjects.BitmapText = this.scene.add
            .bitmapText(45, 2, FONT.BODY_20, item.name, 20)
            .setMaxWidth(229)
            .setOrigin(0, 0)
            .setPosition(55, 5);

        let desc: Phaser.GameObjects.DynamicBitmapText = this.scene.add
            .dynamicBitmapText(45, 2, FONT.ASCII_18, "", 18)
            .setMaxWidth(260)
            .setOrigin(0, 0)
            .setPosition(10, 50);
        desc.text = "type: " + this.item.kind + "\n";
        if (this.item.slot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
            desc.text +=
                "attribute: " + GlobalConst.GetWeaponAttribute(this.item.kind as GlobalConst.WEAPON_BASE_TYPE) + "\n";
        }
        desc.text += "rarity: " + GameUtil.GetRarityString(this.item.rarity) + "\n";
        desc.text += "equip slot: " + GameUtil.GetSlotString(this.item.slot);
        if (FlagUtil.IsSet(this.item.itemFlags, GlobalConst.ITEM_FLAGS.IS_TWOHANDED)) desc.text += " (two-handed)";
        desc.text += "\n";
        desc.text += "cr: " + this.item.cr + "\n";
        desc.text += "ascii: " + this.item.ascii + "\n";
        desc.text += "value: " + this.item.value + " gp\n";

        if (Item.GetRange(this.item) > 0) {
            let rangeDesc: string = "";
            if (FlagUtil.IsSet(this.item.itemFlags, GlobalConst.ITEM_FLAGS.IS_BEAM)) {
                rangeDesc = " (beam";
            }
            if (FlagUtil.IsSet(this.item.itemFlags, GlobalConst.ITEM_FLAGS.IS_AOE)) {
                rangeDesc += rangeDesc.length <= 0 ? " (" : ", ";
                rangeDesc = "AOE";
            }
            if (rangeDesc.length > 0) {
                rangeDesc += ")";
            }
            desc.text += "range: " + Item.GetRange(this.item) + rangeDesc + "\n";
        }

        desc.text += "\n";
        if (this.item.slot == GlobalConst.EQUIPMENT_SLOT.WEAPON) {
            let att: GlobalConst.ATTRIBUTES = GlobalConst.GetWeaponAttribute(
                this.item.kind as GlobalConst.WEAPON_BASE_TYPE,
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

        for (let e = 0; e < this.item.effects.length; e++) {
            let eff: EffectD = this.item.effects[e];
            let effstr: string = "";
            let gameScene: GameScene = this.scene as GameScene;
            effstr += EffectManager.instance.GetEffectDescription(eff) + "\n";
            desc.text += effstr;
        }

        this.container.add([rect, this.img, title, desc]);
    }
}
