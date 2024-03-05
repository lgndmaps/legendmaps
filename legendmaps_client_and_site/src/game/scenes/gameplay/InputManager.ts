import {GameScene} from "./GameScene";
import {Geom} from "phaser";
import {InputController} from "../../types/frontendTypes";
import GlobalConst from "../../types/globalConst";
import {GameMapTile} from "./map/GameMapTile";

export default class InputManager {
    public awaitingServerUpdate: boolean = false;

    private static _instance: InputManager;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public activeController: InputController;

    keyN: number[] = [
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.W,
        Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT,
    ];
    keyNE: number[] = [Phaser.Input.Keyboard.KeyCodes.E, Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE];
    keyE: number[] = [
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
        Phaser.Input.Keyboard.KeyCodes.D,
        Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
    ];
    keySE: number[] = [Phaser.Input.Keyboard.KeyCodes.C, Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE];
    keyS: number[] = [
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.S,
        Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
    ];
    keySW: number[] = [Phaser.Input.Keyboard.KeyCodes.Z, Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE];
    keyW: number[] = [
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
    ];
    keyNW: number[] = [Phaser.Input.Keyboard.KeyCodes.Q, Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN];
    keyWait: number[] = [
        Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
        Phaser.Input.Keyboard.KeyCodes.X,
        Phaser.Input.Keyboard.KeyCodes.SPACE,
    ];

    keyClose: number[] = [Phaser.Input.Keyboard.KeyCodes.ESC];
    keyoption1: number[] = [Phaser.Input.Keyboard.KeyCodes.ONE];
    keyoption2: number[] = [Phaser.Input.Keyboard.KeyCodes.TWO];
    keyoption3: number[] = [Phaser.Input.Keyboard.KeyCodes.THREE];
    keyoption4: number[] = [Phaser.Input.Keyboard.KeyCodes.FOUR];
    keyoption5: number[] = [Phaser.Input.Keyboard.KeyCodes.FIVE];
    keyConfirm: number[] = [Phaser.Input.Keyboard.KeyCodes.ENTER];

    keyattack: number[] = [Phaser.Input.Keyboard.KeyCodes.F];
    keyAttackCycleRight: number[] = [Phaser.Input.Keyboard.KeyCodes.G, Phaser.Input.Keyboard.KeyCodes.PAGE_UP];
    keyAttackCycleLeft: number[] = [Phaser.Input.Keyboard.KeyCodes.H, Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN];

    keyCharsheet: number[] = [Phaser.Input.Keyboard.KeyCodes.U];
    keyInventory: number[] = [Phaser.Input.Keyboard.KeyCodes.I];
    keyLog: number[] = [Phaser.Input.Keyboard.KeyCodes.L];
    keyMap: number[] = [Phaser.Input.Keyboard.KeyCodes.M];
    keySwap: number[] = [Phaser.Input.Keyboard.KeyCodes.P];

    private swipeStart: Geom.Point | null = null;
    private swipeEnd: Geom.Point;
    private swipeArea: Geom.Rectangle;
    private touchStartTime: number = -1;

    gameScene: GameScene;

    constructor() {
    }

