import GlobalConst from "../../../types/globalConst";
import MapEffect from "./MapEffect";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";
import TimeUtil from "../../../util/timeUtil";
import EffectUtil from "./EffectUtil";

export default class EffectHitGeneric extends MapEffect {
    private delay: number = 0;
    public damageType: GlobalConst.DAMAGE_TYPES;

    override Init(gameScene: GameScene, startTile: GameMapTile, delayVisualEffect: number = 0): EffectHitGeneric {
        this.layerAboveEntity = true;
        this.delay = delayVisualEffect;
        super.Init(gameScene, startTile);
        return this;
    }

    async Play() {
        if (this.delay > 0) {
            await TimeUtil.sleep(this.delay);
        }

        let em1 = this.AddParticleSystem(
            {
                tint: EffectUtil.GetTint(this.damageType),
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 22) },
                blendMode: Phaser.BlendModes.NORMAL,
                rotate: { min: 0, max: 360 },
                quantity: 3,
                frequency: 90,
                //@ts-ignore
                // particleClass: FrictionParticle,
            },
            EffectUtil.GetParticle(this.damageType),
        );

        em1.setSpeed({ min: 10, max: 50 });

        em1.setAlpha({ start: 1, end: 0 });
        em1.setScale({ start: 0.5, end: 3 });
        em1.setAngle({ min: 0, max: 360 });
        em1.setLifespan({ min: 350, max: 650 });
        //em1.explode(7, 0, 0);

        this.CallEnd(600);
    }
}
