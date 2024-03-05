import { Scene } from "phaser";
import GlobalConst from "../../../types/globalConst";
import FrictionParticle from "./FrictionParticle";
import { PHASER_DEPTH } from "../../../types/localConst";
import MapEffect from "./MapEffect";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";

export default class MissPuff extends MapEffect {
    override Init(gameScene: GameScene, startTile: GameMapTile): MissPuff {
        this.layerAboveEntity = true;
        super.Init(gameScene, startTile);
        return this;
    }

    async Play(direct: GlobalConst.MOVE_DIR) {
        let em1 = this.AddParticleSystem(
            {
                tint: 0x999999,
                gravityY: 0,
                emitZone: { type: "random", source: new Phaser.Geom.Circle(this.startPos.x, this.startPos.y, 11) },
                blendMode: Phaser.BlendModes.NORMAL,
                rotate: { min: 0, max: 360 },
                //@ts-ignore
                // particleClass: FrictionParticle,
            },
            "px_round_12",
        );

        let angleStart = this.GetAngleFromDirection(direct);

        em1.setSpeed({ min: 10, max: 20 });
        em1.setAlpha({ start: 0.5, end: 0.0 });
        em1.setScale({ start: 2, end: 3 });
        em1.setAngle({ min: angleStart - 30, max: angleStart + 95 });
        em1.setLifespan({ min: 300, max: 350 });
        em1.explode(8, 0, 0);

        this.CallEnd(800);
    }
}
