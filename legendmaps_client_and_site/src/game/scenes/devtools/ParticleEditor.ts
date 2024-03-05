import { LMScene } from "../LMScene";
import * as dat from "dat.gui";
import { destroy } from "mobx-state-tree";

const blendModes = {
    NORMAL: Phaser.BlendModes.NORMAL,
    ADD: Phaser.BlendModes.ADD,
    MULTIPLY: Phaser.BlendModes.MULTIPLY,
    SCREEN: Phaser.BlendModes.SCREEN,
};

const particleOptions = {
    MOTE: "px_mote",
    FOURPT_10: "px_4point_10",
    DIAMOND_15: "px_diamond_15",
    ROUND_12: "px_round_12",
    SQUARE_10: "px_square_10",
    STAR_10: "px_star_10",
    X4: "px_x_4",
    BASIC: "spark0",
    BASIC_ALT: "spark1",
};
export class ParticleEditor extends LMScene {
    constructor() {
        super("ParticleEditor");
    }
    private particleCount: number = 0;
    private emitterPositions: { x: number; y: number } = { x: 0, y: 0 };
    private gui: any;
    private particleGUIS: any[] = [];
    private particleEffects: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    private move: boolean = false;
    private countText: Phaser.GameObjects.Text | null = null;

    private angleConfig = {
        min: 0,
        max: 360,
    };

    private speedConfig = {
        min: 0,
        max: 200,
    };

    private scaleConfig = {
        start: 1,
        end: 0,
        ease: "Linear",
    };

    private alphaConfig = {
        start: 1,
        end: 0,
        ease: "Linear",
    };

    private eases = [
        "Linear",
        "Quad.easeIn",
        "Cubic.easeIn",
        "Quart.easeIn",
        "Quint.easeIn",
        "Sine.easeIn",
        "Expo.easeIn",
        "Circ.easeIn",
        "Back.easeIn",
        "Bounce.easeIn",
        "Quad.easeOut",
        "Cubic.easeOut",
        "Quart.easeOut",
        "Quint.easeOut",
        "Sine.easeOut",
        "Expo.easeOut",
        "Circ.easeOut",
        "Back.easeOut",
        "Bounce.easeOut",
        "Quad.easeInOut",
        "Cubic.easeInOut",
        "Quart.easeInOut",
        "Quint.easeInOut",
        "Sine.easeInOut",
        "Expo.easeInOut",
        "Circ.easeInOut",
        "Back.easeInOut",
        "Bounce.easeInOut",
    ].sort();

    preload() {
        for (const particle in particleOptions) {
            this.load.image(particleOptions[particle], `/gamegfx/${particleOptions[particle]}.png`);
        }
    }

    create() {
        this.addParticle();
        this.input.on("pointermove", (pointer) => {
            if (this.move) {
                this.emitterPositions = { x: pointer.x, y: pointer.y };
                for (const effect of this.particleEffects) {
                    effect.setPosition(this.emitterPositions.x, this.emitterPositions.y);
                }
            }
        });

        this.input.on("pointerdown", (pointer) => {
            this.emitterPositions = { x: pointer.x, y: pointer.y };
            for (const effect of this.particleEffects) {
                effect.setPosition(this.emitterPositions.x, this.emitterPositions.y);
            }
            this.move = true;
        });
        this.input.on("pointerup", (pointer) => {
            this.move = false;
        });

        this.countText = this.add.text(0, 0, "Alive Particles");
    }

    update() {
        if (!this.countText) {
            return;
        }

        let particleCount = 0;
        for (const effect of this.particleEffects) {
            particleCount += effect.getAliveParticleCount();
        }
        this.countText.setText("Alive Particles: " + particleCount);
    }

    saveEmitter() {
        const outputJson = {};
        let fileName = "";
        for (let i = 0; i < this.particleEffects.length; i++) {
            const effect = this.particleEffects[i];
            console.log(effect);
            outputJson[`${effect.name}-${i}`] = effect.toJSON();
            fileName += effect.name;
        }
        this.load.saveJSON(outputJson, fileName + ".json");
    }

