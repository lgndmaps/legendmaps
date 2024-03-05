import { InputController } from "../../../../types/frontendTypes";
import GlobalConst from "../../../../types/globalConst";
import { GameScene } from "../../GameScene";
import { GameUI } from "../gameUI";
import { FONT, PHASER_DEPTH } from "../../../../types/localConst";
import { LMButtonImageBasic } from "../uielements/LMButtonImageBasic";
import { LMMeter } from "../uielements/LMMeter";
import { TabButton } from "./TabButton";
import AdventurerPortrait from "../AdventurerPortrait";
import { EquipIcon } from "./EquipIcon";
import Condition from "../../entities/Condition";
import EffectManager from "../../EffectManager";
import { Effect } from "../../entities/Effect";
import { LMScrollBox } from "../uielements/LMScrollBox";
import GameUtil from "../../../../util/gameUtil";
import { ToolTipManager } from "../toolTipManager";
import InputManager from "../../InputManager";

export class CharacterSheetStats implements InputController {
    private scene: GameScene;
    private ui: GameUI;
    private cont: Phaser.GameObjects.Container;
    private closeBtn: LMButtonImageBasic;
    private advName: Phaser.GameObjects.BitmapText;
    private bntTabInv: TabButton;
    private bntTabStats: TabButton;
    public blockInput: boolean = false;

    hp: LMMeter;
    hunger: LMMeter;
    gold: Phaser.GameObjects.DynamicBitmapText;
    keys: Phaser.GameObjects.DynamicBitmapText;
    level: Phaser.GameObjects.DynamicBitmapText;
    bHolder: Phaser.GameObjects.Image;
    aHolder: Phaser.GameObjects.Image;
    gHolder: Phaser.GameObjects.Image;
    sHolder: Phaser.GameObjects.Image;

    brawn: Phaser.GameObjects.DynamicBitmapText;
    agility: Phaser.GameObjects.DynamicBitmapText;
    guile: Phaser.GameObjects.DynamicBitmapText;
    spirit: Phaser.GameObjects.DynamicBitmapText;

    def: Phaser.GameObjects.DynamicBitmapText;
    block: Phaser.GameObjects.DynamicBitmapText;
    dodge: Phaser.GameObjects.DynamicBitmapText;

    effectsInfo: Phaser.GameObjects.DynamicBitmapText;
    conditionInfo: Phaser.GameObjects.DynamicBitmapText;
    public equipIcons: EquipIcon[];
    public adventurerPortrait: AdventurerPortrait;

    skills: LMScrollBox;

    constructor(scene: GameScene, gameUI: GameUI) {
        this.scene = scene;
        this.ui = gameUI;
        this.cont = scene.add.container(0, 0);
        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);

        let bg = scene.add.rectangle(1, 1, 1260, 760, 0x000000, 1).setOrigin(0, 0);
        this.cont.add(bg);

        /***
         * RIGHT COLUMN (Placed first for fake mask layering reasons).
         */

        let levelContainer = this.scene.add.container(0, 0);

        levelContainer.add(this.scene.add.image(45, 55, "ui", "sheet_level_bg.png").setOrigin(0, 0.5));
        levelContainer.add(
            this.scene.add.bitmapText(130, 0, FONT.BODY_20, "Level:").setOrigin(0.5, 0.5).setCenterAlign(),
        );

        this.level = this.scene.add.dynamicBitmapText(118, 41, FONT.BOLD_24, "1");
        levelContainer.add(this.level);

        this.skills = new LMScrollBox(this.scene as GameScene, 360, 560);
        this.skills.setPosition(825, 180);
        this.skills.addContainer(levelContainer, 110);

