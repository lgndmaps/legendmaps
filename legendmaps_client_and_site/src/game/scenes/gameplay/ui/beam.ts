import { GameScene } from "../GameScene";
import gameConfig from "../../gameplay/gameConfig.json";
import {FONT, PHASER_DEPTH} from "../../../types/localConst";
import {MapPosD} from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";

export class Beam extends Phaser.GameObjects.Container {
    public gameScene: GameScene;
    private tiles: MapPosD[];
    private graphics;
    private color;
    constructor(
        scene: GameScene,
        tiles: MapPosD[],
        color: number = 0xffffffff,
        depth: number = PHASER_DEPTH.ABOVE_ALL,
    ) {
        super(scene);
        this.tiles = tiles;
        this.color = color;
        this.gameScene = scene;
        this.scene.children.add(this);
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(8, this.color);
        this.graphics.setDepth(depth);
        this.add(this.graphics);
        this.BeamSteps();
    }

    async BeamSteps() {
        let curtile = 0;
        this.graphics.beginPath();

        let startpos: Phaser.Math.Vector2 = this.gameScene.map.GetTileScreenPosition(this.gameScene.map.GetTile(this.tiles[0].x, this.tiles[0].y));
        let endpos: Phaser.Math.Vector2 = this.gameScene.map.GetTileScreenPosition(this.gameScene.map.GetTile(this.tiles[this.tiles.length-1].x, this.tiles[this.tiles.length-1].y));
        let x1 = startpos.x-30;
        let y1 = startpos.y-30;
        let x2 = endpos.x-30;
        let y2 = endpos.y-30;

        let dirVec: Phaser.Math.Vector2 = new Phaser.Math.Vector2(x2-x1, y2-y1);
        let finalLength: number = dirVec.length();
        let normVec = dirVec.normalize();
        let length:number = 1;
        while (length < finalLength) {
            length += 20;
            if (length > finalLength) {
                length = finalLength;
            }
            this.graphics.clear();
            this.graphics.lineStyle(8, this.color);

            this.graphics.lineBetween(x1, y1, x1 +normVec.x * length, y1 +normVec.y * length);

            await TimeUtil.sleep(15);
        }

        this.gameScene.tweens.add({
            targets: [this, this.graphics],
            alpha: 0,
            delay: 350,
            duration: 100,
            onComplete: ()=> {
                this.graphics.destroy();
                this.graphics = null;
            }

        })


    }
}
