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

export default class ProjectileMagic extends MapEffect {
    private guideSprite: Phaser.GameObjects.Image;
    public travelTime: number = 0;

    override Init(gameScene: GameScene, startTile: GameMapTile): ProjectileMagic {
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
        return this.travelTime + 50;
    }

    Play(direct: GlobalConst.MOVE_DIR, damageType: GlobalConst.DAMAGE_TYPES) {
        let angleStart = this.GetAngleFromDirection(direct);

        let txtr: string = EffectUtil.GetParticle(damageType);
        let tint = EffectUtil.GetTint(damageType);
        let radius = 2;
        let scale: any = { min: 0.6, max: 1 };
        let alphr = { start: 0.5, end: 0.1 };
        let speedr = { min: 120, max: 170 };
        let qty = 12;
        let blend = Phaser.BlendModes.OVERLAY;
        if (damageType == GlobalConst.DAMAGE_TYPES.FIRE) {
            radius = 6;
            let scale: any = { min: 0.6, max: 1 };
            let alphr = { start: 0.5, end: 0.1 };
            speedr = { min: 120, max: 170 };
            qty = 7;
            blend = Phaser.BlendModes.SCREEN;
        } else if (damageType == GlobalConst.DAMAGE_TYPES.COLD) {
            radius = 2;
            scale = { min: 1, max: 1 };
            alphr = { start: 1, end: 1 };
            speedr = { min: 80, max: 110 };
            qty = 3;
        } else if (damageType == GlobalConst.DAMAGE_TYPES.ARCANE) {
            radius = 0;
            scale = { start: 2, end: 0.5 };
            alphr = { start: 1, end: 0 };
            speedr = { min: 10, max: 20 };
            qty = 1;
            blend = Phaser.BlendModes.SCREEN;
        }

        let em1 = this.AddParticleSystem(
            {
                tint: tint,
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, radius) },
                blendMode: blend,
                rotate: { min: 0, max: 360 },
            },
            txtr,
        );

        em1.setSpeed(speedr);
        em1.setAlpha(alphr);
        em1.setScale(scale);
        em1.setLifespan({ min: 25, max: 110 });

        em1.setQuantity(qty);

        this.guideSprite = this.gameScene.add.image(0, 0, "px_star_10");
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

        this.CallEnd(this.travelTime);
    }

    override End() {
        this.guideSprite.destroy();
        super.End();
    }
}
