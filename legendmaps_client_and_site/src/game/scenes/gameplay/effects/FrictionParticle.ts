export default class FrictionParticle extends Phaser.GameObjects.Particles.Particle {
    update(delta, step, processors) {
        let result = super.update(delta, step, processors);
        this.velocityX *= 0.96;
        this.velocityY *= 0.96;
        //@ts-ignore

        return result;
    }
}
