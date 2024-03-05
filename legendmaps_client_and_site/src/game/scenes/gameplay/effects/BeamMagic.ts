import { Scene } from "phaser";
import GlobalConst from "../../../types/globalConst";
import FrictionParticle from "./FrictionParticle";
import { PHASER_DEPTH } from "../../../types/localConst";
import MapEffect from "./MapEffect";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";
import { GameMap } from "../map/GameMap";
import TimeUtil from "../../../util/timeUtil";
import EffectUtil from "./EffectUtil";

export default class BeamMagic extends MapEffect {
    private guideSprite: Phaser.GameObjects.Image;
    public travelTime: number = 0;
    private tiles: GameMapTile[];
    override Init(gameScene: GameScene, startTile: GameMapTile): BeamMagic {
        this.layerAboveEntity = true;
        super.Init(gameScene, startTile);
        return this;
    }

    SetTiles(targetTiles: GameMapTile[]): number {
        this.tiles = targetTiles;
        this.targetTile = this.tiles[this.tiles.length - 1];
        this.targetPos = this.targetTile.getPixelPosInMap(this.gameScene);

        let dist = new Phaser.Math.Vector2(this.targetPos.x, this.targetPos.y).distance(
            new Phaser.Math.Vector2(this.startPos.x, this.startPos.y),
        );
        this.travelTime = dist * 1;
        return this.travelTime * 1.5;
    }

    Play(direct: GlobalConst.MOVE_DIR, damageType: GlobalConst.DAMAGE_TYPES) {
        let angleStart = this.GetAngleFromDirection(direct);

        let txtr: string = EffectUtil.GetParticle(damageType);
        let tint = EffectUtil.GetTint(damageType);
        let radius = 0;
        let scale: any = { min: 1, max: 1 };
        let alphr = { start: 1, end: 0.7 };
        let speedr = 0;
        let qty = 2;
        let blend = Phaser.BlendModes.OVERLAY;

        let em1 = this.AddParticleSystem(
            {
                tint: tint,
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, radius) },
                blendMode: blend,
                rotate: 0,
            },
            txtr,
        );

        em1.setSpeed(speedr);
        em1.setAlpha(alphr);
        em1.setScale(scale);
        em1.setLifespan(this.travelTime * 2.5);

        em1.setQuantity(qty);

        this.guideSprite = this.gameScene.add.image(0, 0, "px_round_12");
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
                    source: new Phaser.Geom.Circle(this.guideSprite.x, this.guideSprite.y, radius),
                });
                //  particles.setPosition(this.guideSprite.x, this.guideSprite.y);
            },
        });

        this.CallEnd(this.travelTime * 3);
    }

    override End() {
        this.guideSprite.destroy();
        super.End();
    }
}
