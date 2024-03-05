import { Scene } from "phaser";
import GlobalConst from "../../../types/globalConst";
import FrictionParticle from "./FrictionParticle";
import { PHASER_DEPTH } from "../../../types/localConst";
import MapEffect from "./MapEffect";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";
import TimeUtil from "../../../util/timeUtil";

export default class HealEffect extends MapEffect {
    private delay: number = 0;
    override Init(gameScene: GameScene, startTile: GameMapTile, delayVisualEffect: number = 0): HealEffect {
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
                tint: [0x00c847],
                gravityY: -5,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 30) },
                blendMode: Phaser.BlendModes.SCREEN,
                rotate: { min: 0, max: 360 },
                quantity: 1,
                frequency: 150,
                //@ts-ignore
                // particleClass: FrictionParticle,
            },
            "px_round_12",
        );

        em1.setSpeed({ min: 5, max: 10 });

        em1.setAlpha({ start: 0.4, end: 0.0 });
        em1.setScale({ start: 0.4, end: 2 });
        em1.setAngle({ min: 0, max: 360 });
        em1.setLifespan({ min: 100, max: 400 });

        let em2 = this.AddParticleSystem(
            {
                tint: [0x00c847],
                gravityY: -400,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 31) },
                blendMode: Phaser.BlendModes.NORMAL,
                quantity: 1,
                frequency: 100,
                //@ts-ignore
                // particleClass: FrictionParticle,
            },
            "px_plus_14",
        );

        em2.setSpeed(0);
        em2.setScale(1);
        em2.setLifespan({ min: 350, max: 600 });

        this.CallEnd(1000);
    }
}
