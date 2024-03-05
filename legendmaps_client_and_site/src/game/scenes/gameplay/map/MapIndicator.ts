import Sprite from "phaser3-rex-plugins/plugins/gameobjects/mesh/perspective/sprite/Sprite";
import { GameMap } from "./GameMap";
import { GameMapTile } from "./GameMapTile";
import gameConfig from "../../gameplay/gameConfig.json";

class MapIndicator {
    spr: Phaser.GameObjects.Sprite;
    type: MapIndicator.TYPE;
    map: GameMap;
    tile: GameMapTile;
    timeline: Phaser.Tweens.Timeline;

    constructor(map: GameMap, type: MapIndicator.TYPE, tile: GameMapTile) {
        this.type = type;
        this.map = map;
        this.tile = tile;

        let sprname: string = "";
        if (type == MapIndicator.TYPE.MOVE) {
            sprname += "move_ind_";
        } else if (type == MapIndicator.TYPE.ATTACK) {
            sprname += "atk_ind_";
        } else if (type == MapIndicator.TYPE.INTERACT) {
            sprname += "interact_ind_";
        }
        if (gameConfig.tileSize > 60) {
            sprname += "80.png";
        } else {
            sprname += "60.png";
        }
        this.spr = this.map.scene.add.sprite(0, 0, "uigfx", "" + sprname).setOrigin(0.5, 0.5);
        this.map.tileHolder.add(this.spr);
        if (this.tile.currentGraphic == null) {
            this.destroy();
        } else {
            this.spr.setPosition(this.tile.currentGraphic.x, this.tile.currentGraphic.y);
            // this.spr.setDepth(9999999);

            this.timeline = this.map.scene.tweens.createTimeline({
                loop: -1,
            });
            this.spr.scale = 0.96;
            this.timeline.add({
                targets: this.spr,
                alpha: 0.5,
                duration: 700,
            });
            this.timeline.add({
                targets: this.spr,
                alpha: 1,
                duration: 700,
            });
            this.timeline.play();
        }
    }

    public destroy() {
        if (this.timeline != null) {
            this.timeline.stop();
            this.timeline.destroy();
        }

        if (this.spr != null) {
            this.spr.destroy();
        }
    }
}

namespace MapIndicator {
    export enum TYPE {
        MOVE = 1,
        ATTACK = 2,
        INTERACT = 3,
    }
}

export default MapIndicator;
