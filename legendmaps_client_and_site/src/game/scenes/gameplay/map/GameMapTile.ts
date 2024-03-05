import Phaser from "phaser";
import GlobalConst from "../../../types/globalConst";
import FlagUtil from "../../../util/flagUtil";
import Dweller from "../entities/Dweller";
import { Entity } from "../entities/Entity";
import { StoryEventTrigger } from "../entities/StoryEventTrigger";
import { GameScene } from "../GameScene";
import { Merchant } from "../entities/Merchant";
import { PHASER_DEPTH } from "../../../types/localConst";

/**
 * Map Tile
 */
export class GameMapTile {
    currentGraphic: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image; //Going to see if we can get away with only ever holding 1 sprite here, since only one is ever rendered
    pos: Phaser.Math.Vector2;
    sid: number = -1;
    private baseTileGraphic: string = "";
    private baseIsWalkable: boolean = true;
    isRevealed: boolean = false; //revealed means tile has been exposed from fog of war, but is not necessary actively visible
    isVisible: boolean = false; //means tile is in player's current vision.
    ascii: string = " ";
    updatedThisTurn: boolean = false;
    private contents: Array<Entity> = new Array();

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    getPixelPos(game: GameScene): Phaser.Math.Vector2 {
        let px: number = this.pos.x * 60 + game.map.tileHolder.x + 220; //Math.round((x - this.tileHolder.x) / gameConfig.tileSize) - 4;
        let py: number = this.pos.y * 60 + game.map.tileHolder.y + 0; //Math.round((y - this.tileHolder.y) / gameConfig.tileSize);
        return new Phaser.Math.Vector2(px, py);
    }

    getPixelPosInMap(game: GameScene): Phaser.Math.Vector2 {
        let px: number = this.pos.x * 60; //Math.round((x - this.tileHolder.x) / gameConfig.tileSize) - 4;
        let py: number = this.pos.y * 60; //Math.round((y - this.tileHolder.y) / gameConfig.tileSize);
        return new Phaser.Math.Vector2(px, py);
    }

    get hasMerchant(): boolean {
        if (this.contents.length > 0) {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i] instanceof Merchant) {
                    return true;
                }
            }
        }
        return false;
    }

    get hasStoryEvent(): boolean {
        if (this.contents.length > 0) {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i] instanceof StoryEventTrigger) {
                    return true;
                }
            }
        }
        return false;
    }

    get hasDweller(): boolean {
        if (this.contents.length > 0) {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i] instanceof Dweller) {
                    return true;
                }
            }
        }
        return false;
    }

    GetDweller(): Dweller {
        if (this.contents.length > 0) {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i] instanceof Dweller) {
                    return this.contents[i] as Dweller;
                }
            }
        }
        return;
    }

    ClearDwellers() {
        if (this.contents.length > 0) {
            let newcontents = [];
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i] instanceof Dweller) {
                } else {
                    newcontents.push(this.contents[i]);
                }
            }
            this.contents = newcontents;
        }
    }

    get isWalkable(): boolean {
        return this.baseIsWalkable;
    }

    constructor(x: number, y: number) {
        this.pos = new Phaser.Math.Vector2(x, y);
    }

    UpdateTileInfo(baseName: string, flags: number) {
        if (FlagUtil.IsSet(flags, GlobalConst.TILE_FLAGS.IS_WALKABLE)) {
            this.baseIsWalkable = true;
        } else {
            this.baseIsWalkable = false;
        }
        this.isRevealed = FlagUtil.IsSet(flags, GlobalConst.TILE_FLAGS.IS_REVEALED);
        //this.baseTileGraphic = GlobalConst.SpriteLookup[baseName];
        // console.log("BASE: " + baseName + " " + flags);
        this.baseTileGraphic = baseName + ".png";
        this.updatedThisTurn = true;
        this.isVisible = FlagUtil.IsSet(flags, GlobalConst.TILE_FLAGS.IS_VISIBLE);
    }

    CleanUpAfterDraw() {
        this.updatedThisTurn = false;
        //this.isVisible = false;
    }

    GetDepth(): PHASER_DEPTH.MAP_ENTITY | PHASER_DEPTH.MAP {
        if (this.contents.length > 0) {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.isVisible && this.contents[i] instanceof Dweller && !(this.contents[i] as Dweller).isDead) {
                    return PHASER_DEPTH.MAP_ENTITY;
                }
            }

            if (!(this.contents[this.contents.length - 1] instanceof Dweller)) {
                return PHASER_DEPTH.MAP_ENTITY;
            }
        }
        return PHASER_DEPTH.MAP;
    }

    GetGraphicNameToShow(): string {
        if (this.contents.length > 0) {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.isVisible && this.contents[i] instanceof Dweller && !(this.contents[i] as Dweller).isDead) {
                    return this.contents[i].GetGraphicName();
                }
            }

            if (!(this.contents[this.contents.length - 1] instanceof Dweller)) {
                return this.contents[this.contents.length - 1].GetGraphicName();
            }
        }
        return this.baseTileGraphic;
    }

    GetAtlasNameToShow(): string {
        if (this.contents.length > 0) {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.isVisible && this.contents[i] instanceof Dweller && !(this.contents[i] as Dweller).isDead) {
                    return "dwellers";
                }
            }
        }
        return "maptiles";
    }

    GetGraphicNameCurrent(): string {
        if (this.currentGraphic != null) {
            return this.currentGraphic.name;
        } else {
            return "";
        }
    }

    SetGraphic(newSprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image) {
        if (this.currentGraphic != null) {
            this.currentGraphic.destroy();
        }
        this.currentGraphic = newSprite;
    }

    UpdateFogOfWar() {
        if (this.currentGraphic != null && this.currentGraphic.alpha) {
            this.currentGraphic.alpha = this.isVisible ? 1 : 0.13;
        }
    }

    AddEntity(ent: Entity) {
        if (!this.contents.includes(ent)) {
            this.updatedThisTurn = true;
            this.contents.push(ent);
        }
    }

    RemoveEntity(ent: Entity) {
        if (this.contents.includes(ent)) {
            this.updatedThisTurn = true;
            this.contents = this.contents.filter((obj) => obj !== ent);
        }
    }

    GetCompassHeadingToAnotherTile(targetTile: GameMapTile): GlobalConst.MOVE_DIR {
        let headings: GlobalConst.MOVE_DIR[] = [
            GlobalConst.MOVE_DIR.EAST,
            GlobalConst.MOVE_DIR.SOUTHEAST,
            GlobalConst.MOVE_DIR.SOUTH,
            GlobalConst.MOVE_DIR.SOUTHWEST,
            GlobalConst.MOVE_DIR.WEST,
            GlobalConst.MOVE_DIR.NORTHWEST,
            GlobalConst.MOVE_DIR.NORTH,
            GlobalConst.MOVE_DIR.NORTHEAST,
        ];

        let angle: number = Math.atan2(targetTile.y - this.y, targetTile.x - this.x);
        let octant: number = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;
        /*
        console.log(
            this.pos.x +
                "," +
                this.pos.y +
                " --> " +
                targetTile.pos.x +
                " " +
                targetTile.pos.y +
                " Heading is: " +
                headings[octant],
        );
*/
        return headings[octant];
    }
}
