import { LMScene } from "../../LMScene";
import { GameUI } from "./gameUI";
import LMUIElement from "./uielements/LMUIElement";
import Dweller from "../entities/Dweller";
import DwellerPanel from "./DwellerPanel";
import MathUtil from "../../../util/mathUtil";
import { LMMeterDweller } from "./uielements/LMMeterDweller";
import { FONT, PHASER_DEPTH } from "../../../types/localConst";
import { ToolTipManager } from "./toolTipManager";
import StringUtil from "../../../util/stringUtil";
import InputManager from "../InputManager";

export default class DwellerPanelPortrait extends LMUIElement {
    private ui: GameUI;
    public id: number = -1;
    private hp: number;
    private maxhp: number;
    private name: string;
    private dweller: Dweller;
    private background: Phaser.GameObjects.Rectangle;
    private highlight: Phaser.GameObjects.Rectangle;
    private healthBar: LMMeterDweller;
    private portrait: Phaser.GameObjects.Image;
    private label: Phaser.GameObjects.BitmapText;
    private highlightbaseColor: number = 0x666666;
    private highlightstate: "combat" | "hover" | "default" = "default";
    public gotFreshUpdate: boolean = false;

    public targetY: number = 0;
    public isFocused: boolean = false;
    private activeTween: Phaser.Tweens.Tween;

    private portsize = 160;
    constructor(scene: LMScene, gameUI: GameUI) {
        super(scene);
        this.ui = gameUI;
    }

    init(dweller: Dweller) {
        if (dweller.isBoss) {
            /*
            let bossFrame = this.scene.add
                .rectangle(-this.portsize - 1, -1, this.portsize + 1, this.portsize + 1, 0x000000, 1)
                .setOrigin(0, 0);
            bossFrame.setStrokeStyle(1, 0xd7b04b, 1);
            this.container.add([bossFrame]);

             */
        }

        this.background = this.scene.add
            .rectangle(-this.portsize, 0, this.portsize, this.portsize, 0x000000, 1)
            .setOrigin(0, 0);
        // this.background.setStrokeStyle(1, 0xdddddd, 1);

        this.dweller = dweller;
        this.name = dweller.name;

        this.id = dweller.id;
        this.portrait = this.scene.add.image(-this.portsize, 0, "dwellerp", dweller.GetPortraitName()).setOrigin(0, 0);
        //this.portrait.setScale(this.portsize / 400, this.portsize / 400);

        this.healthBar = new LMMeterDweller(this.scene, this.portsize, 20, dweller.name, 0xff1f00, 2);

        this.highlight = this.scene.add
            .rectangle(-this.portsize, 0, this.portsize, this.portsize + 21, 0x000000, 0)
            .setOrigin(0, 0);
        this.highlight.setStrokeStyle(1, this.highlightbaseColor, 1);

        this._container.add([this.background, this.portrait, this.healthBar.container, this.highlight]);
        this.healthBar.setPosition(-this.portsize, this.portsize + 1);

        this.maxhp = dweller.maxhp;
        this.updateHP(dweller.hp);
        this.gotFreshUpdate = true;
        this.setPosition(DwellerPanel.POS_X_BASE, -200);
        this.container.setScale(0, 0);
        this.container.setAlpha(0);

        this.background.setInteractive(); //{ cursor: "pointer" }
        this.background.on("pointerup", this.handleClick, this);
        this.background.on("pointerover", this.handleHover, this);
        this.background.on("pointerout", this.moveOut, this);
    }

    handleClick() {
        this.showToolTip(0);
    }

    handleHover() {
        this.showToolTip(500);
    }

    showToolTip(delay: number) {
        if (!InputManager.instance.allowInput()) return;
        if (InputManager.instance.activeController != this.ui) return;
        let content = this.getToolTipContent();
        let sizeY = 181;

        if (content.length > 90) {
            sizeY = 350;
        }
        ToolTipManager.instance.Show(
            this.container.x - 412,
            this.container.y,
            this.getToolTipContent(),
            this,
            delay,
            250,
            sizeY,
        );
    }

    getToolTipContent(): string {
        let content = StringUtil.titleCase(this.dweller.name) + ", level " + this.dweller.level + "\n";
        content += "Type: " + this.dweller.phy + "\n";
        content += "HP: " + this.dweller.hp + "/" + this.dweller.maxhp + "\n";

        if (this.dweller.def != null) {
            //if def is there other base stats are there
            content += "Defense: " + this.dweller.def + "\n";
            content += "Block: " + this.dweller.block + "\n";
            content += "Dodge: " + this.dweller.dodge + "\n";
        }
        if (this.dweller.vuln != null) {
            content += "Vulnerabilities: " + this.dweller.vuln + "\n";
        }
        if (this.dweller.res != null) {
            content += "Resistances: " + this.dweller.res + "\n";
        }
        if (this.dweller.imm != null) {
            content += "Immunities: " + this.dweller.imm + "\n";
        }
        content += "\n[Attack] " + this.dweller.atk + "\n";
        if (this.dweller.spec != null) {
            content += "[Special] " + this.dweller.spec + "\n";
        }
        return content;
    }

    moveOut() {
        if (!InputManager.instance.allowInput()) return;
        if (InputManager.instance.activeController != this.ui) return;
        ToolTipManager.instance.Clear();
    }

    updateDweller(dweller: Dweller) {
        if (this.id == -1) {
            throw new Error("missing dweller portrait");
        }

        this.updateHP(dweller.hp);
        this.gotFreshUpdate = true;
    }

    updateHP(hp: number) {
        this.hp = hp;
        this.healthBar.setFillPercent(this.hp / this.maxhp);
    }

    adjustHP(hp: number) {
        this.hp += hp;
        this.updateHP(this.hp);
    }

    highlightHover() {
        if (this.highlightstate == "combat") {
            return;
        }
        this.highlightstate = "hover";
        this.highlight.setStrokeStyle(1, 0x33ff33, 1);
    }

    highlightCombat() {
        console.log("unused combat highlight fx");
        return;
        this.highlightstate = "combat";
        this.highlight.setStrokeStyle(1, 0xff3333, 1);
    }

    highlightClear(dontClearIfCombat: boolean = false) {
        if (dontClearIfCombat && this.highlightstate == "combat") {
            return;
        }
        this.highlightstate = "default";
        this.highlight.setStrokeStyle(1, this.highlightbaseColor, 1);
    }

    updateTween(targetY: number) {
        if (this.activeTween != null) {
            this.activeTween.stop();
            this.activeTween = null;
        }
        this.targetY = targetY;

        let time: number = Math.abs(this.container.y - targetY);
        time = MathUtil.clamp(time, 50, 350);
        this.activeTween = this.scene.tweens.add({
            targets: this.container,
            x: DwellerPanel.POS_X_BASE,
            y: targetY,
            scaleX: 1,
            scaleY: 1,
            duration: time,
            alpha: 1,
            ease: "Cubic.easeIn",
        });
    }
}
