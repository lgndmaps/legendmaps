import { Scene } from "phaser";
import GlobalConst from "../../../types/globalConst";
import FrictionParticle from "./FrictionParticle";
import { PHASER_DEPTH } from "../../../types/localConst";
import MapEffect from "./MapEffect";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";
import { GameMap } from "../map/GameMap";
import TimeUtil from "../../../util/timeUtil";

export default class ProjectileArrow extends MapEffect {
    private guideSprite: Phaser.GameObjects.Image;
    public travelTime: number = 0;

    override Init(gameScene: GameScene, startTile: GameMapTile): ProjectileArrow {
        this.layerAboveEntity = true;
        super.Init(gameScene, startTile);
        return this;
    }

    SetTarget(targetTile: GameMapTile): number {
        this.targetTile = targetTile;
        this.targetPos = targetTile.getPixelPosInMap(this.gameScene);

        let dist = new Phaser.Math.Vector2(this.targetPos.x, this.targetPos.y).distance(
            new Phaser.Math.Vector2(this.startPos.x, this.startPos.y),
        );
        this.travelTime = dist * 3;
        return this.travelTime + 100;
    }

    Play(direct: GlobalConst.MOVE_DIR) {
        let angleStart = this.GetAngleFromDirection(direct);

        let em1 = this.AddParticleSystem(
            {
                tint: 0xcccccc,
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 8) },
                blendMode: Phaser.BlendModes.NORMAL,
                rotate: angleStart + 45,
                scale: 1,
                //@ts-ignore
            },
            "px_arrow",
        );

        em1.setAlpha({ start: 0.5, end: 0 });
        em1.setLifespan(100);
        em1.setQuantity(1);

        this.guideSprite = this.gameScene.add.image(0, 0, "px_diamond_15");
        this.particleManagers[0].parentContainer.add(this.guideSprite);
        this.guideSprite.alpha = 0;
        this.guideSprite.setPosition(this.startPos.x, this.startPos.y);

        this.gameScene.tweens.add({
            targets: this.guideSprite,
            duration: this.travelTime,
            x: this.targetPos.x,
            y: this.targetPos.y,
            onUpdate: () => {
                em1.setEmitZone({
                    type: "random",
                    source: new Phaser.Geom.Circle(this.guideSprite.x, this.guideSprite.y, 0),
                });
                //  particles.setPosition(this.guideSprite.x, this.guideSprite.y);
            },
        });

        this.CallEnd(this.travelTime);
    }

    override End() {
        this.guideSprite.destroy();
        super.End();
    }
}
