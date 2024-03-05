import { GameScene } from "../GameScene";
import gameConfig from "../../gameplay/gameConfig.json";
import { FONT, PHASER_DEPTH } from "../../../types/localConst";

export class Floater extends Phaser.GameObjects.Container {
    public gameScene: GameScene;
    public txt: Phaser.GameObjects.DynamicBitmapText;
    public out: Phaser.GameObjects.DynamicBitmapText;

    constructor(
        scene: GameScene,
        text: string,
        x: number,
        y: number,
        color: number = 0xffffff,
        colorOut: number = 0xffffff,
        delayStart: number = 0,
        depth: number = PHASER_DEPTH.COMBAT_UI_OVERLAY,
    ) {
        super(scene);
        this.gameScene = scene;
        this.scene.children.add(this);

        this.txt = this.scene.add
            .dynamicBitmapText(-15, 0, FONT.FLOATER_FILL, text)
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-43);
        this.txt.setTint(color);

        this.add(this.txt);

        this.out = this.scene.add
            .dynamicBitmapText(-15, 0, FONT.FLOATER_OUTLINE, text)
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(-43);
        this.out.setTint(colorOut);
        this.add(this.out);

        this.setDepth(depth);
        this.setPosition(x, y);

        let floaterTimeline = this.gameScene.tweens.createTimeline();

        this.setScale(1, 1);
        this.setAlpha(0);
        let floaterspeed = 0.8;
        floaterTimeline.add({
            targets: this,
            alpha: 1,
            scaleX: 0.8,
            scaleY: 0.8,
            onUpdate: (tween, target, param) => {
                this.setPosition(this.x, this.y - floaterspeed * 1.5);
            },
            duration: 90,
            delay: delayStart,
        });

        floaterTimeline.add({
            targets: this,
            alpha: 1,
            onUpdate: (tween, target, param) => {
                this.setPosition(this.x, this.y - floaterspeed);
            },
            duration: 610,
        });

        floaterTimeline.add({
            targets: this,
            alpha: 0,
            onUpdate: (tween, target, param) => {
                this.setPosition(this.x, this.y - floaterspeed);
            },
            ease: "Cubic.easeOut",
            duration: 100,
        });

        floaterTimeline.play();
    }
}
