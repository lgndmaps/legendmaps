import type Game from "./game";
import type GameMap from "./map/gameMap";

import Character from "./character/character";
import Entity from "./base_classes/entity";
import FlagUtil from "./utils/flagUtil";
import MapPos from "./utils/mapPos";
import MapRect from "./utils/mapRect";
import Command from "./client_comm/Command";
import {Mrpas} from "mrpas";
import MapTile from "./map/mapTile";
import RandomUtil from "./utils/randomUtil";
import {
    CharacterD,
    M_TurnEvent,
    M_TurnEvent_FX,
    M_TurnEvent_Msg,
    M_TurnEvent_Names,
    M_TurnEvent_Param,
} from "./types/globalTypes";
import GlobalConst from "./types/globalConst";
import {AStarFinder} from "./map/astar/finders/astar-finder";
import Dweller from "./dweller/dweller";
import {SerializedCharacterD} from "./types/types";
import StoryEvent from "./story/storyEvent";
import MapPopulator from "./map/generator/mapPopulator";
import GameUtil from "./utils/gameUtil";
import Merchant from "./merchant/merchant";
import ConditionManager from "./effect/conditionManager";
import Item from "./item/item";
import ItemTests from "./item/itemgen/itemTests";

/**
 * dungeon is our top level manager class
 * that determines everything going on
 * in the game world/dungeon.
 */
export default class Dungeon {
    game: Game;
    visMap: number[][]; //holds last calculated fov vision calculations
    private fovCalc?: Mrpas; //FOV calculator
    private _character?: Character; //shorthand accessor for player character character
    private _turnEvents: M_TurnEvent[] = [];

    constructor(game: Game) {
        this.game = game;
        this.visMap = [];
    }

    private get entities(): Array<Entity> {
        return this.game.data.entities;
    }

    DungeonStarted() {
        //Callback  after game starts
        this.game.data.flags = FlagUtil.Set(this.game.data.flags, GlobalConst.GAMESTATE_FLAGS.IS_STARTED);
    }

    DungeonCheckForReturnMessage() {
        if (this.game.data.turn > 1) {
            this.AddMessageEvent("Welcome Back to " + this.game.data.map.mapname);
        }
    }

    // ******************************
    // #region CommandAndTurns
    // *****************************
    RunCommand(cmd: Command) {
        if (cmd.Validate()) {
            cmd.Execute();
            if (cmd.duration > 0) {
                this.AdvanceTurnClock(cmd.duration);
            }
            this.CalculatePlayerFOV();
        }
    }

    AdvanceTurnClock(amount: number = 1) {
        if (ConditionManager.instance.HasCondition(this.game.dungeon.character, GlobalConst.CONDITION.HASTED)) {
            if (this.game.data.turn % 2 == 0) {
                this.game.data.turn += amount;
                return;
            }
        }

        for (let i: number = 0; i < amount; i++) {
            for (let e: number = 0; e < this.entities.length; e++) {
                //Stop checks if something caused my run to end (usually player death).
                if (FlagUtil.IsNotSet(this.game.data.flags, GlobalConst.GAMESTATE_FLAGS.RUN_CONCLUDED)) {
                    this.entities[e].TurnClockStep(this.game.data.turn);
                }
            }
        }
        this.game.data.turn += amount;
    }

    EndTurnCleanup() {
        for (let e: number = this.entities.length - 1; e >= 0; e--) {
            if (FlagUtil.IsSet(this.entities[e].flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL)) {
                this.entities[e].DeSpawn();
                this.entities.splice(e, 1);
            }
        }
    }

    ClearTurnEvents() {
        this._turnEvents = [];
    }

    AddTurnEvent(eventName: string = "", params: M_TurnEvent_Param = {}) {
        let te: M_TurnEvent = {
            event: eventName,
            params: params,
        };
        this._turnEvents.push(te);
    }

