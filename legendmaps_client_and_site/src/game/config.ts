import Phaser from "phaser";
import { HomeScene } from "./scenes/home/HomeScene";
import { Handler } from "./scenes/global/Handler";
import { Preload } from "./scenes/global/Preload";
import { GameScene } from "./scenes/gameplay/GameScene";
import { ParticleEditor } from "./scenes/devtools/ParticleEditor";

const SIZE_WIDTH_SCREEN = 1260;
const SIZE_HEIGHT_SCREEN = 760;
let zoomLevel = 1;

if (window.innerWidth < SIZE_WIDTH_SCREEN && window.innerHeight < SIZE_WIDTH_SCREEN) {
    //This is a pretty crude approach to sizing down for low rez
    zoomLevel = 0.5;
}
export const gameSizing = {
    width: SIZE_WIDTH_SCREEN,
    height: SIZE_HEIGHT_SCREEN,
};

export const DEBUG_MODE = false;
export const LOGGING_ENABLED = true;
export default {
    backgroundColor: 0x000000,
    title: "Legend Maps",
    url: "https://legendmaps.io",
    version: "0.0.1",
    type: Phaser.WEBGL, //WEBGL preferred, CANVAS fallback

    scene: [Handler, Preload, HomeScene, GameScene, ParticleEditor],

    render: {
        antialias: true,
        roundPixels: true,
        //pixelArt: true //not strictly needed as it just sets antiAlias and roundPixels, just being thorough
        //batchSize
    },
    scale: {
        mode: Phaser.Scale.NONE, //REMOVED FIT
        parent: "game",
        width: SIZE_WIDTH_SCREEN,
        height: SIZE_HEIGHT_SCREEN,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        zoom: zoomLevel,
    },
    dom: {
        createContainer: true,
    },
    plugins: {
        global: [],
        /*  DISABLED THESE, NOT SURE NEEDED ANYMORE
            global: [
                {
                    key: "WebFontLoader",
                    plugin: WebFontLoaderPlugin,
                    start: true,
                },
                {
                    key: "rexTextTyping",
                    plugin: TextTypingPlugin,
                    start: true,
                },
    
            ],
            scene: [
                {
                    key: 'rexUI',
                    plugin: UIPlugin,
                    mapping: 'rexUI'
                },
            ],
            */
    },
};
