import Phaser from "phaser";
import { FONT } from "../../types/localConst";
export class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        this.input.topOnly = false;
        this.load.bitmapFont(
            FONT.TITLE_32,
            "/fonts/bitmap/alagard32_outline_0.png",
            "/fonts/bitmap/alagard32_outline.fnt",
        );
        this.load.bitmapFont(FONT.BOLD_24, "/fonts/bitmap/bold_24.png", "/fonts/bitmap/bold_24.fnt");
        this.load.bitmapFont(FONT.TITLE_40, "/fonts/bitmap/title_40.png", "/fonts/bitmap/title_40.fnt");
        this.load.bitmapFont(FONT.ASCII_18, "/fonts/bitmap/ascii18_0.png", "/fonts/bitmap/ascii18.fnt");

        this.load.bitmapFont(FONT.METER_18, "/fonts/bitmap/meter_18.png", "/fonts/bitmap/meter_18.fnt");
        this.load.bitmapFont(FONT.BODY_24, "/fonts/bitmap/nimbus24_0.png", "/fonts/bitmap/nimbus24.fnt");
        this.load.bitmapFont(
            FONT.BODY_24_BLACKOUTLINE,
            "/fonts/bitmap/nimbus24_0_blackout.png",
            "/fonts/bitmap/nimbus24_blackout.fnt",
        );
        this.load.bitmapFont(FONT.BODY_20, "/fonts/bitmap/nimbus20_0.png", "/fonts/bitmap/nimbus20.fnt");
        this.load.bitmapFont(FONT.FLOATER_FILL, "/fonts/bitmap/floater_fill.png", "/fonts/bitmap/floater_fill.fnt");
        this.load.bitmapFont(FONT.FLOATER_OUTLINE, "/fonts/bitmap/floater_out.png", "/fonts/bitmap/floater_out.fnt");
        this.load.bitmapFont(FONT.TITLE_24, "/fonts/bitmap/alagard24_0.png", "/fonts/bitmap/alagard24.fnt");

        this.load.atlas("dwellerp", "/gamegfx/dwellerp.png", "/gamegfx/dwellerp.json");
        this.load.atlas("ui", "/gamegfx/uig.png", "/gamegfx/uig.json");
        this.load.atlas("uigfx", "/gamegfx/uigfx.png", "/gamegfx/uigfx.json");
        this.load.atlas("effects", "/gamegfx/effects.png", "/gamegfx/effects.json");
        this.load.atlas("storyevent", "/gamegfx/storyevent.png", "/gamegfx/storyevent.json");
        this.load.audioSprite("sfx", "/sound/sfx.json", "/sound/sfx.mp3");
        this.load.audio("bgmusic", "/sound/splash.mp3");
        //this.load.atlas("maptiles", "/gamegfx/maptiles.png", "/gamegfx/maptiles.json");
        //qwwwthis.load.atlas("dwellers", "/gamegfx/dwellers.png", "/gamegfx/dwellers.json");
    }

    async create() {
        setTimeout(() => {
            this.scene.launch("HomeScene");
        }, 200);
    }
}
