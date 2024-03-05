import { Scene } from "phaser";

//TODO: Once this settled,  create generic particle class parent
export default class GoldTrail {
    particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    emitter;
    emitterGlow;
    scene: Phaser.Scene;

    Play(scene: Phaser.Scene, start: Phaser.Math.Vector2, end: Phaser.Math.Vector2, duration: number) {
        this.scene = scene;

        this.particles = scene.add.particles("effects", "particle_coin.png");

        this.emitterGlow = this.particles.createEmitter({
            frame: "star_particle.png",
            lifespan: 340,
            speed: { min: 1, max: 3 },
            angle: { min: 135, max: 45 },
            tint: 0xffffcc,
            gravityY: 500,
            scale: { min: 1, max: 2 },
            rotate: { min: 0, max: 360 },
            quantity: 3,
            alpha: { start: 0.1, end: 0 },
            emitZone: { type: "random", source: new Phaser.Geom.Circle(0, 0, 5) },
            blendMode: Phaser.BlendModes.ADD,
        });

        this.emitter = this.particles.createEmitter({
            frame: "particle_coin.png",
            lifespan: 210,
            speed: { min: 5, max: 15 },
            angle: { min: 135, max: 45 },
            gravityY: 450,
            rotate: { min: 0, max: 360 },
            quantity: 1,
            emitZone: { type: "random", source: new Phaser.Geom.Circle(0, 0, 10) },
            blendMode: Phaser.BlendModes.NORMAL,
        });
        this.emitter.setPosition(start.x, start.y);
        scene.tweens.add({
            targets: [this.emitter, this.emitterGlow],
            duration: duration,
            scale: 1,
            onUpdate: (tween, target, param) => {
                this.emitter.setPosition(
                    start.x + (end.x - start.x) * tween.progress,
                    start.y + (end.y - start.y) * tween.progress,
                );
                this.emitterGlow.setPosition(
                    start.x + (end.x - start.x) * tween.progress,
                    start.y + (end.y - start.y) * tween.progress,
                );
            },
            onComplete: () => {
                this.End();
            },
        });
    }

    End() {
        this.emitter.stop();
        this.emitterGlow.stop();
        //TODO: CLEANUP
        //this.particles.destroy();
    }
}
