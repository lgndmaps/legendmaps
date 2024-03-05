import { GameScene } from "../scenes/gameplay/GameScene";
import { LMScene } from "../scenes/LMScene";

/**
 * Alignment grid Class
 */
class AlignGrid {
    private config: AlignGrid.GridConfig;
    private scene: LMScene;
    private cw: number;
    private ch: number;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(config: AlignGrid.GridConfig) {
        this.config = config;
        if (!config.depth) {
            config.depth = 1000000000;
        }

        this.scene = config.lmscene;

        /** Individual cell width */
        this.cw = config.width / config.cols;

        /** Individual cell height */
        this.ch = config.height / config.rows;
    }

    /**
     * Show the alignment grid in the current scene
     */
    show() {
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(this.config.depth);
        this.graphics.lineStyle(0.5, 0x33ff00).setAlpha(0.3);

        for (var i = 0; i < this.config.width; i += this.cw) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.config.height);
        }

        for (var i = 0; i < this.config.height; i += this.ch) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.config.width, i);
        }

        this.graphics.strokePath();
    }

    /**
     * Places an object at the given x and y coordinates
     * @param {number} xx - X coordinate to place an object at
     * @param {number} yy - Y coordinate to place an object at
     * @param {any} obj - The object to be placed
     */
    placeAt(xx: number, yy: number, obj: any) {
        obj.x = xx;
        obj.y = yy;
    }

    /**
     * Places an object in the center of the block at the given index
     * @param {number} index - Grid index to place an object at
     * @param {any} obj - The object to be placed
     */
    public placeAtIndex(
        index: number,
        obj: any,
        shiftx: number = 0,
        shifty: number = 0,
        parentContainer: Phaser.GameObjects.Container | null = null,
    ) {
        var yy = Math.floor(index / this.config.cols);
        var xx = index - Math.ceil(yy * this.config.cols);

        var x2 = this.cw * xx; // + this.cw / 2;
        var y2 = this.ch * yy; // + this.ch / 2;

        obj.x = x2 + shiftx;
        obj.y = y2 + shifty;
        if (parentContainer != null) {
            obj.x -= parentContainer.x;
            obj.y -= parentContainer.y;
        }
    }

    /**
     * Show the alignment grid with block numbers in the current scene
     */
    showNumbers(): void {
        var count = 0;
        for (var i = 0; i < this.config.rows; i++) {
            for (var j = 0; j < this.config.cols; j++) {
                var numText = this.scene.add.text(0, 0, count + "", { color: "#33ff00", fontSize: "12px" }); //count.toString() //+ "\n" + j + "," + i
                numText.setOrigin(-0.1, -0.1).setAlpha(0.4).setDepth(this.config.depth);
                this.placeAtIndex(count, numText);
                count++;
            }
        }
        // this.show();
    }
}

namespace AlignGrid {
    export type GridConfig = {
        rows: number;
        cols: number;
        width: number;
        height: number;
        depth?: number;
        lmscene: LMScene;
    };
}

export default AlignGrid;
