import Phaser from "phaser";
import {RootStore, rootStore} from "../../../stores/RootStore";
import {LMScene} from "../LMScene";
import {LMButtonText} from "../gameplay/ui/uielements/LMButtonText";
import {websocketManager} from "../../util/websockets";
import {LMTextBox} from "../gameplay/ui/uielements/LMTextBox";
import LMCheckBox from "../gameplay/ui/uielements/LMCheckbox";
import {Params_Game_Start_Debug} from "../../types/globalTypes";
import {GameStore} from "../../../stores/GameStore";
import GlobalConst from "../../types/globalConst";
import Slash from "../gameplay/effects/Slash";
import {FONT} from "../../types/localConst";

export class HomeScene extends LMScene {
    //rexUI: UIPlugin;
    store: RootStore;
    gameStore: GameStore;
    initialWidth: number;
    graphics: any;

    maptextbox: LMTextBox;
    advtextbox: LMTextBox;
    seedtextbox: LMTextBox;
    cleardata: LMCheckBox;

    constructor() {
        super("HomeScene");
        this.store = rootStore;
        this.gameStore = this.store.gameStore;
    }

    preload() {
        super.preload();
        //ts-config
        // this.load.neutrino('water_stream', 'export_js/water_stream.js');
        this.load.image("px_mote", "/gamegfx/px_mote.png");
        this.load.image("px_4point_10", "/gamegfx/px_4point_10.png");
        this.load.image("px_round_12", "/gamegfx/px_round_12.png");
        this.load.image("px_diamond_15", "/gamegfx/px_diamond_15.png");
        this.load.image("px_square_10", "/gamegfx/px_square_10.png");
        this.load.image("px_star_10", "/gamegfx/px_star_10.png");
        this.load.image("px_x_4", "/gamegfx/px_x_4.png");
        this.load.image("px_splat_30", "/gamegfx/px_splat_30.png");
        this.load.image("px_arrow", "/gamegfx/px_arrow.png");

        /*
        FOURPT_10: "px_4point_10",
    DIAMOND_15: "px_diamond_15",
    ROUND_12: "px_round_12",
    SQUARE_10: "px_square_10",
    STAR_10: "px_star_10",
    X4: "px_x_4",
    BASIC: "spark0",
    BASIC_ALT: "spark1",
         */
        this.load.image("spark0", "/gamegfx/spark0.png");
        this.load.image("ring16", "/gamegfx/potential_particles/ring_16px.png");
        this.load.image("circle10", "/gamegfx/potential_particles/circle_pt_10px.png");
        this.load.image("circle10b", "/gamegfx/potential_particles/circle_pt_10px_bk.png");
        this.load.image("pill", "/gamegfx/potential_particles/pill.png");
        this.load.image("pill2", "/gamegfx/potential_particles/pill2.png");
        this.load.image("smslash", "/gamegfx/potential_particles/smslash.png");
        this.initializeSceneVars();
    }

    create() {
        super.create();
        if (this.gameStore.isDebugGame) {
            this.graphics = this.add.graphics();
            (this.cameras.main as any).preRender();
            this.cameras.main.fadeIn(500, 0, 0, 0);

            let yp: number = 50;

            const logoText = this.add
                .bitmapText(350, yp, FONT.TITLE_24, "Legend Maps Development", 24)
                .setOrigin(0, 0.5)
                .setDepth(10);
            yp += 15;
            this.add.bitmapText(350, yp, FONT.BODY_24, "Alpha", 24).setOrigin(0, 0);
            yp += 50;

            this.add.bitmapText(350, yp, FONT.BODY_24, "Map ID:", 24).setOrigin(0, 0).setDepth(10);
            this.add.bitmapText(455, yp, FONT.BODY_24, "Adv ID:", 24).setOrigin(0, 0).setDepth(10);
            this.add.bitmapText(560, yp, FONT.BODY_24, "Seed:", 24).setOrigin(0, 0).setDepth(10);
            yp += 38;
            this.maptextbox = new LMTextBox(
                this,
                "Enter Map ID",
                new Phaser.Math.Vector2(100, 50),
                new Phaser.Math.Vector2(350, yp),
            );

            this.maptextbox.setText("" + 70);
            this.advtextbox = new LMTextBox(
                this,
                "Enter Map ID",
                new Phaser.Math.Vector2(100, 50),
                new Phaser.Math.Vector2(455, yp),
            );
            this.advtextbox.setText("" + 4565);

            this.seedtextbox = new LMTextBox(
                this,
                "Seed:",
                new Phaser.Math.Vector2(150, 50),
                new Phaser.Math.Vector2(560, yp),
            );
            this.seedtextbox.setText("" + 1);

            yp += 40;
            this.cleardata = new LMCheckBox(this, "Clear Game Data", new Phaser.Math.Vector2(350, yp));
            this.cleardata.setChecked(true);
            yp += 50;
            const b = new LMButtonText(
                this,
                "Randomize",
                new Phaser.Math.Vector2(200, 42),
                new Phaser.Math.Vector2(400, yp),
                () => {
                    this.maptextbox.setText("" + Math.floor(Math.random() * 5756));
                    this.advtextbox.setText("" + Math.floor(Math.random() * 8787));
                    this.seedtextbox.setText("" + Math.floor(Math.random() * 100000000));
                },
            );
            yp += 60;
            const playButton = new LMButtonText(
                this,
                "Play",
                new Phaser.Math.Vector2(200, 42),
                new Phaser.Math.Vector2(400, yp),
                () => {
                    this.ConnectGameSession();
                },
            );

            yp += 80;
            const particleEditorButton = new LMButtonText(
                this,
                "Particle Editor",
                new Phaser.Math.Vector2(200, 42),
                new Phaser.Math.Vector2(400, yp),
                () => {
                    this.changeScene("ParticleEditor");
                },
            );

            yp += 110;

            new LMButtonText(this, "A", new Phaser.Math.Vector2(50, 50), new Phaser.Math.Vector2(300, yp), () => {
                new Slash().Play(this.scene.scene, new Phaser.Math.Vector2(150, 150), GlobalConst.MOVE_DIR.NORTH);
            });

            new LMButtonText(this, "B", new Phaser.Math.Vector2(50, 50), new Phaser.Math.Vector2(380, yp), () => {
            });

            new LMButtonText(this, "C", new Phaser.Math.Vector2(50, 50), new Phaser.Math.Vector2(460, yp), () => {
                this.p3();
            });
            new LMButtonText(this, "D", new Phaser.Math.Vector2(50, 50), new Phaser.Math.Vector2(540, yp), () => {
                this.p4();
            });
        } else {
            this.ConnectGameSession();
        }
    }

