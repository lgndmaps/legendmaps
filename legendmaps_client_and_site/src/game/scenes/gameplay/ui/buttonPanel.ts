import LMUIElement from "./uielements/LMUIElement";
import {LMButtonImage} from "./uielements/LMButtonImage";
import {GameUI} from "./gameUI";
import {LMScene} from "../../LMScene";
import AudioManager from "../sound/audioManager";
import InputManager from "../InputManager";
import Vector2 = Phaser.Math.Vector2;

export default class ButtonPanel extends LMUIElement {
    static POS_X_BASE: number = 1255;
    static POS_Y_BASE: number = 44;

    private ui: GameUI;

    log: LMButtonImage;
    map: LMButtonImage;
    sound: LMButtonImage;
    bug: LMButtonImage;

    constructor(scene: LMScene, gameUI: GameUI) {
        super(scene);
        this.ui = gameUI;
        this.ui.alignGrid.placeAtIndex(442, this.container, -8, -6); //bottom left corner

        this.log = new LMButtonImage(
            this.scene,
            "uigfx",
            "event_log.png",
            new Vector2(32, 32),
            new Vector2(0, 0),
            this.openEventLog.bind(this),
            "game log",
        );
        this.map = new LMButtonImage(
            this.scene,
            "uigfx",
            "map.png",
            new Vector2(32, 32),
            new Vector2(44, 0),
            this.openMap.bind(this),
            "game map",
        );
        this.sound = new LMButtonImage(
            this.scene,
            "uigfx",
            "sound_on.png",
            new Vector2(32, 32),
            new Vector2(88, 0),
            this.toggleSound.bind(this),
            "un/mute",
        );

        this.bug = new LMButtonImage(
            this.scene,
            "uigfx",
            "music_on.png",
            new Vector2(32, 32),
            new Vector2(132, 0),
            this.toggleMusic.bind(this),
            "music toggle",
        );

        this.container.add([this.map.container, this.sound.container, this.bug.container, this.log.container]);
    }

    openEventLog() {
        if (!InputManager.instance.allowInput()) return;
        if (InputManager.instance.activeController != this.ui) return;
        this.ui.OpenLog();
    }

    openMap() {
        if (!InputManager.instance.allowInput()) return;
        if (InputManager.instance.activeController != this.ui) return;
        this.ui.mapInfo.Show();
    }

    toggleSound(force: boolean = undefined) {
        if (force != undefined) {
            AudioManager.instance.isMuted = !force;
        }
        if (AudioManager.instance.isMuted) {
            AudioManager.instance.isMuted = false;

            this.sound.image.setTexture("uigfx", "sound_on.png");
        } else {
            AudioManager.instance.isMuted = true;
            this.sound.image.setTexture("uigfx", "sound_muted.png");
        }
    }

    toggleMusic(force: boolean = undefined) {
        if (force != undefined) {
            if (force) {
                AudioManager.instance.unmuteMusic();
            } else {
                AudioManager.instance.muteMusic();
            }
        }
        if (AudioManager.instance.isMusicMuted) {
            AudioManager.instance.unmuteMusic();
            this.bug.image.setTexture("uigfx", "music_on.png");
        } else {
            AudioManager.instance.muteMusic();
            this.bug.image.setTexture("uigfx", "music_muted.png");
        }
    }
}
