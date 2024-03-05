import { GameScene } from "../GameScene";
import GlobalConst from "../../../types/globalConst";
import TimeUtil from "../../../util/timeUtil";
import MathUtil from "../../../util/mathUtil";

export default class AudioManager {
    private music;
    private sfx;
    private base_sfxVolume = 1;
    private _sfxVolume: number = 1;
    public base_musicVolume = 0.2;
    public _isMuted: boolean = false;
    private _musicVolume: number = this.base_musicVolume;

    private static _instance: AudioManager;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    AudioManager() {
        this.sfx = new Array();
    }

    public set isMuted(muted: boolean) {
        if (muted == true) {
            this._sfxVolume = 0;
            this.muteMusic();
        } else {
            this._sfxVolume = this.base_sfxVolume;
            this.unmuteMusic();
        }
        this._isMuted = muted;
    }

    public get isMuted(): boolean {
        return this._isMuted;
    }
    /**
     * Check if a given audio file is currently playing
     * @param scene
     * @param key
     * @param spritesheet
     */
    isPlaying(scene: Phaser.Scene, key: string, spritesheet?: string): boolean {
        if (spritesheet) {
            //@ts-ignore
            for (var i = scene.game.sound.sounds.length - 1; i >= 0; i--) {
                //@ts-ignore
                var sound = scene.game.sound.sounds[i];

                if (sound.key === spritesheet && sound.currentMarker.name == "key") {
                    return true;
                }
            }
        } else {
            //@ts-ignore
            for (var i = scene.game.sound.sounds.length - 1; i >= 0; i--) {
                //@ts-ignore
                var sound = scene.game.sound.sounds[i];

                if (sound.key === key) {
                    return true;
                }
            }
        }
        return false;
    }

    getSound(scene: Phaser.Scene, key: string, spritesheet?: string) {
        if (spritesheet) {
            //@ts-ignore
            for (var i = scene.game.sound.sounds.length - 1; i >= 0; i--) {
                //@ts-ignore
                var sound = scene.game.sound.sounds[i];

                if (sound.key === spritesheet && sound.currentMarker.name == "key") {
                    return sound;
                }
            }
        } else {
            //@ts-ignore
            for (var i = scene.game.sound.sounds.length - 1; i >= 0; i--) {
                //@ts-ignore
                var sound = scene.game.sound.sounds[i];

                if (sound.key === key) {
                    return sound;
                }
            }
        }
        return false;
    }

    playAudio(
        scene: Phaser.Scene,
        key: string,
        spritesheet: string = "sfx",
        volume: number = this._sfxVolume,
        isMusic: boolean = false,
        fadeDuration: number = 1,
    ) {
        if (scene.game.cache.audio.entries.entries[key] == undefined) {
            // console.log("SOUND NOT FOUND: " + key);
        }
        if (spritesheet && scene.game && scene.game.cache.json.entries.entries[spritesheet]) {
            if (scene.game.cache.json.entries.entries[spritesheet].spritemap[key]) {
                scene.sound.playAudioSprite(spritesheet, key, { volume: this._sfxVolume * volume });
            }
        } else if (scene.game) {
            if (scene.game.cache.audio.entries.entries[key]) {
                var playSound: boolean = true;
                var soundConfig = { loop: false, volume: volume * this._musicVolume };
                if (isMusic) {
                    soundConfig = { loop: true, volume: volume * this._musicVolume };
                    if (this.isPlaying(scene, key)) {
                        playSound = false;
                    }
                }
                if (playSound) {
                    var sound: Phaser.Sound.BaseSound = scene.game.sound.add(key, soundConfig);
                    if (isMusic) {
                        this.music = sound;
                        if (fadeDuration) {
                            if (this.music) {
                                //@ts-ignore
                                this.music.setVolume(this.base_musicVolume);

                                /*

                                if (volume > 0) {
                                    scene.tweens.add({
                                        targets: this.music,
                                        volume: this._musicVolume,

                                        ease: "Linear",
                                        duration: fadeDuration,
                                    });
                                }
                                */
                            }
                        }
                    }
                    sound.play();
                }
            }
        }
    }

    stopAudio(scene: Phaser.Scene, key: string, spritesheet?: string, fadeDuration: number = 1) {
        var sound = this.getSound(scene, key, spritesheet);
        if (sound) {
            if (fadeDuration) {
                scene.tweens.add({
                    targets: sound,
                    volume: 0,

                    ease: "Linear",
                    duration: fadeDuration,
                    onComplete: () => {
                        scene.sound.removeByKey(key);
                    },
                });
            } else {
                scene.sound.removeByKey(key);
            }
        }
    }

    public muteMusic() {
        this.musicVolume = 0;
    }

    public unmuteMusic() {
        this.musicVolume = this.base_musicVolume;
    }

    public get isMusicMuted(): boolean {
        return this._musicVolume > 0 ? false : true;
    }

    set sfxVolume(volume: number) {
        this._sfxVolume = volume;
    }

    set musicVolume(volume: number) {
        this._musicVolume = volume;
        if (this.music) {
            this.music.setVolume(this._musicVolume);
        }
    }

    get sfxVolume(): number {
        return this._sfxVolume;
    }

    get musicVolume(): number {
        return this._musicVolume;
    }

    //BEGING SPECIFIC SOUND SET UPS

    async PlayGameSound(gameScene: GameScene, soundName: string, delay: number = 0, appendRandomRange: number = 0) {
        if (appendRandomRange > 1) {
            let r: number = Math.floor(Math.random() * appendRandomRange) + 1;
            soundName += "_" + r;
        }

        if (delay > 0) {
            await TimeUtil.sleep(delay);
        }

        this.playAudio(gameScene, soundName, "sfx");
    }
}
