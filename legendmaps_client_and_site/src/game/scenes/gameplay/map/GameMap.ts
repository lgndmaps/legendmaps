import Phaser from "phaser";
import {M_Map, M_Tile} from "../../../types/globalTypes";
import {GameScene} from "../GameScene";
import {GameMapTile} from "./GameMapTile";
import gameConfig from "../../gameplay/gameConfig.json";
import GlobalConst from "../../../types/globalConst";
import MapIndicator from "./MapIndicator";
import {FONT, PHASER_DEPTH} from "../../../types/localConst";

export class GameMap extends Phaser.GameObjects.Container {
    public tileHolder: Phaser.GameObjects.Container;
    public tileHolderBase: Phaser.GameObjects.Container;
    public tileHolderUnderEntity: Phaser.GameObjects.Container;
    public tileHolderEntity: Phaser.GameObjects.Container;
    public tileDebugHolder: Phaser.GameObjects.Container;
    private tileMask: Phaser.GameObjects.Graphics;
    public tiles: GameMapTile[][];
    private initialized: boolean = false;
    private mapCenter: Phaser.Math.Vector2;
    private gameScene: GameScene;

    private indicators: MapIndicator[];
    public attackKeyboardIndex: number = 0;
    public attackKeyboardActiveDwellerTarget: GameMapTile;
    public attackKeyboardTargetList: GameMapTile[] = [];

    constructor(gameScene: GameScene) {
        super(gameScene);
        this.gameScene = gameScene;
    }

    Preload() {
        this.scene.load.atlas("uigfx", "/gamegfx/uigfx.png", "/gamegfx/uigfx.json");
        this.scene.load.atlas("dwellerp", "/gamegfx/dwellerp.png", "/gamegfx/dwellerp.json");
        this.scene.load.atlas("maptiles", "/gamegfx/maptiles60.png", "/gamegfx/maptiles60.json");
        this.scene.load.atlas("dwellers", "/gamegfx/dwellers60.png", "/gamegfx/dwellers60.json");

        this.scene.load.atlas("effects", "/gamegfx/effects.png", "/gamegfx/effects.json");
    }

    GetTile(x: number, y: number): GameMapTile | null {
        if (y < 0 || x < 0 || y >= this.tiles.length || x > this.tiles[y].length) {
            return null;
        }
        return this.tiles[y][x];
    }

    GetMapArea(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(
            GameScene.GAME_MAP_X,
            GameScene.GAME_MAP_Y,
            GameScene.GAME_TOTAL_WIDTH - GameScene.GAME_MAP_X,
            GameScene.GAME_TOTAL_HEIGHT - GameScene.GAME_MAP_Y,
        );
    }

    Initialize(gridSizeX: number, gridSizeY: number) {
        this.x = GameScene.GAME_MAP_X;
        this.y = GameScene.GAME_MAP_Y;

        this.initialized = true;
        this.tileHolder = this.scene.add.container(0, 0);
        this.tileHolderBase = this.scene.add.container(0, 0);
        this.tileHolderUnderEntity = this.scene.add.container(0, 0);
        this.tileHolderEntity = this.scene.add.container(0, 0);
        this.tileDebugHolder = new Phaser.GameObjects.Container(this.scene, 0, 0);
        this.add(this.tileHolder);

        this.tileHolder.add(this.tileHolderBase);
        this.tileHolderBase.setDepth(1);

        this.tileHolder.add(this.tileHolderUnderEntity);
        this.tileHolderUnderEntity.setDepth(10);

        this.tileHolder.add(this.tileHolderEntity);
        this.tileHolderEntity.setDepth(25);

        if (gameConfig.showTileCoord) {
            this.scene.children.add(this.tileDebugHolder);
            this.tileHolder.add(this.tileDebugHolder);
            this.tileDebugHolder.setDepth(50);
        }

        var rect = this.GetMapArea();
        this.tileMask = this.scene.add.graphics({fillStyle: {color: 0x000000}});
        this.tileMask.fillRectShape(rect);
        this.tileHolder.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.tileMask);
        this.tiles = new Array(gridSizeY);
        for (let y = 0; y < gridSizeY; y++) {
            this.tiles[y] = new Array();
            for (let x = 0; x < gridSizeX; x++) {
                this.tiles[y][x] = new GameMapTile(x, y);
                if (gameConfig.showTileCoord) {
                    let bm = this.scene.add
                        .bitmapText(x * 60, y * 60, FONT.ASCII_18, x + "," + y)
                        .setOrigin(0.5, 0.5)
                        .setAlpha(0.5)
                        .setDepth(10);
                    this.tileDebugHolder.add(bm);
                }
            }
        }