    public Init(gameScene: GameScene) {
        this.gameScene = gameScene;

        //Add any keys here that need their default behavior prevented
        this.gameScene.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.gameScene.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.gameScene.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.gameScene.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.PAGE_UP);
        this.gameScene.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN);

        this.ActivateMoveKeys(this.keyN, GlobalConst.MOVE_DIR.NORTH);
        this.ActivateMoveKeys(this.keyNE, GlobalConst.MOVE_DIR.NORTHEAST);
        this.ActivateMoveKeys(this.keyE, GlobalConst.MOVE_DIR.EAST);
        this.ActivateMoveKeys(this.keySE, GlobalConst.MOVE_DIR.SOUTHEAST);
        this.ActivateMoveKeys(this.keyS, GlobalConst.MOVE_DIR.SOUTH);
        this.ActivateMoveKeys(this.keySW, GlobalConst.MOVE_DIR.SOUTHWEST);
        this.ActivateMoveKeys(this.keyW, GlobalConst.MOVE_DIR.WEST);
        this.ActivateMoveKeys(this.keyNW, GlobalConst.MOVE_DIR.NORTHWEST);

        this.ActivateMapSwipes();

        //MISC KEYS
        this.gameScene.input.keyboard.on("keydown", (event) => {
            if (!this.allowInput()) {
                console.log("Input blocked: Reload needed?");
                return;
            }

            if (InputManager.instance.keyClose.includes(event.keyCode)) {
                console.log("Close key pressed");
                this.activeController.escapePressed();
            } else if (InputManager.instance.keyoption1.includes(event.keyCode)) {
                this.activeController.optionPressed(1);
            } else if (InputManager.instance.keyoption2.includes(event.keyCode)) {
                this.activeController.optionPressed(2);
            } else if (InputManager.instance.keyoption3.includes(event.keyCode)) {
                this.activeController.optionPressed(3);
            } else if (InputManager.instance.keyoption4.includes(event.keyCode)) {
                this.activeController.optionPressed(4);
            } else if (InputManager.instance.keyoption5.includes(event.keyCode)) {
                this.activeController.optionPressed(5);
            } else if (InputManager.instance.keyConfirm.includes(event.keyCode)) {
                console.log("CONFIRM PRESSED!")
                this.activeController.confirmPressed();
            } else {
                this.activeController.keyPressed(event.keyCode);
            }
        });
    }

    public allowInput(fromController?: InputController): boolean {
        if (fromController != undefined && fromController != this.activeController) return false;
        if (this.activeController != undefined && this.activeController.blockInput) return false;
        if (this.awaitingServerUpdate) return false;
        return true;
    }

    public clearActiveController(): void {
        this.activeController = undefined;
    }

    public setActiveController(newController: InputController): void {
        this.activeController = newController;
    }

    private ActivateMoveKeys(ary: number[], dir: GlobalConst.MOVE_DIR) {
        for (let k: number = 0; k < ary.length; k++) {
            this.gameScene.input.keyboard.addKey(ary[k], true);
            this.gameScene.input.keyboard.on("keydown", (event) => {
                if (!this.allowInput()) return;
                if (event.keyCode === ary[k]) {
                    this.activeController.moveKeyPressed(dir);
                }
            });
        }
    }

    private ActivateMapSwipes() {
        this.swipeArea = new Geom.Rectangle(0, 0, 1260, 760);

        this.gameScene.input.on("pointermove", (e) => {
            if (!this.allowInput()) return;

            this.activeController.pointerMove(e.x, e.y);
        });

        this.gameScene.input.on("pointerdown", (e) => {
            // console.log("pointer down " + e.x + "," + e.y);
            let t: GameMapTile = this.gameScene.map.GetTileAtPoint(e.x, e.y);
            if (!this.allowInput()) return;

            if (this.swipeArea.contains(e.x, e.y)) {
                this.swipeStart = new Phaser.Geom.Point(e.x, e.y);
                this.touchStartTime = Date.now();
            } else {
                this.swipeStart = null;
            }
        });

        this.gameScene.input.on("pointerup", (e) => {
            if (!this.allowInput()) return;
            if (this.swipeStart == null) return;

            this.swipeEnd = new Phaser.Geom.Point(e.x, e.y);
            let endTime: number = Date.now();
            let intTime: number = endTime - this.touchStartTime;
            let intVector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
                this.swipeEnd.x - this.swipeStart.x,
                this.swipeEnd.y - this.swipeStart.y,
            );

            let moveDir: GlobalConst.MOVE_DIR | null = null;

            if (intTime > 500) {
                //could make this velocity based, but straight time seems fine.
                //console.log("took too long");
            } else if (intVector.length() < 50) {
                //too short to be a swipe, sending touch to active
                this.activeController.touch(new Geom.Point(e.x, e.y));
            } else {
                let angle: number = Math.atan2(
                    this.swipeEnd.y - this.swipeStart.y,
                    this.swipeEnd.x - this.swipeStart.x,
                );
                angle = 180 + (180 / Math.PI) * angle;
                let pislice: number = 45;
                angle += pislice / 2; //shifting angle by half a pi slice to make checks simpler.
                if (angle > 360) {
                    angle -= 360;
                }
                let angleCheckStart: number = 0;

                if (angle > angleCheckStart && angle < angleCheckStart + pislice) {
                    moveDir = GlobalConst.MOVE_DIR.WEST;
                } else if (angle > angleCheckStart + pislice * 1 && angle <= angleCheckStart + pislice * 2) {
                    moveDir = GlobalConst.MOVE_DIR.NORTHWEST;
                } else if (angle > angleCheckStart + pislice * 2 && angle <= angleCheckStart + pislice * 3) {
                    moveDir = GlobalConst.MOVE_DIR.NORTH;
                } else if (angle > angleCheckStart + pislice * 3 && angle <= angleCheckStart + pislice * 4) {
                    moveDir = GlobalConst.MOVE_DIR.NORTHEAST;
                } else if (angle > angleCheckStart + pislice * 4 && angle <= angleCheckStart + pislice * 5) {
                    moveDir = GlobalConst.MOVE_DIR.EAST;
                } else if (angle > angleCheckStart + pislice * 5 && angle <= angleCheckStart + pislice * 6) {
                    moveDir = GlobalConst.MOVE_DIR.SOUTHEAST;
                } else if (angle > angleCheckStart + pislice * 6 && angle <= angleCheckStart + pislice * 7) {
                    moveDir = GlobalConst.MOVE_DIR.SOUTH;
                } else if (angle > angleCheckStart + pislice * 7 && angle <= angleCheckStart + pislice * 8) {
                    moveDir = GlobalConst.MOVE_DIR.SOUTHWEST;
                }
            }

            if (moveDir != null) {
                this.activeController.swipe(moveDir, this.swipeStart, this.swipeEnd);
            }

            this.swipeStart = null;
        });
    }

    public MoveButtonPressedButton(moveDir: GlobalConst.MOVE_DIR) {
        if (!this.allowInput()) return;

        if (moveDir != null) {
            this.activeController.moveKeyPressed(moveDir);
        }
    }
}