    //Sends a text message to client message area, takes optional array of message flags
    AddMessageEvent(message: string, msgFlags: GlobalConst.MESSAGE_FLAGS[] = []) {
        let mflags: number = 0;
        for (let f = 0; f < msgFlags.length; f++) {
            mflags = FlagUtil.Set(mflags, msgFlags[f]);
        }
        this.AddTurnEvent(M_TurnEvent_Names.MESSAGE, {
            text: message,
            mflags: mflags,
        } as M_TurnEvent_Msg);
    }

    AddFXEvent(
        message: string,
        fxToShow: GlobalConst.CLIENTFX = GlobalConst.CLIENTFX.NONE,
        msgFlags: GlobalConst.MESSAGE_FLAGS[] = [],
        effectsPlayer: boolean = false,
        effectsDwellerIds: number[] = [],
        amount: number = -1,
    ) {
        let mflags: number = 0;
        for (let f = 0; f < msgFlags.length; f++) {
            mflags = FlagUtil.Set(mflags, msgFlags[f]);
        }
        let fxevent: M_TurnEvent_FX = {
            text: message,
            mflags: mflags,
            fx: fxToShow,
        };
        if (effectsPlayer) {
            fxevent.pc = true;
        }
        if (effectsDwellerIds.length > 0) {
            fxevent.dwellers = effectsDwellerIds;
        }
        if (amount != -1) {
            fxevent.amount = amount;
        }
        this.AddTurnEvent(M_TurnEvent_Names.FX, fxevent);
    }

    HasTurnEvents(): boolean {
        return this._turnEvents.length > 0 ? true : false;
    }

    GetTurnEvents(): M_TurnEvent[] {
        return this._turnEvents;
    }

    // ******************************
    // #endregion CommandAndTurns
    // ******************************

    // ******************************
    //#region Character
    // ******************************
    async CreateAndSpawnCharacter(characterData: SerializedCharacterD): Promise<void> {
        let tile: MapPos = this.GetTileWalkable(new MapRect(7, 0, 3, this.game.data.map.GetMapHeight()));

        //This is called on first run, first run after a grizzled level up, or subsequent runs.
        //wwwconsole.log("CREATE AND SPAWN CHAR, DATA IS " + JSON.stringify(characterData));

        let char: Character = new Character(this.game, characterData.data, true);
        if (characterData?.data?.idcounter > 0) {
            this.game.data.idcounter = characterData.data.idcounter;
        } else if (this.game.data.idcounter != null && this.game.data.idcounter <= 0) {
            this.game.data.idcounter = 1;
            console.log("ID COUNTER RESET IS " + this.game.data.idcounter);
        }


        char.$characterCampaign = characterData;
        await char.CheckForRunInit();

        char.Spawn(tile.x, tile.y);
        this.RunTests();
        char.ApplySkillEffects();
        this.CalculatePlayerFOV();
    }

    get character(): Character {
        if (this._character == undefined) {
            this._character = this.GetEntitiesByClass(GlobalConst.ENTITY_CNAME.CHARACTER)[0] as Character;
        }
        return this._character;
    }

    // ******************************
    //#endregion Character
    // ******************************

    // ******************************
    //#region Tile and Map
    // ******************************
    CalculatePlayerFOV() {
        this.ClearVisibilityData();
        if (this.fovCalc === undefined) {
            this.fovCalc = new Mrpas(
                this.game.data.map.GetMapWidth() + 1,
                this.game.data.map.GetMapHeight() + 1,
                (x, y) => !this.TileBlocksVision(x, y),
            );
        }
        this.visMap = new Array(this.game.data.map.GetMapHeight() + 1)
            .fill(0)
            .map(() => new Array(this.game.data.map.GetMapWidth() + 1).fill(0));
        this.fovCalc.compute(
            this.character.mapPos.x,
            this.character.mapPos.y,
            7,
            (x, y) => this.GetTileVisible(x, y),
            (x, y) => this.SetTileVisible(x, y),
        );
    }