        this.setActive(true);

        this.scene.children.add(this);
    }

    CenterOnTile(x: number, y: number) {
        this.tileHolder.x = Math.floor(this.GetMapArea().width / 2) - x * gameConfig.tileSize;
        this.tileHolder.y = Math.floor(this.GetMapArea().height / 2) - y * gameConfig.tileSize;
    }

    GetTileAtPoint(x: number, y: number): GameMapTile {
        if (this.tileHolder == undefined) return;

        let tx: number = Math.round((x - this.tileHolder.x) / gameConfig.tileSize) - 4;
        let ty: number = Math.round((y - this.tileHolder.y) / gameConfig.tileSize);

        return this.GetTile(tx, ty);
    }

    GetTileAtPointDebug(x: number, y: number): GameMapTile {
        if (this.tileHolder == undefined) return;

        let tx: number = Math.round((x - this.tileHolder.x) / gameConfig.tileSize) - 4;
        let ty: number = Math.round((y - this.tileHolder.y) / gameConfig.tileSize);

        console.log(
            "Click " +
            x +
            "," +
            y +
            " Tile XY" +
            tx +
            "," +
            ty +
            " TileHolder: " +
            this.tileHolder.x +
            "," +
            this.tileHolder.y +
            "," +
            gameConfig.tileSize,
        );

        return this.GetTile(tx, ty);
    }

    //Gets center by default (+30)
    GetTileScreenPosition(tile: GameMapTile): Phaser.Math.Vector2 {
        if (tile.currentGraphic != null) {
            return new Phaser.Math.Vector2(
                this.x + this.tileHolder.x + tile.currentGraphic.x + 30,
                this.y + this.tileHolder.y + tile.currentGraphic.y + 30,
            );
        } else {
            throw new Error("TODO: add way to get tile graphic position without existing graphic");
            /*
            let tx: number = Math.floor(820 / 2) + this.tileHolder.x + tile.x * gameConfig.tileSize;
        let ty: number = this.tileHolder.y + tile.y * gameConfig.tileSize;
        */
        }
    }

    GetTileHasActiveGraphic(tile: GameMapTile): boolean {
        return tile.currentGraphic != null;
    }

    GetTileHolderPosition(tile: GameMapTile): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(tile.x * gameConfig.tileSize, tile.y * gameConfig.tileSize);
    }

    GetTileDistance(x1: number, y1: number, x2: number, y2: number): number {
        let xd: number = Math.abs(x2 - x1);
        let yd: number = Math.abs(y2 - y1);
        return xd > yd ? xd : yd;
    }

    GetTileDirection(x1: number, y1: number, x2: number, y2: number): GlobalConst.MOVE_DIR {
        if (x1 < x2 && y1 < y2) {
            return GlobalConst.MOVE_DIR.NORTHWEST;
        }
        if (x1 < x2 && y1 == y2) {
            return GlobalConst.MOVE_DIR.WEST;
        }

        if (x1 < x2 && y1 > y2) {
            return GlobalConst.MOVE_DIR.SOUTHWEST;
        }

        if (x1 == x2 && y1 < y2) {
            return GlobalConst.MOVE_DIR.NORTH;
        }
        if (x1 == x2 && y1 > y2) {
            return GlobalConst.MOVE_DIR.SOUTH;
        }

        if (x1 > x2 && y1 < y2) {
            return GlobalConst.MOVE_DIR.NORTHEAST;
        }
        if (x1 > x2 && y1 == y2) {
            return GlobalConst.MOVE_DIR.EAST;
        }

        if (x1 > x2 && y1 > y2) {
            return GlobalConst.MOVE_DIR.SOUTHEAST;
        }
    }

    UpdateTiles(mapUpdate: M_Map) {
        for (let i = 0; i < mapUpdate.tiles.length; i++) {
            let t: M_Tile = mapUpdate.tiles[i] as M_Tile;
            //console.log("ID " + this.tiles[t.y][t.x].sid + " " + t.id);
            if (this.tiles[t.y][t.x].sid > 0 && this.tiles[t.y][t.x].sid != t.id) {
                console.log("ID MISMATCH IN TILE ");
            }
            if (t.ascii != undefined && t.ascii != "") {
                this.tiles[t.y][t.x].ascii = t.ascii;
            } else {
                this.tiles[t.y][t.x].ascii = " ";
            }
            this.tiles[t.y][t.x].sid = t.id;
            this.tiles[t.y][t.x].ClearDwellers();
            this.tiles[t.y][t.x].UpdateTileInfo(t.kind, t.flags);
        }
    }

    ParseUpdate(mapUpdate: M_Map) {
        if (!this.initialized) {
            this.Initialize(mapUpdate.sizeX, mapUpdate.sizeY);
        }
        this.UpdateTiles(mapUpdate);
    }

    Draw() {
        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                let t: GameMapTile = this.tiles[y][x];
                if (t.updatedThisTurn && t.GetGraphicNameCurrent() != t.GetGraphicNameToShow()) {
                    let show = t.GetGraphicNameToShow();
                    let spr: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite = this.scene.add.image(
                        x * gameConfig.tileSize,
                        y * gameConfig.tileSize,
                        t.GetAtlasNameToShow(),
                        show,
                    );

                    t.SetGraphic(spr);
                    if (t.GetDepth() == PHASER_DEPTH.MAP) {
                        this.tileHolderBase.add(spr);
                    } else {
                        this.tileHolderEntity.add(spr);
                    }
                }
                t.UpdateFogOfWar();
                t.CleanUpAfterDraw();
            }
        }
    }

    ClearIndicators() {
        this.attackKeyboardActiveDwellerTarget = null;
        this.attackKeyboardTargetList = [];

        if (this.indicators != undefined) {
            for (let i = 0; i < this.indicators.length; i++) {
                this.indicators[i].destroy();
            }
        }
        this.indicators = [];
    }

    UpdateIndicators(forceDwellersOnly: boolean = false, overrideRange: number = -1) {
        //if (!gameConfig.mapNavigation) return;
        this.ClearIndicators();

        let nbrs: GameMapTile[] = this.gameScene.map.GetNeighbors(this.gameScene.player.tile);

        if (!forceDwellersOnly) {
            for (let i = 0; i < nbrs.length; i++) {
                let t: GameMapTile = nbrs[i];
                if (t.x < 7) {
                } else if (t.hasStoryEvent || t.hasMerchant) {
                    this.indicators.push(new MapIndicator(this, MapIndicator.TYPE.INTERACT, t));
                } else if (t.isWalkable) {
                    this.indicators.push(new MapIndicator(this, MapIndicator.TYPE.MOVE, t));
                }
            }
        }

        let range: number = overrideRange == -1 ? this.gameScene.player.GetActiveWeaponRange() : overrideRange;
        let possTargets: GameMapTile[] = this.GetTilesInRange(this.gameScene.player.tile, range);

        for (let i = 0; i < possTargets.length; i++) {
            if (possTargets[i].isVisible && possTargets[i].hasDweller) {
                let xdist: number = Math.abs(this.gameScene.player.tile.x - possTargets[i].x);
                let ydist: number = Math.abs(this.gameScene.player.tile.y - possTargets[i].y);
                let totalDist: number = xdist + ydist;
                console.log(xdist + "," + ydist + " -- RANGE IS: " + totalDist);
                this.indicators.push(new MapIndicator(this, MapIndicator.TYPE.ATTACK, possTargets[i]));
            }
        }
    }

    UpdateAttackIndicatorsKeyboard(step: number, overrideRange: number = -1) {
        //if (!gameConfig.mapNavigation) return;
        this.ClearIndicators();

        let range: number = overrideRange == -1 ? this.gameScene.player.GetActiveWeaponRange() : overrideRange;
        let possTargets: GameMapTile[] = this.GetTilesInRange(this.gameScene.player.tile, range);
        let liveTargets: GameMapTile[] = [];

        for (let i = 0; i < possTargets.length; i++) {
            if (possTargets[i].isVisible && possTargets[i].hasDweller) {
                liveTargets.push(possTargets[i]);
            }
        }

        console.log("live target legnth is " + liveTargets.length);
        this.attackKeyboardTargetList = liveTargets;
        console.log("base index is " + this.attackKeyboardIndex);
        this.attackKeyboardIndex += step;
        console.log("adj index is " + this.attackKeyboardIndex);
        if (this.attackKeyboardIndex > liveTargets.length - 1) {
            this.attackKeyboardIndex = 0;
        } else if (this.attackKeyboardIndex < 0) {
            this.attackKeyboardIndex = liveTargets.length - 1;
        }

        console.log("AFTER INDEX IS: " + this.attackKeyboardIndex);

        for (let i = 0; i < liveTargets.length; i++) {
            if (i == this.attackKeyboardIndex) {
                this.indicators.push(new MapIndicator(this, MapIndicator.TYPE.ATTACK, liveTargets[i]));
                console.log("SHOWING");
                this.attackKeyboardActiveDwellerTarget = liveTargets[i];
            }
        }
    }

    GetNeighbors(tile: GameMapTile): GameMapTile[] {
        let nb: GameMapTile[] = [];
        this.AddToArrayIfExists(nb, tile.pos.x + 1, tile.pos.y);
        this.AddToArrayIfExists(nb, tile.pos.x - 1, tile.pos.y);
        this.AddToArrayIfExists(nb, tile.pos.x, tile.pos.y + 1);
        this.AddToArrayIfExists(nb, tile.pos.x, tile.pos.y - 1);
        this.AddToArrayIfExists(nb, tile.pos.x + 1, tile.pos.y + 1);
        this.AddToArrayIfExists(nb, tile.pos.x - 1, tile.pos.y - 1);
        this.AddToArrayIfExists(nb, tile.pos.x - 1, tile.pos.y + 1);
        this.AddToArrayIfExists(nb, tile.pos.x + 1, tile.pos.y - 1);
        return nb;
    }

    //if withDweller=false will return every tile in range
    //compassLimit limits directions to direct lines from origin tile
    GetTilesInRange(tile: GameMapTile, range: number): GameMapTile[] {
        let tiles: GameMapTile[] = [];
        for (let x = tile.x - range; x <= tile.x + range; x++) {
            for (let y = tile.y - range; y <= tile.y + range; y++) {
                if (this.isInAttackRangeFrom(tile.x, tile.y, x, y, range)) {
                    this.AddToArrayIfExists(tiles, x, y);
                }
            }
        }

        return tiles;
    }

    public isInAttackRangeFrom(originX: number, originY: number, targetX: number, targetY: number, range: number) {
        let xdist: number = Math.abs(originX - targetX);
        let ydist: number = Math.abs(originY - targetY);
        if (range == 1 && xdist <= 1 && ydist <= 1) {
            return true;
        }
        if (xdist ** 2 + ydist ** 2 <= range ** 2) {
            return true;
        }

        return false;
    }

    private AddToArrayIfExists(tileArray: GameMapTile[], x: number, y: number): GameMapTile[] {
        let t: GameMapTile = this.GetTile(x, y);
        if (t != null) {
            tileArray.push(t);
        }
        return tileArray;
    }

    public GetNormalVectorFromCompass(dir: GlobalConst.MOVE_DIR): Phaser.Math.Vector2 {
        if (dir == GlobalConst.MOVE_DIR.EAST) {
            return new Phaser.Math.Vector2(1, 0);
        } else if (dir == GlobalConst.MOVE_DIR.SOUTHEAST) {
            return new Phaser.Math.Vector2(1, 1);
        } else if (dir == GlobalConst.MOVE_DIR.SOUTH) {
            return new Phaser.Math.Vector2(0, -1);
        } else if (dir == GlobalConst.MOVE_DIR.SOUTHWEST) {
            return new Phaser.Math.Vector2(-1, 1);
        } else if (dir == GlobalConst.MOVE_DIR.WEST) {
            return new Phaser.Math.Vector2(-1, 0);
        } else if (dir == GlobalConst.MOVE_DIR.NORTHWEST) {
            return new Phaser.Math.Vector2(-1, -1);
        } else if (dir == GlobalConst.MOVE_DIR.NORTH) {
            return new Phaser.Math.Vector2(0, 1);
        } else if (dir == GlobalConst.MOVE_DIR.NORTHEAST) {
            return new Phaser.Math.Vector2(1, -1);
        }
    }
}
