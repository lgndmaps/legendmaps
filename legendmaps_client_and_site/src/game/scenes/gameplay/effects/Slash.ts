import { Scene } from "phaser";
import GlobalConst from "../../../types/globalConst";

export default class Slash {
    c: Phaser.GameObjects.Container;

    p1: Phaser.GameObjects.Particles.ParticleEmitterManager;
    p2: Phaser.GameObjects.Particles.ParticleEmitterManager;

    scene: Phaser.Scene;

    Play(scene: Phaser.Scene, pos: Phaser.Math.Vector2, direct: GlobalConst.MOVE_DIR) {
        //console.log("DOING SLASH AT " + pos.x + "," + pos.y + " DIR IS " + direct);
        this.c = scene.add.container(pos.x, pos.y);

        let particles = scene.add.particles("pill2");

        let em1 = particles.createEmitter({
            lifespan: { min: 100, max: 100 },

            alpha: { start: 0.8, end: 0.1 },
            gravityY: 0,
            //rotate: { min: 0, max: 360 },
            quantity: 1,
            emitZone: { type: "random", source: new Phaser.Geom.Circle(0, 0, 0.5) },
            blendMode: Phaser.BlendModes.OVERLAY,
        });
        em1.stop();

        this.c.add(particles);

        let particles2 = scene.add.particles("pill2");
        let em2 = particles2.createEmitter({
            lifespan: { min: 100, max: 150 },

            alpha: { start: 0.1, end: 0 },
            // tint: { min: 0x333333, max: 0x999999 },
            gravityY: 0,
            //rotate: { min: 0, max: 360 },
            quantity: 3,
            emitZone: { type: "random", source: new Phaser.Geom.Circle(0, 0, 1) },
            blendMode: Phaser.BlendModes.NORMAL,
        });
        em2.stop();
        this.c.add(particles2);

        let curve = new Phaser.Curves.Spline([-30, -55, 0, -70, 30, -55]);

        scene.tweens.add({
            targets: this.c,
            alpha: 1,
            onStart: () => {},
            onUpdate: (tween) => {
                let sc: number = 0.5 - Math.abs(0.5 - tween.progress);

                em2.setPosition(curve.getPoint(tween.progress).x, curve.getPoint(tween.progress).y);
                em2.setScale({ start: sc * 3, end: 0 });
                //em2.setTint(0xffffff33);
                //em2.setTint(GFXUtil.RGBToHex(150 + 150 * sc, 150 + 150 * sc, 180 + 150 * sc));
                em2.emitParticle();

                em1.setPosition(curve.getPoint(tween.progress).x, curve.getPoint(tween.progress).y - 5);

                em1.setScale({ start: sc * 2, end: 0 });
                // em1.setTint(GFXUtil.RGBToHex(150 + 150 * sc, 150 + 150 * sc, 180 + 150 * sc));
                em1.emitParticle(3);
            },
            duration: 100,
            onComplete: () => {
                em1.stop();
            },
            ease: Phaser.Math.Easing.Linear,
        });

        if (direct == GlobalConst.MOVE_DIR.SOUTHEAST) {
            this.c.setRotation(Math.PI * 0.75);
        } else if (direct == GlobalConst.MOVE_DIR.EAST) {
            this.c.setRotation(Math.PI * 0.5);
        } else if (direct == GlobalConst.MOVE_DIR.NORTHEAST) {
            this.c.setRotation(Math.PI * 0.25);
        } else if (direct == GlobalConst.MOVE_DIR.NORTH) {
            this.c.setRotation(0);
        } else if (direct == GlobalConst.MOVE_DIR.NORTHWEST) {
            this.c.setRotation(Math.PI * 1.75);
        } else if (direct == GlobalConst.MOVE_DIR.WEST) {
            this.c.setRotation(Math.PI * 1.5);
        } else if (direct == GlobalConst.MOVE_DIR.SOUTHWEST) {
            this.c.setRotation(Math.PI * 1.25);
        } else if (direct == GlobalConst.MOVE_DIR.SOUTH) {
            this.c.setRotation(Math.PI * 1);
        }
        scene.time.delayedCall(
            150,
            () => {
                this.End();
            },
            [],
            this,
        );
    }

    End() {
        this.c.destroy();
    }
}