    private p1() {
        let c = this.add.container(150, 300);
        let particles = this.add.particles("pill2");
        let em1 = particles.createEmitter({
            lifespan: {min: 100, max: 100},

            alpha: {start: 0.8, end: 0.1},
            gravityY: 0,
            //rotate: { min: 0, max: 360 },
            quantity: 1,
            emitZone: {type: "random", source: new Phaser.Geom.Circle(0, 0, 0.5)},
            blendMode: Phaser.BlendModes.OVERLAY,
        });
        em1.stop();
        c.add(particles);

        let curve = new Phaser.Curves.Spline([0, -5, 30, -20, 60, -5]);

        this.tweens.add({
            targets: c,
            alpha: 1,
            onStart: () => {
            },
            onUpdate: (tween) => {
                em1.setPosition(curve.getPoint(tween.progress).x, curve.getPoint(tween.progress).y);
                let sc: number = 0.5 - Math.abs(0.5 - tween.progress);
                let startScale: number = sc * 2;
                if (startScale < 0.01) startScale = 0.01;
                em1.setScale({start: startScale, end: 0});
                // em1.setTint(GFXUtil.RGBToHex(150 + 150 * sc, 150 + 150 * sc, 180 + 150 * sc));
                em1.emitParticle(3);
            },
            duration: 100,
            onComplete: () => {
                em1.stop();
            },
            ease: Phaser.Math.Easing.Linear,
        });
    }

    private p1b() {
        let c = this.add.container(150, 300);
        let particles = this.add.particles("pill2");
        let em2 = particles.createEmitter({
            lifespan: {min: 100, max: 150},

            alpha: {start: 0.1, end: 0},
            // tint: { min: 0x333333, max: 0x999999 },
            gravityY: 0,
            //rotate: { min: 0, max: 360 },
            quantity: 3,
            emitZone: {type: "random", source: new Phaser.Geom.Circle(0, 0, 1)},
            blendMode: Phaser.BlendModes.NORMAL,
        });
        em2.stop();
        c.add(particles);

        let curve = new Phaser.Curves.Spline([0, 0, 30, -15, 60, 0]);

        this.tweens.add({
            targets: c,
            alpha: 1,
            onStart: () => {
            },
            onUpdate: (tween) => {
                em2.setPosition(curve.getPoint(tween.progress).x, curve.getPoint(tween.progress).y);
                let sc: number = 0.5 - Math.abs(0.5 - tween.progress);
                em2.setScale({start: sc * 3, end: 0});
                //em2.setTint(0xffffff33);
                //em2.setTint(GFXUtil.RGBToHex(150 + 150 * sc, 150 + 150 * sc, 180 + 150 * sc));
                em2.emitParticle();
            },
            duration: 100,
            onComplete: () => {
                em2.stop();
            },
            ease: Phaser.Math.Easing.Linear,
        });
    }

    private p2() {
    }

    private p3() {
    }

    private p4() {
    }

    private ConnectGameSession() {
        if (this.gameStore.isDebugGame) {
            websocketManager.connect(() => this.OnDebugSocketConnection());
        } else {
            websocketManager.connect(() => this.OnSocketConnection());
        }
    }

    async OnDebugSocketConnection() {
        console.log("Debug Sockect Connected,  Send Debug Game Start Command");
        let debugStartCommand: Params_Game_Start_Debug = {
            wipeData: this.cleardata.isChecked() ? true : false,
            mapId: parseInt(this.maptextbox.getText()),
            adventurerId: parseInt(this.advtextbox.getText()),
            seed: parseInt(this.seedtextbox.getText()),
        };
        websocketManager.sendStateCommand(
            {
                type: GlobalConst.GLOBAL_COMMAND_TYPE.GAME_STATE,
                commandMessage: "debugstart",
                commandParams: debugStartCommand,
            },
            async () => {
                await this.gameStore.loadCampaign();
                await this.gameStore.setSessionFromCurrentCampaign();
                this.changeScene("GameScene");
            },
        );
    }

    OnSocketConnection() {
        websocketManager.sendStateCommand({
            type: GlobalConst.GLOBAL_COMMAND_TYPE.GAME_STATE,
            commandMessage: "start",
        });
        this.changeScene("GameScene");
    }
}
