import { Scene } from "phaser";
import GlobalConst from "../../../types/globalConst";
import FrictionParticle from "./FrictionParticle";
import { PHASER_DEPTH } from "../../../types/localConst";
import { GameScene } from "../GameScene";
import { GameMapTile } from "../map/GameMapTile";

export default class MapEffect {
    public cont: Phaser.GameObjects.Container;

    protected particleManagers: Phaser.GameObjects.Particles.ParticleEmitterManager[];
    protected emitters: Phaser.GameObjects.Particles.ParticleEmitter[];
    protected gameScene: GameScene;
    protected startTile: GameMapTile;
    protected targetTile?: GameMapTile;
    protected targetPos?: Phaser.Math.Vector2;
    protected layerAboveEntity: boolean = true;
    protected parentContainer: Phaser.GameObjects.Container;
    protected startPos: Phaser.Math.Vector2;

    Init(gameScene: GameScene, startTile: GameMapTile): MapEffect {
        this.gameScene = gameScene;
        this.startTile = startTile;
        this.particleManagers = [];
        this.emitters = [];

        this.parentContainer = this.layerAboveEntity
            ? gameScene.map.tileHolderEntity
            : gameScene.map.tileHolderUnderEntity;

        this.cont = this.gameScene.add.container(0, 0);
        this.parentContainer.add(this.cont);
        this.startPos = startTile.getPixelPosInMap(gameScene);
        return this;
    }

    //TODO: Add texture atlas for particles.
    protected AddParticleManager(texture: string): Phaser.GameObjects.Particles.ParticleEmitterManager {
        let pm = this.gameScene.add.particles(texture);
        this.particleManagers.push(pm);
        this.cont.add(pm);
        return pm;
    }

    protected AddParticleEmitter(
        pm: Phaser.GameObjects.Particles.ParticleEmitterManager,
        config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig,
    ): Phaser.GameObjects.Particles.ParticleEmitter {
        let em = pm.createEmitter(config);
        this.emitters.push(em);
        return em;
    }

    protected AddParticleSystem(
        config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig,
        texture: string,
    ): Phaser.GameObjects.Particles.ParticleEmitter {
        let pm = this.AddParticleManager(texture);
        return this.AddParticleEmitter(pm, config);
    }

    protected GetAngleFromDirection(direct: GlobalConst.MOVE_DIR): number {
        if (direct == GlobalConst.MOVE_DIR.SOUTHWEST) {
            return 90;
        } else if (direct == GlobalConst.MOVE_DIR.WEST) {
            return 135;
        } else if (direct == GlobalConst.MOVE_DIR.NORTHWEST) {
            return 180;
        } else if (direct == GlobalConst.MOVE_DIR.NORTH) {
            return 225;
        } else if (direct == GlobalConst.MOVE_DIR.NORTHEAST) {
            return 270;
        } else if (direct == GlobalConst.MOVE_DIR.EAST) {
            return 315;
        } else if (direct == GlobalConst.MOVE_DIR.SOUTHEAST) {
            return 0;
        } else if (direct == GlobalConst.MOVE_DIR.SOUTH) {
            return 45;
        }
    }

    protected CallEnd(delay: number) {
        this.gameScene.time.delayedCall(
            delay,
            () => {
                this.End();
            },
            [],
            this,
        );
    }

    End() {
        for (let m = 0; m < this.emitters.length; m++) {
            this.emitters[m].stop();
            this.emitters[m].active = false;
        }
        for (let m = 0; m < this.particleManagers.length; m++) {
            this.particleManagers[m].destroy();
        }
        this.cont.destroy();
    }
}
