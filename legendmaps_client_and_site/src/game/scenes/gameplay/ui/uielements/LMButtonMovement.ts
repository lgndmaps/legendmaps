import GlobalConst from "../../../../types/globalConst";
import CommandManager from "../../CommandManager";
import { GameScene } from "../../GameScene";
import InputManager from "../../InputManager";
import LMUIElement from "./LMUIElement";

export class LMButtonMovement extends LMUIElement {
    private width: number;
    private height: number;
    private size: Phaser.Math.Vector2;
    private image: Phaser.GameObjects.Image;
    private gameScene: GameScene;
    private dir: GlobalConst.MOVE_DIR;

    constructor(
        gameScene: GameScene,
        dir: GlobalConst.MOVE_DIR,
        baseImage: string,
        rotation: number,
        pos: Phaser.Math.Vector2,
    ) {
        super(gameScene);
        this.dir = dir;

        this.image = this.gameScene.add.image(0, 0, "uigfx", baseImage).setOrigin(0.5);
        this.image.setInteractive({ cursor: "pointer" });
        this.image.on("pointerup", this.handleClick, this);

        this._container.add(this.image);
        this._container.setRotation(rotation);

        this.setPosition(pos.x, pos.y);
    }

    private handleClick() {
        if (this.enabled) {
            InputManager.instance.MoveButtonPressedButton(this.dir);
        }
    }
}
