import { Scene } from "phaser";
import GlobalConst from "../../../types/globalConst";
import FrictionParticle from "./FrictionParticle";
import { PHASER_DEPTH } from "../../../types/localConst";
import MapEffect from "./MapEffect";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";
import TimeUtil from "../../../util/timeUtil";

export default class MagicPuff extends MapEffect {
    private delay: number = 0;
    override Init(gameScene: GameScene, startTile: GameMapTile, delayVisualEffect: number = 0): MagicPuff {
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
                tint: [0xa2e4ff, 0x66d2ff, 0xcdf0ff],
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 30) },
                blendMode: Phaser.BlendModes.NORMAL,
                rotate: { min: 0, max: 360 },

                //@ts-ignore
                // particleClass: FrictionParticle,
            },
            "px_round_12",
        );

        em1.setSpeed({ min: 20, max: 80 });

        em1.setAlpha({ start: 0.6, end: 0.0 });
        em1.setScale({ start: 2, end: 4 });
        em1.setAngle({ min: 0, max: 360 });
        em1.setLifespan({ min: 250, max: 1000 });
        em1.explode(25, 0, 0);

        let em2 = this.AddParticleSystem(
            {
                tint: [0x7adeff],
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 31) },
                blendMode: Phaser.BlendModes.SCREEN,
                rotate: { min: 0, max: 360 },
                quantity: 6,

                //@ts-ignore
                // particleClass: FrictionParticle,
            },
            "px_square_10",
        );

        em2.setSpeed(0);
        em2.setScale(0.2);
        em2.setLifespan({ min: 50, max: 100 });

        this.CallEnd(950);
    }
}