    ClearVisibilityData() {
        let map: GameMap = this.game.data.map;

        for (let y = 0; y <= map.GetMapHeight(); y++) {
            for (let x = 0; x <= map.GetMapWidth(); x++) {
                map.SetTileVisible(x, y, false);
            }
        }
    }

    SetTileVisible(x: number, y: number) {
        this.visMap[y][x] = 1;
        this.game.data.map.SetTileVisible(x, y, true);
    }

    GetTileVisible(x: number, y: number): boolean {
        return this.visMap[y][x] == 1;
    }

    TileBlocksVision(x: number, y: number): boolean {
        if (this.game.data.map.IsVoidSpot(x, y) || this.game.data.map.GetTileBase(x, y).BlocksVision()) {
            return true;
        } else {
            if (this.GetEntitiesInTile(x, y, GlobalConst.ENTITY_FLAGS.BLOCKS_VISION, 0).length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    //Checks if a Tile is Walkable (checking both map and entities)
    TileIsWalkable(x: number, y: number, forDweller: boolean = false): boolean {
        if (
            !this.game.data.map.IsInMap(x, y) ||
            this.game.data.map.IsVoidSpot(x, y) ||
            !this.game.data.map.GetTileBase(x, y).IsWalkable()
        ) {
            return false;
        } else {
            if (
                forDweller &&
                this.GetEntitiesInTile(x, y, 0, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE).length > 0
            ) {
                return false;
            } else if (
                !forDweller &&
                this.GetEntitiesInTile(x, y, 0, GlobalConst.ENTITY_FLAGS.IS_WALKABLE).length > 0
            ) {
                return false;
            } else {
                return true;
            }
        }
    }

    GetStoryEventInTile(x: number, y: number): StoryEvent | null {
        let st: Entity[] = this.GetEntitiesInTile(x, y, 0, 0, GlobalConst.ENTITY_CNAME.STORYEVENT);
        if (st.length > 1) {
            throw new Error("Multiple story events in tile " + x + "," + y);
        }
        if (st.length == 1) {
            return st[0] as StoryEvent;
        }
        return null;
    }

    GetMerchantInTile(x: number, y: number): Merchant | null {
        let st: Entity[] = this.GetEntitiesInTile(x, y, 0, 0, GlobalConst.ENTITY_CNAME.MERCHANT);
        if (st.length > 1) {
            throw new Error("Multiple merchants in tile " + x + "," + y);
        }
        if (st.length == 1) {
            return st[0] as Merchant;
        }
        return null;
    }

    GetDwellerInTile(x: number, y: number): Dweller | null {
        let dweller: Entity[] = this.GetEntitiesInTile(x, y, 0, 0, GlobalConst.ENTITY_CNAME.DWELLER);
        if (dweller.length > 1) {
            throw new Error("Multiple dwellers in tile " + x + "," + y);
        }
        if (dweller.length == 1) {
            return dweller[0] as Dweller;
        }
        return null;
    }

    //Gets a walkable tile anywhere in given rect (full map if no rect provided)
    GetTileWalkable(inArea: MapRect | null = null): MapPos {
        if (inArea == null) {
            inArea = this.game.data.map.GetRect();
        }
        if (inArea.extents.y > this.game.data.map.GetRect().extents.y) {
            console.log("Y is over in GTW");
            inArea.extents.y = this.game.data.map.GetRect().extents.y;
        }
        if (inArea.extents.x > this.game.data.map.GetRect().extents.x) {
            console.log("X is over in GTW");
            inArea.extents.x = this.game.data.map.GetRect().extents.x;
        }

        let sanity: number = 500;
        while (sanity > 0) {
            sanity--;
            let x: number = RandomUtil.instance.int(inArea.origin.x, inArea.bottomRight.x);
            let y: number = RandomUtil.instance.int(inArea.origin.y, inArea.bottomRight.y);
            if (this.TileIsWalkable(x, y)) {
                return new MapPos(x, y);
            }
        }
        throw new Error("No Walkable Tiles Found in Rect " + inArea.ToStr());
    }

    GetNeighbors(startPos: MapPos): MapPos[] {
        let tiles: MapPos[] = [];
        tiles.push(new MapPos(startPos.x + 1, startPos.y));
        tiles.push(new MapPos(startPos.x + 1, startPos.y + 1));
        tiles.push(new MapPos(startPos.x + 1, startPos.y - 1));
        tiles.push(new MapPos(startPos.x, startPos.y + 1));
        tiles.push(new MapPos(startPos.x, startPos.y - 1));
        tiles.push(new MapPos(startPos.x - 1, startPos.y));
        tiles.push(new MapPos(startPos.x - 1, startPos.y - 1));
        tiles.push(new MapPos(startPos.x - 1, startPos.y + 1));

        return tiles;
    }

    GetWalkableNeighbors(startPos: MapPos, forDweller: boolean = false): MapPos[] {
        let tiles: MapPos[] = [];

        if (this.TileIsWalkable(startPos.x + 1, startPos.y, forDweller)) {
            tiles.push(new MapPos(startPos.x + 1, startPos.y));
        }
        if (this.TileIsWalkable(startPos.x + 1, startPos.y + 1, forDweller)) {
            tiles.push(new MapPos(startPos.x + 1, startPos.y + 1));
        }
        if (this.TileIsWalkable(startPos.x + 1, startPos.y - 1, forDweller)) {
            tiles.push(new MapPos(startPos.x + 1, startPos.y - 1));
        }
        if (this.TileIsWalkable(startPos.x, startPos.y + 1, forDweller)) {
            tiles.push(new MapPos(startPos.x, startPos.y + 1));
        }
        if (this.TileIsWalkable(startPos.x, startPos.y - 1, forDweller)) {
            tiles.push(new MapPos(startPos.x, startPos.y - 1));
        }
        if (this.TileIsWalkable(startPos.x - 1, startPos.y, forDweller)) {
            tiles.push(new MapPos(startPos.x - 1, startPos.y));
        }
        if (this.TileIsWalkable(startPos.x - 1, startPos.y - 1, forDweller)) {
            tiles.push(new MapPos(startPos.x - 1, startPos.y - 1));
        }
        if (this.TileIsWalkable(startPos.x - 1, startPos.y + 1, forDweller)) {
            tiles.push(new MapPos(startPos.x - 1, startPos.y + 1));
        }
        return tiles;
    }

    GetTilesInEuclidianRange(origin: MapPos, range: number, range_min?: number): MapPos[] {
        let tiles: MapPos[] = [];
        if (!range_min) range_min = 0;
        for (let x = origin.x - range; x < origin.x + range; x++) {
            for (let y = origin.y - range; y < origin.x + range; y++) {
                if (!this.game.data.map.IsInMap(x, y) || this.game.data.map.IsVoidSpot(x, y)) {
                    continue;
                } else {
                    let testPos = new MapPos(x, y);
                    if (this.TileInEuclidianRange(origin, testPos, range)) {
                        if (!this.TileInEuclidianRange(origin, testPos, range_min)) {
                            // ignore impassible tiles west of the starting point
                            if (x >= 7) tiles.push(new MapPos(x, y));
                        }
                    }
                }
            }
        }
        return tiles;
    }

    //Gets naive distance between tiles, assuming diagonals are free.
    // Chebyshev distance
    //NOT USEFUL FOR PATHFINDING!
    GetTileDistance(tile1: MapPos, tile2: MapPos): number {
        let xd: number = Math.abs(tile2.x - tile1.x);
        let yd: number = Math.abs(tile2.y - tile1.y);
        return xd > yd ? xd : yd;
    }

    // returns xdist ** 2 + ydist ** 2, useful for range calculations where you want
    // an approximate circular range, compare to range ** 2
    GetEuclidianTileDistanceSquared(tile1: MapPos, tile2: MapPos): number {
        let xd: number = Math.abs(tile2.x - tile1.x);
        let yd: number = Math.abs(tile2.y - tile1.y);
        return xd ** 2 + yd ** 2;
    }

    TileInEuclidianRange(t1: MapPos, t2: MapPos, range: number): boolean {
        let dist_sq: number = this.GetEuclidianTileDistanceSquared(t1, t2);
        return dist_sq <= range ** 2;
    }

    // utility function for filtering tile character lists.
    public GetEntitiesInTile(
        x: number,
        y: number,
        withFlag: number = 0,
        withOutFlag: number = 0,
        cname: GlobalConst.ENTITY_CNAME = GlobalConst.ENTITY_CNAME.ANY,
    ): Array<Entity> {
        let foundEnt: Array<Entity> = new Array();
        for (let ent of this.entities) {
            if (ent.mapEntity != null && ent.mapEntity.pos.equals(x, y)) {
                if (
                    (cname == GlobalConst.ENTITY_CNAME.ANY || cname == ent.cname) &&
                    (withFlag == 0 || FlagUtil.IsSet(ent.flags, withFlag)) &&
                    (withOutFlag == 0 || FlagUtil.IsNotSet(ent.flags, withOutFlag))
                ) {
                    foundEnt.push(ent);
                }
            }
        }
        return foundEnt;
    }

    PickupItemsInTile(x: number, y: number) {
        let items: Array<Entity> = this.game.dungeon.GetEntitiesInTile(x, y, 0, 0, GlobalConst.ENTITY_CNAME.ITEM);
        for (let i = 0; i < items.length; i++) {
            this.character.PickupItem(items[i] as Item);
        }
    }

    //utility function for filtering tile character lists.
    public GetEntitiesByClass(
        cname: GlobalConst.ENTITY_CNAME,
        withFlag: number = 0,
        withOutFlag: number = 0,
    ): Array<Entity> {
        let foundEnt: Array<Entity> = new Array();
        for (let ent of this.entities) {
            if (
                cname == ent.cname &&
                (withFlag == 0 || FlagUtil.IsSet(ent.flags, withFlag)) &&
                (withOutFlag == 0 || FlagUtil.IsNotSet(ent.flags, withOutFlag))
            )
                foundEnt.push(ent);
        }
        return foundEnt;
    }

    GetAllTilesInLineThroughTile(startTile: MapPos, targetTile: MapPos, range: number): MapPos[] {
        let tiles: MapPos[] = [];

        //Bresenham path check
        let x0 = startTile.x;
        let y0 = startTile.y;
        let x1 = targetTile.x;
        let y1 = targetTile.y;
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        //console.log("sight line from " + startTile.toStr() + " to " + targetTile.toStr() + ":::");
        let pathComplete = false;
        let hitTarget = false;
        let maxdist = range;
        while (!pathComplete && maxdist >= 0) {
            // console.log("" + x0 + "," + y0);
            if (x0 == startTile.x && y0 == startTile.y) {
                //dont check start
            } else {
                if (x0 == x1 && y0 == y1) {
                    hitTarget = true;
                }
            }
            tiles.push(new MapPos(x0, y0));
            maxdist--;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
        //  console.log("CLEAR");
        return tiles;
    }

    IsFreeLinePathToTile(startTile: MapPos, targetTile: MapPos, range: number): boolean {
        if (startTile.isOnLinePathTo(targetTile)) {
            let path: Array<MapPos> = startTile.GetLinePathTo(targetTile);
            if (path.length > range) {
                return false;
            }
            for (let i: number = 0; i < path.length; i++) {
                if (!targetTile.equalsPos(path[i]) && !this.TileIsWalkable(path[i].x, path[i].y)) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    //Full A Star between two points, assumes start and end both walkable
    FindPath(startTile: MapPos, endTile: MapPos, forDweller: boolean = false): MapPos[] {
        let astarMatrix: number[][] = new Array(this.game.data.map.GetMapHeight() + 1)
            .fill(1)
            .map(() => new Array(this.game.data.map.GetMapWidth() + 1).fill(1));

        for (let ry = 0; ry <= this.game.data.map.GetMapHeight(); ry++) {
            for (let rx = 0; rx <= this.game.data.map.GetMapWidth(); rx++) {
                if (this.TileIsWalkable(rx, ry, forDweller)) {
                    astarMatrix[ry][rx] = 0;
                }
            }
        }

        astarMatrix[startTile.y][startTile.x] = 0;
        astarMatrix[endTile.y][endTile.x] = 0;
        let aStarInstance: AStarFinder = new AStarFinder({
            grid: {
                matrix: astarMatrix,
            },
            diagonalAllowed: true,

            //weight: .3,
            includeEndNode: false,
            includeStartNode: true,
        });

        let foundPath = aStarInstance.findPath({x: startTile.x, y: startTile.y}, {x: endTile.x, y: endTile.y});
        let foundPathGridPoints: Array<MapPos> = new Array();

        for (let p = 0; p < foundPath.length; p++) {
            let gp: MapPos = new MapPos(foundPath[p][0], foundPath[p][1]);

            foundPathGridPoints.push(gp);
        }
        return foundPathGridPoints;
    }

    // ******************************
    //#endregion Tile and Map
    // ******************************

    // ******************************
    //#region ASCII
    // ******************************
    GetAsciiServerDebug(highlightTilePos: MapPos | null = null): string {
        let map: GameMap = this.game.data.map;
        let mapstr = "";
        for (let y = 0; y <= map.GetMapHeight(); y++) {
            for (let x = 0; x <= map.GetMapWidth(); x++) {
                if (highlightTilePos != null && highlightTilePos.x == x && highlightTilePos.y == y) {
                    mapstr += "©";
                } else {
                    mapstr += this.GetTileAscii(x, y, true);
                }
            }
            mapstr += "\n";
        }
        return mapstr;
    }

    GetAsciiVis(): string {
        let map: GameMap = this.game.data.map;
        let mapstr = "";
        for (let y = 0; y <= map.GetMapHeight(); y++) {
            for (let x = 0; x <= map.GetMapWidth(); x++) {
                if (this.GetTileVisible(x, y)) {
                    mapstr += this.GetTileAscii(x, y);
                } else {
                    mapstr += " ";
                }
            }
            mapstr += "\n";
        }
        return mapstr;
    }

    GetTileAscii(x: number, y: number, showHidden: boolean = false): string {
        if (!this.game.data.map.IsVoidSpot(x, y)) {
            let ents: Array<Entity> = this.GetEntitiesInTile(x, y);
            for (let e of ents) {
                if (!showHidden && FlagUtil.IsSet(e.flags, GlobalConst.ENTITY_FLAGS.IS_HIDDEN)) {
                    //Do not show hidden entities.
                } else if (e.mapEntity != null && FlagUtil.IsNotSet(e.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE)) {
                    return e.mapEntity.ascii; //solid entities (chars, dwellers, etc) will always be on top
                } else if (e.mapEntity != null) {
                    return e.mapEntity.ascii; //walkable entities (items, traps, next)
                }
            }
            //No entities relevant, return basetile ascii
            let t: MapTile = this.game.data.map.GetTileIfExists(x, y);
            if (t != undefined) {
                return t.ascii;
            }
        }
        return " ";
    }

    GetBaseAscii(x: number, y: number): string {
        if (!this.game.data.map.IsVoidSpot(x, y)) {
            //No entities relevant, return basetile ascii
            let t: MapTile = this.game.data.map.GetTileIfExists(x, y);
            if (t != undefined) {
                return t.ascii;
            }
        }
        return " ";
    }

    // ******************************
    //#endregion ASCII
    // ******************************

    private RunTests() {
        // ItemTests.RunTests(this.game);
    }
}
