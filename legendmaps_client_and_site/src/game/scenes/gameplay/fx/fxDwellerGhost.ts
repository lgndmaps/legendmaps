import Dweller from "../entities/Dweller";
import { GameMapTile } from "../map/GameMapTile";
import { GameScene } from "../GameScene";
import { PHASER_DEPTH } from "../../../types/localConst";

/**
 * Creates a ghost image of a dweller that fades out and destroys itself
 */
export default class FXDwellerGhost {
    private image: Phaser.GameObjects.Image;
    private scene: GameScene;

    constructor(scene: GameScene, dweller: Dweller, tile: GameMapTile) {
        this.scene = scene;
        let pos = scene.map.GetTileHolderPosition(tile);
        this.image = scene.add.image(pos.x, pos.y, "dwellers", dweller.GetGraphicName());
        this.image.setOrigin(0.5, 0.5);

        this.image.setDepth(PHASER_DEPTH.MAP + 1);
        this.image.setAlpha(0.9);
        scene.map.tileHolder.add([this.image]);

        scene.tweens.add({
            targets: [this.image],
            alpha: 0,
            duration: 450,
            onComplete: () => {
                this.image.destroy();
            },
        });
    }
}