    addParticle() {
        let particles = this.add.particles(particleOptions.BASIC);
        let newEmitter = particles.createEmitter({
            name: particleOptions.BASIC,
            x: this.emitterPositions.x || 400,
            y: this.emitterPositions.y || 300,
            gravityY: 300,
            speed: this.speedConfig,
            angle: this.angleConfig,
            scale: this.scaleConfig,
            alpha: this.alphaConfig,
            blendMode: "SCREEN",
        });

        let index = this.particleEffects.length;

        this.particleEffects.push(newEmitter);

        const gui = new dat.GUI();
        gui.add(this.particleEffects[index], "name").onChange((val) => {
            this.particleEffects[index].name = val;
        });
        gui.add(this.particleEffects[index], "on").onChange((val) => {
            this.particleEffects[index].on = val;
        });
        gui.add(newEmitter, "texture", particleOptions)
            .name("particle options")
            .onChange((val) => {
                const newParticles = this.add.particles(val);
                const updatedEmitter = newParticles.createEmitter({
                    name: val,
                    x: this.emitterPositions.x || newEmitter.x.propertyValue,
                    y: this.emitterPositions.y || newEmitter.y.propertyValue,
                    lifespan: newEmitter.lifespan.propertyValue,
                    gravityX: newEmitter.gravityX,
                    gravityY: newEmitter.gravityY,
                    speed: newEmitter.speedX.propertyValue,
                    angle: newEmitter.angle.propertyValue,
                    scale: newEmitter.scaleX.propertyValue,
                    alpha: newEmitter.alpha.propertyValue,
                    blendMode: newEmitter.blendMode,
                });
                this.add.particles(particleOptions.BASIC);
                newEmitter.on = false;
                particles.destroy();
                this.particleEffects[index] = updatedEmitter;
                newEmitter = updatedEmitter;
                particles = newParticles;
            });
        gui.add(newEmitter, "blendMode", blendModes)
            .name("blend mode")
            .onChange((val) => {
                console.log(this.particleEffects);
                newEmitter.setBlendMode(Number(val));
            });
        gui.add(this.angleConfig, "min", 0, 360, 5)
            .name("angle min")
            .onChange(() => {
                newEmitter.setAngle(this.angleConfig);
            });
        gui.add(this.angleConfig, "max", 0, 360, 5)
            .name("angle max")
            .onChange(() => {
                newEmitter.setAngle(this.angleConfig);
            });
        gui.add({ life: 1000 }, "life", 100, 5000, 100).onChange((value) => {
            newEmitter.setLifespan(value);
        });
        gui.add({ gravityX: 0 }, "gravityX", -300, 300, 10).onChange((value) => {
            newEmitter.setGravityX(value);
        });
        gui.add({ gravityY: 300 }, "gravityY", -300, 300, 10).onChange((value) => {
            newEmitter.setGravityY(value);
        });
        gui.add(this.speedConfig, "min", 0, 600, 10)
            .name("speed min")
            .onChange(() => {
                newEmitter.setSpeed(this.speedConfig);
            });
        gui.add(this.speedConfig, "max", 0, 600, 10)
            .name("speed max")
            .onChange(() => {
                newEmitter.setSpeed(this.speedConfig);
            });
        gui.add(this.scaleConfig, "start", 0, 1, 0.1)
            .name("scale start")
            .onChange(() => {
                newEmitter.setScale(this.scaleConfig);
            });
        gui.add(this.scaleConfig, "end", 0, 1, 0.1)
            .name("scale end")
            .onChange(() => {
                newEmitter.setScale(this.scaleConfig);
            });
        gui.add(this.scaleConfig, "ease", this.eases)
            .name("scale ease")
            .onChange(() => {
                newEmitter.setScale(this.scaleConfig);
            });
        gui.add(this.alphaConfig, "start", 0, 1, 0.1)
            .name("alpha start")
            .onChange(() => {
                newEmitter.setAlpha(this.alphaConfig);
            });
        gui.add(this.alphaConfig, "end", 0, 1, 0.1)
            .name("alpha end")
            .onChange(() => {
                newEmitter.setAlpha(this.alphaConfig);
            });
        gui.add(this.alphaConfig, "ease", this.eases)
            .name("alpha ease")
            .onChange(() => {
                newEmitter.setAlpha(this.alphaConfig);
            });
        gui.add(newEmitter, "killAll");
        gui.add(newEmitter, "pause");
        gui.add(newEmitter, "resume");
        if (this.particleGUIS.length === 0) {
            gui.add({ add: this.addParticle.bind(this) }, "add").name("Add Particle");
            gui.add({ save: this.saveEmitter.bind(this) }, "save").name("save JSON");
        }

        this.particleGUIS.push(gui);
    }
}
