import GlobalConst from "../../../types/globalConst";
import FrictionParticle from "./FrictionParticle";
import MapEffect from "./MapEffect";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";

export default class BloodSplatter extends MapEffect {
    override Init(gameScene: GameScene, startTile: GameMapTile): BloodSplatter {
        this.layerAboveEntity = false;
        super.Init(gameScene, startTile);
        return this;
    }

    async Play(direct: GlobalConst.MOVE_DIR, intensity: 1 | 2 | 3) {
        let em1 = this.AddParticleSystem(
            {
                tint: 0xff0000,
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 3) },
                blendMode: Phaser.BlendModes.NORMAL,
                rotate: { min: 0, max: 360 },
                quantity: 0,
                alpha: { min: 0.5, max: 1 },
                scale: 1,
                lifespan: { min: 800, max: 1000 },
                speed: { min: 60, max: 290 },
                //@ts-ignore
                particleClass: FrictionParticle,
            },
            "px_splat_30",
        );

        let angleStart = this.GetAngleFromDirection(direct);

        em1.setAngle({ min: angleStart, max: angleStart + 65 });
        let cnt = 2;
        if (intensity == 2) {
            cnt = 4;
        } else if (intensity == 3) {
            cnt = 20;
        }

        em1.explode(cnt, 0, 0);
        this.CallEnd(1500);
    }
}
