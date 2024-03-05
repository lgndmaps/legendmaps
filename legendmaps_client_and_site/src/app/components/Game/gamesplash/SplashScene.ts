import Phaser from "phaser";
import { RootStore, rootStore } from "../../../../stores/RootStore";
import { GameStore } from "../../../../stores/GameStore";

export class SplashScene extends Phaser.Scene {
    //rexUI: UIPlugin;
    store: RootStore;
    gameStore: GameStore;
    initialWidth: number;
    graphics: any;
    buttonReveal: Phaser.Time.TimerEvent;

    constructor() {
        super("SplashScene");
        this.store = rootStore;
        this.gameStore = this.store.gameStore;
    }

    preload() {
        this.load.atlas("splash", "/splash/splash.png", "/splash/splash.json");
        this.load.audio("bgmusic", "/sound/splash_a.mp3");
        this.load.audio("raven", "/sound/raven.mp3");
        this.load.audio("enterbutton", "/sound/enterbutton.mp3");
    }

    create() {
        let container: Phaser.GameObjects.Container = this.add.container(0, 0);

        let bgl = this.add.image(0, 0, "splash", "splash_bg_l.png").setOrigin(0, 0);
        let bgr = this.add.image(520, 0, "splash", "splash_bg_r.png").setOrigin(0, 0);

        let raven = this.add.image(1220, 340, "splash", "raven.png").setOrigin(0, 0);

        let enterbtn = this.add.image(1800, 300, "splash", "enter_btn.png").setOrigin(0, 0);
        bgl.alpha = 0;
        bgr.alpha = 0;
        raven.alpha = 1;
        enterbtn.alpha = 0;

        container.add([bgl, bgr, raven, enterbtn]);

        this.tweens.add({
            targets: [bgl, bgr],

            alpha: 1,
            duration: 3000,
        });
        this.tweens.add({
            targets: container,
            x: -1260,
            y: 0,
            duration: 8000,
            ease: Phaser.Math.Easing.Quadratic.InOut,
        });

        let bg: Phaser.Sound.BaseSound = this.game.sound.add("bgmusic", { loop: true, volume: 0.5 });
        bg.play();

        let ravensnd: Phaser.Sound.BaseSound = this.game.sound.add("raven", { loop: false, volume: 1 });

        this.time.delayedCall(
            6000,
            () => {
                ravensnd.play();
                raven.setFrame("raven_open.png");
                this.time.delayedCall(
                    500,
                    () => {
                        raven.setFrame("raven.png");
                    },
                    [],
                    this,
                );
            },
            [],
            this,
        );
        this.time.delayedCall(
            7000,
            () => {
                ravensnd.play();
                raven.setFrame("raven_open.png");
                this.time.delayedCall(
                    500,
                    () => {
                        raven.setFrame("raven.png");
                    },
                    [],
                    this,
                );
            },
            [],
            this,
        );

        let btnsound: Phaser.Sound.BaseSound = this.game.sound.add("enterbutton", { loop: false, volume: 1 });

        //phaser capture space bar press and kill all tweens
        this.input.keyboard.on("keydown-SPACE", () => {
            this.tweens.killAll();
        });

        this.input.keyboard.on("keydown", (event) => {
            if (this.buttonReveal != null) {
                this.buttonReveal.remove(true);
                this.tweens.killAll();
                container.setPosition(-1260, 0);
                bgl.alpha = 1;
                bgr.alpha = 1;
            }
        });

        this.buttonReveal = this.time.delayedCall(
            9000,
            () => {
                btnsound.play();
                enterbtn.setOrigin(0, 0);
                enterbtn.setInteractive({
                    cursor: "pointer",
                    hitArea: new Phaser.Geom.Rectangle(-300, -210, 600, 550),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                });
                enterbtn.on("pointerup", () => {
                    this.scale.refresh();
                    this.scene.stop("SplashScene");
                    this.gameStore.goToInitialLanding();
                });

                this.tweens.add({
                    targets: enterbtn,
                    alpha: 1,
                    duration: 500,
                });
            },
            [],
            this,
        );
    }
}
