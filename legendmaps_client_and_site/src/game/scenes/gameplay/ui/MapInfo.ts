import LMUIElement from "./uielements/LMUIElement";
import { LMButtonText } from "./uielements/LMButtonText";
import { InputController } from "../../../types/frontendTypes";
import GlobalConst from "../../../types/globalConst";
import { GameUI } from "./gameUI";
import InputManager from "../InputManager";
import { GameScene } from "../GameScene";
import { gameStore } from "../../../../stores/RootStore";
import { FONT } from "../../../types/localConst";

export class MapInfo extends LMUIElement implements InputController {
    blockInput: boolean = false;
    private fadeout: Phaser.GameObjects.Rectangle;
    private box: Phaser.GameObjects.Rectangle;
    private mapbox: Phaser.GameObjects.Rectangle;
    private title: Phaser.GameObjects.DynamicBitmapText;
    private details: Phaser.GameObjects.DynamicBitmapText;
    private map: Phaser.GameObjects.DynamicBitmapText;
    private closeBtn: LMButtonText;

    private returnControl: InputController;

    public ui: GameUI;
    private gameScene: GameScene;
    constructor(scene: GameScene, ui: GameUI) {
        super(scene);

        let BASEX = 250;
        let BASEY = 60;
        this.gameScene = scene;
        this.ui = ui;

        this.fadeout = scene.add.rectangle(0, 0, 1260, 760, 0x000000, 0.8).setOrigin(0, 0);
        this.fadeout.setInteractive();

        this.box = scene.add.rectangle(BASEX, BASEY, 840, 580, 0x000000, 1).setOrigin(0, 0);
        this.box.setStrokeStyle(2, 0xffffffff, 1);
        this.box.setInteractive();

        this.title = scene.add
            .dynamicBitmapText(BASEX + 35, BASEY + 35, FONT.TITLE_24, "Game Map", 24)
            .setOrigin(0, 0)
            .setMaxWidth(530);
        this.details = scene.add
            .dynamicBitmapText(BASEX + 35, BASEY + 70, FONT.BODY_24, "...", 24)
            .setOrigin(0, 0)
            .setLetterSpacing(-1);

        this.mapbox = scene.add.rectangle(BASEX + 250, BASEY + 70, 580, 490, 0x000000, 1).setOrigin(0, 0);
        this.mapbox.setStrokeStyle(1, 0xa3a352, 1);

        this.map = scene.add
            .dynamicBitmapText(BASEX + 270, BASEY + 80, FONT.ASCII_18, "...", 18)
            .setOrigin(0, 0)
            .setTint(0xa3a352)
            .setLetterSpacing(-1);

        this.closeBtn = new LMButtonText(
            this.scene,
            "X",
            new Phaser.Math.Vector2(50, 50),
            new Phaser.Math.Vector2(BASEX + 780, BASEY + 10),
            this.Close.bind(this),
        );

        this.container.add([
            this.fadeout,
            this.box,
            this.title,
            this.mapbox,
            this.map,
            this.details,
            this.closeBtn.container,
        ]);
        this.container.setPosition(0, 0);

        this.container.setVisible(false);
        this.container.setActive(false);
    }

    public Show() {
        this.title.text = gameStore.activeMapMeta.name;

        this.details.text = "Token Id: " + gameStore.activeMapMeta.tokenId + "\n";
        if (gameStore.activeMapMeta.glitch != undefined && gameStore.activeMapMeta.glitch) {
            this.details.text = "Glitch: " + gameStore.activeMapMeta.glitch.glitch + "\n";
        }

        this.details.text += "Challenge: " + Math.round(gameStore.activeMapMeta.challengeRating / 2) + "\n";
        this.details.text += "Biome: " + gameStore.activeMapMeta.biome + "\n";
        this.details.text += "Walls: (not loading)\n"; // + gameStore.activeMapMeta.entrance.material_type + "\n";
        this.details.text += "Line Art:\n" + gameStore.activeMapMeta.lineart + "\n";
        this.details.text += "\n";
        this.details.text += "Known Dwellers: \n";
        //@ts-ignore
        if (gameStore.activeMapMeta.dweller != undefined) {
            //@ts-ignore
            for (let i = 0; i < gameStore.activeMapMeta.dweller.length; i++) {
                //@ts-ignore
                this.details.text += "-" + gameStore.activeMapMeta.dweller[i] + "\n";
            }
        }

        this.details.text += "\n";
        this.details.text += "Known Items: \n";
        if (gameStore.activeMapMeta.items != undefined) {
            for (let i = 0; i < gameStore.activeMapMeta.items.length; i++) {
                this.details.text += "-" + gameStore.activeMapMeta.items[i] + "\n";
            }
        }
        this.details.text += "\n";
        if (gameStore.activeMapMeta.traps != undefined && gameStore.activeMapMeta.traps.length > 0) {
            this.details.text += "Known Traps: \n";
            for (let i = 0; i < gameStore.activeMapMeta.traps.length; i++) {
                this.details.text += "-" + gameStore.activeMapMeta.traps[i] + "\n";
            }
        }

        let maptext: string = "";

        for (let y = 0; y < this.gameScene.map.tiles.length; y++) {
            for (let x = 0; x < this.gameScene.map.tiles[y].length; x++) {

                maptext += this.gameScene.map.tiles[y][x].ascii;
            }
            maptext += "\n";
        }
        this.map.text = maptext;

        InputManager.instance.setActiveController(this);

        this.container.setVisible(true);
        this.container.setActive(true);
    }

    public Close() {
        InputManager.instance.setActiveController(this.ui);
        this.container.setVisible(false);
        this.container.setActive(false);
    }

    keyPressed(keyCode: number): void {}

    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {}

    pointerMove(x: number, y: number) {}

    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Phaser.Geom.Point, swipeEnd: Phaser.Geom.Point): void {}

    touch(point: Phaser.Geom.Point) {}

    escapePressed(): void {
        this.Close();
    }

    optionPressed(opt: number): void {}
    confirmPressed(): void {}
}