        this.cont.add(this.skills.container);

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
        // this.closeBtn.container.setPosition(, 45);

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
            () => {},
        );
        this.cont.add(this.bntTabStats.container);

        this.bntTabInv = new TabButton(this.scene, "Items", "sheet_tab.png", new Phaser.Math.Vector2(700, 41), () => {
            this.ui.OpenCharSheet();
        });
        this.cont.add(this.bntTabInv.container);
        this.bntTabInv.image.setScale(-1, 1);
        this.bntTabInv.container.setAlpha(0.6);

        this.advName = this.scene.add
            .dynamicBitmapText(640, 110, FONT.TITLE_40, "name")
            .setOrigin(0.5, 0.5)
            .setCenterAlign()
            .setMaxWidth(1200)
            .setLetterSpacing(-44);
        this.cont.add(this.advName);

        /****
         * LEFT COLUMN: BAGS
         */
        //BRAWN
        this.cont.add(this.scene.add.bitmapText(180, 174, FONT.BODY_20, "Brawn").setOrigin(0.5, 0.5).setCenterAlign());
        this.bHolder = this.scene.add.image(180, 219, "ui", "shield_1.png").setOrigin(0.5, 0.5);
        this.cont.add(this.bHolder);
        this.brawn = this.scene.add
            .dynamicBitmapText(200, 223, FONT.BOLD_24, "00")
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-46)
            .setCenterAlign();
        this.cont.add(this.brawn);

        //AGI
        this.cont.add(
            this.scene.add.bitmapText(305, 174, FONT.BODY_20, "Agility").setOrigin(0.5, 0.5).setCenterAlign(),
        );
        this.aHolder = this.scene.add.image(305, 219, "ui", "shield_2.png").setOrigin(0.5, 0.5);
        this.cont.add(this.aHolder);
        this.agility = this.scene.add
            .dynamicBitmapText(325, 223, FONT.BOLD_24, "00")
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-46)
            .setCenterAlign();
        this.cont.add(this.agility);

        //G
        this.cont.add(this.scene.add.bitmapText(180, 286, FONT.BODY_20, "Guile").setOrigin(0.5, 0.5).setCenterAlign());
        this.gHolder = this.scene.add.image(180, 338, "ui", "shield_3.png").setOrigin(0.5, 0.5);
        this.cont.add(this.gHolder);
        this.guile = this.scene.add
            .dynamicBitmapText(200, 338, FONT.BOLD_24, "00")
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-46)
            .setCenterAlign();
        this.cont.add(this.guile);

        //S
        this.cont.add(this.scene.add.bitmapText(305, 286, FONT.BODY_20, "Spirit").setOrigin(0.5, 0.5).setCenterAlign());
        this.sHolder = this.scene.add.image(305, 334, "ui", "shield_4.png").setOrigin(0.5, 0.5);
        this.cont.add(this.sHolder);
        this.spirit = this.scene.add
            .dynamicBitmapText(325, 338, FONT.BOLD_24, "00")
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-46)
            .setCenterAlign();
        this.cont.add(this.spirit);

        this.cont.add(this.scene.add.image(246, 400, "ui", "divider_small.png").setOrigin(0.5, 0.5));

        this.cont.add(this.scene.add.bitmapText(130, 430, FONT.BODY_20, "Dodge").setOrigin(0.5, 0.5).setCenterAlign());
        this.cont.add(
            this.scene.add.rectangle(130, 468, 74, 44, 0x8a8a8a, 0).setStrokeStyle(1, 0xffffff, 1).setOrigin(0.5, 0.5),
        );
        this.cont.add(
            this.scene.add.rectangle(130, 468, 68, 38, 0x8a8a8a, 0).setStrokeStyle(1, 0xffffff, 1).setOrigin(0.5, 0.5),
        );
        this.dodge = this.scene.add
            .dynamicBitmapText(150, 472, FONT.BOLD_24, "00")
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-46)
            .setCenterAlign();
        this.cont.add(this.dodge);

        this.cont.add(this.scene.add.bitmapText(245, 430, FONT.BODY_20, "Block").setOrigin(0.5, 0.5).setCenterAlign());
        this.cont.add(
            this.scene.add.rectangle(245, 468, 74, 44, 0x8a8a8a, 0).setStrokeStyle(1, 0xffffff, 1).setOrigin(0.5, 0.5),
        );
        this.cont.add(
            this.scene.add.rectangle(245, 468, 68, 38, 0x8a8a8a, 0).setStrokeStyle(1, 0xffffff, 1).setOrigin(0.5, 0.5),
        );
        this.block = this.scene.add
            .dynamicBitmapText(265, 472, FONT.BOLD_24, "00")
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-46)
            .setCenterAlign();
        this.cont.add(this.block);

        this.cont.add(
            this.scene.add.bitmapText(360, 430, FONT.BODY_20, "Defense").setOrigin(0.5, 0.5).setCenterAlign(),
        );
        this.cont.add(
            this.scene.add.rectangle(360, 468, 74, 44, 0x8a8a8a, 0).setStrokeStyle(1, 0xffffff, 1).setOrigin(0.5, 0.5),
        );
        this.cont.add(
            this.scene.add.rectangle(360, 468, 68, 38, 0x8a8a8a, 0).setStrokeStyle(1, 0xffffff, 1).setOrigin(0.5, 0.5),
        );
        this.def = this.scene.add
            .dynamicBitmapText(380, 472, FONT.BOLD_24, "00")
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-46)
            .setCenterAlign();
        this.cont.add(this.def);

        this.effectsInfo = this.scene.add
            .dynamicBitmapText(105, 512, FONT.BODY_20, "[EFFECTS]\n>blah lah blah")
            .setLeftAlign()
            .setMaxWidth(290);
        this.cont.add(this.effectsInfo);

        /*********
         * CENTER COLUMN
         */
        this.adventurerPortrait = new AdventurerPortrait(this.scene, 205);
        this.adventurerPortrait.setPosition(530, 175);
        this.cont.add(this.adventurerPortrait.container);

        this.equipIcons = [];

        let ydist = 53;
        let xpos = 505;
        let ypos = 202;
        let e = new EquipIcon(
            this.scene,
            "inv_head.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.HEAD,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        ypos += ydist;
        e = new EquipIcon(
            this.scene,
            "inv_body.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.BODY,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        ypos += ydist;
        e = new EquipIcon(
            this.scene,
            "inv_foot.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.FEET,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        ypos += ydist;
        e = new EquipIcon(
            this.scene,
            "inv_hand.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.WEAPON,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        xpos = 761;
        ypos = 202;

        e = new EquipIcon(
            this.scene,
            "inv_jewelry.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.JEWELRY,
            0,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        ypos += ydist;
        e = new EquipIcon(
            this.scene,
            "inv_jewelry.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.JEWELRY,
            1,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        ypos += ydist;
        e = new EquipIcon(
            this.scene,
            "inv_jewelry.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.JEWELRY,
            2,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        ypos += ydist;
        e = new EquipIcon(
            this.scene,
            "inv_shield.png",
            new Phaser.Math.Vector2(xpos, ypos),
            GlobalConst.EQUIPMENT_SLOT.SHIELD,
        );
        this.equipIcons.push(e);
        this.cont.add(e.container);

        this.cont.add(this.scene.add.image(550, 469, "ui", "icon_key.png").setOrigin(0.5, 0.5));
        this.keys = this.scene.add.dynamicBitmapText(570, 469, FONT.BODY_24, "x0").setOrigin(0, 0.5).setLeftAlign();
        this.cont.add(this.keys);
        this.cont.add(this.scene.add.image(650, 469, "ui", "icon_gold.png").setOrigin(0.5, 0.5));
        this.gold = this.scene.add
            .dynamicBitmapText(669, 469, FONT.BODY_24, "0,000")
            .setOrigin(0, 0.5)
            .setLeftAlign()
            .setLetterSpacing(-1);
        this.cont.add(this.gold);

        this.cont.add(this.scene.add.image(630, 505, "ui", "divider_small.png").setOrigin(0.5, 0.5));

        this.conditionInfo = this.scene.add
            .dynamicBitmapText(
                470,
                530,
                FONT.BODY_20,
                "[CONDITIONS]\n>blah lah blah b blah blah blabh\nagfaegeg dasgdg",
            )
            .setLeftAlign()
            .setMaxWidth(280);
        this.cont.add(this.conditionInfo);

        this.hide();
    }

    keyPressed(keyCode: number): void {
        // throw new Error("Method not implemented.");
        if (InputManager.instance.keyInventory.includes(keyCode)) {
            this.ui.OpenCharSheet();
        }
    }

    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {
        //throw new Error("Method not implemented.");
    }

    pointerMove(x: number, y: number) {
        if (this.sHolder.getBounds().contains(x, y)) {
            let msg: string = GameUtil.formatBonus(GlobalConst.GetDefBonusSpirit(this.scene.player.sp)) + " defense\n";

            msg += "\nSpirit Weapons:\n";
            let hitbonus = GlobalConst.GetToHitBonusByBAGS(this.scene.player.sp);
            let dambonus = GlobalConst.GetDamageBonusByBAGS(this.scene.player.sp);
            msg += GameUtil.formatBonus(hitbonus) + " to hit\n";
            msg += GameUtil.formatBonus(dambonus) + " to dmg\n";

            ToolTipManager.instance.Show(this.sHolder.x + 10, this.sHolder.y + 5, msg, this.sHolder, 700, 150, 150);
        } else if (this.bHolder.getBounds().contains(x, y)) {
            let msg: string = GameUtil.formatBonus(GlobalConst.GetHPAdjustmentBrawn(this.scene.player.br)) + " HP\n";

            msg += "\nBrawn Weapons:\n";
            let hitbonus = GlobalConst.GetToHitBonusByBAGS(this.scene.player.br);
            let dambonus = GlobalConst.GetDamageBonusByBAGS(this.scene.player.br);
            msg += GameUtil.formatBonus(hitbonus) + " to hit\n";
            msg += GameUtil.formatBonus(dambonus) + " to dmg\n";

            ToolTipManager.instance.Show(this.bHolder.x + 10, this.bHolder.y + 5, msg, this.bHolder, 700, 150, 150);
        } else if (this.aHolder.getBounds().contains(x, y)) {
            let msg: string =
                GameUtil.formatBonus(GlobalConst.GetDodgeBonusByAgility(this.scene.player.ag)) + " Dodge\n";

            msg += "\nAgility Weapons:\n";
            let hitbonus = GlobalConst.GetToHitBonusByBAGS(this.scene.player.ag);
            let dambonus = GlobalConst.GetDamageBonusByBAGS(this.scene.player.ag);
            msg += GameUtil.formatBonus(hitbonus) + " to hit\n";
            msg += GameUtil.formatBonus(dambonus) + " to dmg\n";

            ToolTipManager.instance.Show(this.aHolder.x + 10, this.aHolder.y + 5, msg, this.aHolder, 700, 150, 150);
        } else if (this.gHolder.getBounds().contains(x, y)) {
            let msg: string = GameUtil.formatBonus(GlobalConst.GetGuileLuckBonus(this.scene.player.gu)) + " Luck\n";
            msg += GameUtil.formatBonus(GlobalConst.GetGuileCritBonus(this.scene.player.gu)) + " Crit Chance\n";

            ToolTipManager.instance.Show(this.gHolder.x + 10, this.gHolder.y + 5, msg, this.gHolder, 700, 150, 100);
        } else {
            ToolTipManager.instance.Clear();
        }
    }

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
        this.adventurerPortrait.updateHP(this.scene.player.hp, this.scene.player.hpmax);
        this.gold.text = this.scene.player.gold + "";
        this.keys.text = "x" + this.scene.player.keys;
        this.def.text = this.scene.player.def + "";
        this.dodge.text = this.scene.player.dodge + "";
        this.block.text = this.scene.player.block + "";

        this.brawn.text = this.scene.player.br + "";
        this.agility.text = this.scene.player.ag + "";
        this.guile.text = this.scene.player.gu + "";
        this.spirit.text = this.scene.player.sp + "";
        this.level.text = this.scene.player.level + "";

        let condText: string = "[CONDITIONS]\n";
        if (this.scene.player.conditions != undefined) {
            for (let e = 0; e < this.scene.player.conditions.length; e++) {
                let c: Condition = this.scene.player.conditions[e];
                condText += EffectManager.instance.GetConditionDescription(c) + "\n";
            }
        }

        condText += EffectManager.instance.GetResVulnImmDescription(this.scene.player.effects);
        this.conditionInfo.text = condText;

        let effText = "[ACTIVE EFFECTS]\n";
        let AGGREGATE_EFFECTS: boolean = true;

        if (AGGREGATE_EFFECTS) {
            if (this.scene.player?.effects?.length > 0) {
                effText += EffectManager.instance.GetAggregatedEffectsDescriptions(this.scene.player.effects);
            }
        } else {
            for (let e = 0; e < this.scene.player.effects.length; e++) {
                let eff: Effect = this.scene.player.effects[e];
                // skip res/vuln/imm effects
                if (
                    eff.type != GlobalConst.EFFECT_TYPES.RESIST &&
                    eff.type != GlobalConst.EFFECT_TYPES.IMMUNE &&
                    eff.type != GlobalConst.EFFECT_TYPES.VULNERABLE
                ) {
                    effText += EffectManager.instance.GetEffectDescription(eff) + "\n";
                }
            }
        }

        this.effectsInfo.text = effText;

        this.skills.ClearContainers(1);

        if (this.scene.player.skills != undefined) {
            //  for (let i = 0; i < 5; i++) {
            for (let t = 0; t < this.scene.player.skills.length; t++) {
                let c = this.scene.add.container(0, 0);
                let skillBits = this.scene.player.skills[t].split(":");
                let title = this.scene.add
                    .bitmapText(0, 0, FONT.BODY_20, "[skill] " + skillBits[0].trim())
                    .setTint(0xc0a255)
                    .setLeftAlign();
                let body = this.scene.add
                    .bitmapText(2, 20, FONT.BODY_20, skillBits[1].trim())
                    .setLeftAlign()
                    .setMaxWidth(300);
                c.add([title, body]);
                // c.set
                this.skills.addContainer(c, 65);
            }
            //}
        }

        if (this.scene.player.traits != undefined) {
            //  for (let i = 0; i < 5; i++) {
            for (let t = 0; t < this.scene.player.traits.length; t++) {
                let c = this.scene.add.container(0, 0);
                let traitBits = this.scene.player.traits[t].split(":");
                let title = this.scene.add
                    .bitmapText(0, 0, FONT.BODY_20, "[trait] " + traitBits[0].trim())
                    .setTint(0xc0a255)
                    .setLeftAlign();
                let body = this.scene.add
                    .bitmapText(2, 20, FONT.BODY_20, traitBits[1].trim())
                    .setLeftAlign()
                    .setMaxWidth(300);
                c.add([title, body]);
                // c.set
                this.skills.addContainer(c, 65);
            }
            //}
        }

        if (this.scene.player != undefined && this.scene.player.inventory != undefined) {
            for (let i = 0; i < this.equipIcons.length; i++) {
                this.equipIcons[i].Clear();
            }

            for (let i = 0; i < this.scene.player.inventory.length; i++) {
                if (
                    this.scene.player.inventory[i].itemData.slot != GlobalConst.EQUIPMENT_SLOT.NONE &&
                    this.scene.player.inventory[i].itemData.equippedslot != GlobalConst.EQUIPMENT_SLOT.NONE
                ) {
                    let itemPlaced: boolean = false;
                    let slot = this.scene.player.inventory[i].itemData.equippedslot;
                    for (let e = 0; e < this.equipIcons.length; e++) {
                        if (
                            !itemPlaced &&
                            this.equipIcons[e].imageActive == undefined &&
                            this.equipIcons[e].slot == slot
                        ) {
                            itemPlaced = true;
                            this.equipIcons[e].SetItem(this.scene.player.inventory[i]);
                        }
                    }
                }
            }
        }
    }

    public hide() {
        this.cont.visible = false;
        this.cont.active = false;
    }

    public show() {
        this.cont.visible = true;
        this.cont.active = true;
        this.updateData();
    }

    public IsOpen() {
        return this.cont.visible;
    }

    public get container(): Phaser.GameObjects.Container {
        return this.cont;
    }
}
