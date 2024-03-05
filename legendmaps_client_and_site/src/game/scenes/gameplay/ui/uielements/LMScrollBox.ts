import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import { FONT } from "../../../../types/localConst";
import { GameScene } from "../../GameScene";
import MathUtil from "../../../../util/mathUtil";

export class LMScrollBox extends LMUIElement {
    private width: number;
    private height: number;

    private background: Phaser.GameObjects.Rectangle;

    private contents: Phaser.GameObjects.Container;

    private scrollup: Phaser.GameObjects.Image;
    private scrolldown: Phaser.GameObjects.Image;
    private scrolldrag: Phaser.GameObjects.Rectangle;
    private scrollbg: Phaser.GameObjects.Rectangle;

    private conts: Phaser.GameObjects.Container[];
    private cheights: number[];

    scrollTop: number = 0;
    scrollBot: number = 0;
    scrollAmount = 0;
    lastPos = 0;

    constructor(scene: GameScene, width: number, height: number) {
        super(scene);

        this.conts = [];
        this.cheights = []; //sigh, phaser
        this.width = width;
        this.height = height;

        this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 1).setOrigin(0, 0);

        this.contents = scene.add.container(0, 0);

        this.scrollbg = scene.add.rectangle(width - 13, 30, 2, height - 60, 0xffffff, 0.5).setOrigin(0.5, 0);

        this.scrollup = scene.add
            .image(width - 13, 0, "ui", "scroll_arrow.png")
            .setOrigin(0.5, 1)
            .setRotation(Math.PI)
            .setInteractive({ cursor: "pointer" });

        this.scrolldown = scene.add
            .image(width - 13, height, "ui", "scroll_arrow.png")
            .setOrigin(0.5, 1)
            .setInteractive({ cursor: "pointer" });

        this.scrolldrag = scene.add
            .rectangle(width - 13, this.scrollbg.y, 23, 60, 0xffffff)
            .setOrigin(0.5, 0)
            .setInteractive({ cursor: "pointer" });

        this.scene.input.setDraggable(this.scrolldrag);
        this.scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (gameObject == this.scrolldrag) {
                this.scrolldrag.y = MathUtil.clamp(dragY, this.scrollTop, this.scrollBot);
            }
        });

        this.scrolldown.on("pointerdown", this.doScrollDown, this);
        this.scrolldown.on("pointerup", this.stopScroll, this);

        this.scrollup.on("pointerdown", this.doScrollUp, this);
        this.scrollup.on("pointerup", this.stopScroll, this);

        let fakemasktop = scene.add.rectangle(0, 0, width - 25, 600, 0x000000, 1).setOrigin(0, 0);
        let fakemaskbottom = scene.add.rectangle(0, 0, width - 25, 600, 0x000000, 1).setOrigin(0, 0);

        this.scrollTop = this.scrollbg.y;
        this.scrollBot = this.scrollTop + this.scrollbg.height - 60;

        this._container.add([
            this.background,
            this.contents,

            fakemasktop,
            fakemaskbottom,
            this.scrollbg,
            this.scrollup,
            this.scrolldown,
            this.scrolldrag,
        ]);

        fakemasktop.setPosition(0, fakemasktop.y - 600);
        fakemaskbottom.setPosition(0, fakemaskbottom.y + height);

        this.scene.events.on("update", (time, delta) => {
            this.update(time, delta);
        });
    }

    public addContainer(cont: Phaser.GameObjects.Container, height: number) {
        this.conts.push(cont);
        this.cheights.push(height);
        this.contents.add(cont);
        let y = 5;
        for (let i = 0; i < this.conts.length; i++) {
            this.conts[i].setPosition(0, y);
            y += this.cheights[i] + 5;
        }
        this.updateScrollParams();
    }

    public ClearContainers(afterIndex: number = 0) {
        let newconts = [];
        let newheights = [];
        for (let i = 0; i < this.conts.length; i++) {
            if (i < afterIndex) {
                newconts[i] = this.conts[i];
                newheights[i] = this.cheights[i];
            } else {
                this.conts[i].destroy();
            }
        }
        this.cheights = newheights;
        this.conts = newconts;
    }

    scrollDir = 0;
    doScrollDown() {
        this.scrollDir = 1;
    }

    doScrollUp() {
        this.scrollDir = -1;
    }

    stopScroll() {
        this.scrollDir = 0;
    }

    private updateScrollParams() {
        let totalHeight = 0;
        for (let i = 0; i < this.cheights.length; i++) {
            totalHeight += this.cheights[i];
        }
        if (totalHeight < this.height) {
            this.scrollAmount = 0;
            this.scrolldrag.alpha = 0;
            this.scrollup.alpha = 0;
            this.scrolldown.alpha = 0;
            this.scrollbg.alpha = 0.2;
        } else {
            this.scrolldrag.alpha = 1;
            this.scrollup.alpha = 0.5;
            this.scrolldown.alpha = 1;
            this.scrollAmount = totalHeight - this.height / 2;
        }
        this.scrolldrag.y = this.scrollTop;
        this.contents.y = 0;
    }

    update(time, delta) {
        if (this.scrollAmount == 0) {
            return;
        }
        if (this.scrollDir != 0) {
            let newy = this.scrolldrag.y + this.scrollDir * delta * 0.3;
            newy = MathUtil.clamp(newy, this.scrollTop, this.scrollBot);
            this.scrolldrag.y = newy;
        }

        if (this.scrolldrag.y != this.lastPos) {
            this.lastPos = this.scrolldrag.y;

            let perc = (this.scrolldrag.y - this.scrollTop) / (this.scrollBot - this.scrollTop);
            this.contents.y = perc * this.scrollAmount * -1;
            if (perc >= 0.99) {
                this.scrollup.alpha = 1;
                this.scrolldown.alpha = 0.3;
            } else if (perc <= 0.01) {
                this.scrollup.alpha = 0.3;
                this.scrolldown.alpha = 1;
            } else {
                this.scrollup.alpha = 1;
                this.scrolldown.alpha = 1;
            }
        }
    }

    Reset() {
        this.ClearContainers();
        this.updateScrollParams();
    }
}
