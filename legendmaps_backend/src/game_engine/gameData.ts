import SerializableGameObject from "./base_classes/serializableGameObject";
import Game from "./game";
import GameMap from "./map/gameMap";
import {
    EntityD,
    GameDataD,
    CharacterD,
    ItemD,
    DwellerD,
    M_StoryEvent,
    StoryEventD,
    M_Condition,
    StatRun,
    MapPortalD,
    TrapD,
    M_Merchant,
    MerchantD,
} from "./types/globalTypes";
import Entity from "./base_classes/entity";
import assert from "assert";
import Character from "./character/character";
import {
    M_Char,
    M_Dweller,
    M_Effect,
    M_Entity,
    M_Game,
    M_InventoryItem,
    M_Item,
    M_Map,
    M_Tile,
} from "./types/globalTypes";
import MapTile from "./map/mapTile";
import ObjectUtil from "./utils/objectUtil";
import Item from "./item/item";
import Dweller from "./dweller/dweller";
import InventoryItem from "./item/inventoryItem";
import MapEntity from "./map/mapEntity";
import GlobalConst from "./types/globalConst";
import {SerializedCharacterD} from "./types/types";
import MapGen from "./map/generator/mapGen";
import MapPopulator from "./map/generator/mapPopulator";
import StoryEvent from "./story/storyEvent";
import RandomUtil from "./utils/randomUtil";
import GameStats from "./gameStats";
import MapPortal from "./map/mapPortal";
import FlagUtil from "./utils/flagUtil";
import Trap from "./trap/trap";
import Merchant from "./merchant/merchant";
import ConditionManager from "./effect/conditionManager";

//Primary parent class for all saveable/serializable game data
export default class GameData extends SerializableGameObject {
    _initialized: boolean = false;
    seed: number;

    idcounter: number = 1;
    turn: number = 0;
    tokenId: number = -1;
    campaignId: number = -1;
    flags: number = 0; //use GlobalConst.FLAGS
    stats: GameStats;

    //private _mapTokenID: number = -1;
    private _map?: GameMap;
    private _entities: Array<Entity> = [];

    //#region Init and Load
    constructor(game: Game) {
        super(game);
        this.id = this.GetNextId();
    }

    GetNextId(): number {
        let nid = this.idcounter++;
        // console.log("next id is: " + nid);
        return nid;
    }

    get isInitialized(): boolean {
        return this._initialized;
    }

    get map(): GameMap {
        if (this._map) return this._map;
        throw new Error("map undefined");
    }

    CreateNewGame(mapMetaData: JSON = null, mapMetaMetaData: JSON = null) {
        this._initialized = true;

        let generator: MapGen = new MapGen();
        this._map = new GameMap(this.game);

        this.stats = new GameStats();

        generator.GenerateMap(mapMetaData, mapMetaMetaData, RandomUtil.instance.seed).SetGameMap(this.game);

        //Place entrance portal.

        let entrancePortal: MapPortal = new MapPortal(this.game);
        entrancePortal.CreateAndSpawn(
            generator.curMap.entranceTilePosX,
            generator.curMap.entranceTilePosY,
            GlobalConst.SPECIAL_TILE_TYPE.ENTRANCE,
        );
        entrancePortal.open();
        this.game.data.map.entranceTile = entrancePortal;

        let populator: MapPopulator = new MapPopulator(this.game);
        populator.PopulateMap();

        console.log("MAP IS:\n " + this.game.dungeon.GetAsciiServerDebug());
    }

    LoadGameData(data: GameDataD, charData: SerializedCharacterD) {
        this.idcounter = data.idcounter;
        this.seed = data.seed;
        this.turn = data.turn;

        this._initialized = true;
        this._map = new GameMap(this.game);

        this._map.LoadMapData(data._map);

        this.stats = new GameStats(data.stats as StatRun);
        this.stats.mapTokenId = data.tokenId;
        this.tokenId = data.tokenId;
        this.campaignId = data.campaignId;
        for (let i: number = 0; i < data._entities.length; i++) {
            if (data._entities[i].cname == GlobalConst.ENTITY_CNAME.CHARACTER) {
                let c: Character = new Character(this.game, data._entities[i] as CharacterD);
                c.$characterCampaign = charData;
                c.CheckForRunInit();
            } else if (data._entities[i].cname == GlobalConst.ENTITY_CNAME.ITEM) {
                let item: Item = new Item(this.game, data._entities[i] as ItemD);
            } else if (data._entities[i].cname == GlobalConst.ENTITY_CNAME.DWELLER) {
                let item: Dweller = new Dweller(this.game, data._entities[i] as DwellerD);
            } else if (data._entities[i].cname == GlobalConst.ENTITY_CNAME.STORYEVENT) {
                let item: StoryEvent = new StoryEvent(this.game, data._entities[i] as StoryEventD);
            } else if (data._entities[i].cname == GlobalConst.ENTITY_CNAME.MERCHANT) {
                let item: Merchant = new Merchant(this.game, data._entities[i] as MerchantD);
            } else if (data._entities[i].cname == GlobalConst.ENTITY_CNAME.MAPPORTAL) {
                let item: MapPortal = new MapPortal(this.game, data._entities[i] as MapPortalD);
            } else if (data._entities[i].cname == GlobalConst.ENTITY_CNAME.TRAP) {
                let item: Trap = new Trap(this.game, data._entities[i] as TrapD);
            } else {
                throw new Error("Entity Not Found in Loader for " + JSON.stringify(data._entities[i]));
            }
        }

        // Need to recalculate the FOV on game load
        this.game.dungeon.CalculatePlayerFOV();
    }

    //#endregion Init and Load

    get entities(): Array<Entity> {
        return this._entities;
    }

    //This method is called automatically by every character constructor, should not be called otherwise.
    AddEntity(entity: Entity) {
        assert.ok(!this._entities.includes(entity), "DUPE ENTITY");
        // console.log("Addding character " + character.cname + " at " + JSON.stringify(character.mapPos));
        this._entities.push(entity);
    }

    //#region ClientUpdates
    GetClientJSON(restoreSession: boolean = false): M_Game | null {
        // console.log("------------GETTING JSON --------------");
        //   console.log(this.game.dungeon.GetAsciiServerDebug());
        //  console.log(this.game.dungeon.GetAsciiVis());
        let msg: M_Game = new Object() as M_Game;
        msg.turn = this.turn;
        msg.flags = this.flags;

        /**
         * Map State Update
         */
        let map: M_Map = new Object() as M_Map;
        map.sizeX = this.map.GetMapWidth() + 1;
        map.sizeY = this.map.GetMapHeight() + 1;
        map.tiles = new Array();
        msg.map = map;
        let visMap: number[][] = this.game.dungeon.visMap;
        for (let y: number = 0; y < visMap.length; y++) {
            for (let x: number = 0; x < visMap[y].length; x++) {
                //check if revealed IF restoreSession
                let mapTile: MapTile | null = this.map.GetTileIfExists(x, y);
                if (mapTile != null && (mapTile.IsVisible() || mapTile.IsRevealed())) {
                    //visMap[y][x] === 1
                    let mapTile: MapTile | null = this.map.GetTileIfExists(x, y);
                    if (mapTile != null) {
                        let tile: M_Tile = new Object() as M_Tile;

                        tile.id = mapTile.id;
                        tile.kind = mapTile.kind;
                        tile.x = x;
                        tile.y = y;
                        let ascii: string;
                        if (mapTile.IsVisible()) {
                            ascii = this.game.dungeon.GetTileAscii(x, y);
                        } else if (mapTile.IsRevealed()) {
                            ascii = this.game.dungeon.GetBaseAscii(x, y);
                        }

                        if (ascii != " " && ascii != "") {
                            tile.ascii = ascii;
                        }
                        tile.flags = mapTile.flags;

                        if (!ObjectUtil.shallowEqual(tile, mapTile.$ObjectCache) || mapTile.$forceUpdate) {
                            mapTile.$forceUpdate = false;
                            mapTile.$ObjectCache = tile;
                            map.tiles.push(tile);
                        }
                    }
                }
            }
        }
        msg.ents = new Array();

        /**
         * Map Entity Updates
         */
        for (let e: number = 0; e < this.game.data.entities.length; e++) {
            let ent: Entity = this.game.data.entities[e];
            if (FlagUtil.IsSet(ent.flags, GlobalConst.ENTITY_FLAGS.IS_HIDDEN)) {
                //Do not include hidden entities.
            } else if (ent instanceof Item && ent.mapEntity != null) {
                let itemTile: MapTile | null = this.map.GetTileIfExists(ent.mapPos.x, ent.mapPos.y);
                if (itemTile != null && (itemTile.IsVisible() || itemTile.IsRevealed())) {
                    let item: M_Item = new Object() as M_Item;
                    item.cname = ent.cname;
                    item.kind = ent.kind;
                    item.x = ent.mapPos.x;
                    item.y = ent.mapPos.y;

                    item.rarity = ent.rarity;

                    item.flags = ent.flags;
                    item.id = ent.id;

                    if (!ObjectUtil.shallowEqual(item, ent.$ObjectCache)) {
                        ent.$ObjectCache = item;
                        msg.ents.push(item);
                    }
                }
            } else if (ent instanceof Dweller && ent.mapEntity != null) {
                let dweller: Dweller = ent as Dweller;
                let dwellerTile: MapTile | null = this.map.GetTileIfExists(ent.mapPos.x, ent.mapPos.y);
                if (dwellerTile != null && dwellerTile.IsVisible()) {
                    let dw: M_Dweller = new Object() as M_Dweller;
                    dw.cname = ent.cname;
                    dw.kind = ent.kind;
                    dw.x = ent.mapPos.x;
                    dw.y = ent.mapPos.y;
                    dw.flags = ent.flags;
                    dw.id = ent.id;
                    dw.name = dweller.name;
                    dw.hp = dweller.hp;
                    dw.maxhp = dweller.hpmax;
                    dw.level = dweller.level;
                    dw.phy = dweller.$data?.phylum;

                    if (
                        ConditionManager.instance.HasCondition(
                            this.game.dungeon.character,
                            GlobalConst.CONDITION.INSIGHT,
                        )
                    ) {
                        if (dweller.resistances.length > 0) {
                            dw.res = dweller.resistances.join(", ") + "";
                        }
                        if (dweller.vulnerabilities.length > 0) {
                            dw.vuln = dweller.vulnerabilities.join(", ") + "";
                        }
                        if (dweller.immunities.length > 0) {
                            dw.imm = dweller.immunities.join(", ") + "";
                        }
                        dw.dodge = dweller.dodge;
                        dw.block = dweller.block;
                        dw.def = dweller.defense;
                        dw.spec = dweller.$data?.special_attack_description;
                        let atk = dweller.$primaryAttack;
                        if (atk != null) {
                            dw.atk = atk.GetAttackDescription(dweller);
                        }
                    } else {
                        dw.atk = dweller.$data?.basic_attack.name;
                    }
                    /* SENDING VIS DWELLER EVERY TURN, optimize this later?
                    if (!ObjectUtil.shallowEqual(dw, ent.$ObjectCache)) {
                        ent.$ObjectCache = dw;

                    }

                     */
                    msg.ents.push(dw);
                }
            } else if (ent instanceof StoryEvent && ent.mapEntity != null) {
                //handle removal
                let storyEvent: StoryEvent = ent as StoryEvent;
                let tile: MapTile | null = this.map.GetTileIfExists(ent.mapPos.x, ent.mapPos.y);
                if (tile != null && tile.IsVisible()) {
                    let se: M_StoryEvent = new Object() as M_StoryEvent;
                    se.cname = "StoryEvent";
                    se.kind = ent.kind;
                    se.x = ent.mapPos.x;
                    se.y = ent.mapPos.y;
                    se.flags = ent.flags;
                    se.id = ent.id;
                    se.mgfx = storyEvent.GetMapGraphic();

                    if (!ObjectUtil.shallowEqual(se, ent.$ObjectCache)) {
                        ent.$ObjectCache = se;
                        msg.ents.push(se);
                    }
                }
            } else if (ent instanceof Merchant && ent.mapEntity != null) {
                let merch: Merchant = ent as Merchant;
                let tile: MapTile | null = this.map.GetTileIfExists(ent.mapPos.x, ent.mapPos.y);
                if (tile != null && tile.IsVisible()) {
                    let se: M_Merchant = new Object() as M_Merchant;
                    se.cname = "Merchant";
                    se.kind = ent.kind;
                    se.x = ent.mapPos.x;
                    se.y = ent.mapPos.y;
                    se.flags = ent.flags;
                    se.id = ent.id;
                    se.mgfx = merch.$data.mapGraphic;

                    if (!ObjectUtil.shallowEqual(se, ent.$ObjectCache)) {
                        ent.$ObjectCache = se;
                        msg.ents.push(se);
                    }
                }
            } else if (ent.mapEntity != null) {
                //generic entity
                let tile: MapTile | null = this.map.GetTileIfExists(ent.mapPos.x, ent.mapPos.y);
                let show = tile.IsVisible();
                if (FlagUtil.IsSet(ent.flags, GlobalConst.ENTITY_FLAGS.ALWAYS_VIS_AFTER_REVEAL) && tile.IsRevealed()) {
                    show = true;
                }
                if (tile != null && show) {
                    let se: M_Entity = new Object() as M_Entity;
                    se.cname = ent.cname;
                    se.kind = ent.kind;
                    se.x = ent.mapPos.x;
                    se.y = ent.mapPos.y;
                    se.flags = ent.flags;
                    se.id = ent.id;

                    if (!ObjectUtil.shallowEqual(se, ent.$ObjectCache)) {
                        ent.$ObjectCache = se;
                        msg.ents.push(se);
                    }
                }
            }
        }

        /**
         * Character Updates
         */
        let char: Character = this.game.dungeon.character;
        let charDataObject: M_Char = new Object() as M_Char;

        //TODO: Replace this with object.assign or objectutil.copy, no need to manually do all this.
        charDataObject.kind = char.cname;
        charDataObject.x = char.mapPos.x;
        charDataObject.y = char.mapPos.y;
        charDataObject.hp = char.hp;
        charDataObject.hpmax = char.hpmax;
        charDataObject.hunger = char.hunger;
        charDataObject.gold = char.gold;
        charDataObject.keys = char.keys;
        charDataObject.br = char.brawn;
        charDataObject.ag = char.agility;
        charDataObject.gu = char.guile;
        charDataObject.sp = char.spirit;
        charDataObject.def = char.defense;
        charDataObject.block = char.block;
        charDataObject.dodge = char.dodge;
        charDataObject.first_name = char.first_name;
        charDataObject.last_name = char.last_name;
        charDataObject.full_name = char.full_name;
        charDataObject.tokenId = char.tokenId;
        charDataObject.level = char.level;

        //We don't want to send whole object, so lets get a changed copy
        let charMessage: M_Char = char.CreateBaseMessageObject(charDataObject) as M_Char;
        charMessage.kind = char.cname;
        charMessage.x = char.mapPos.x; //these two always sent for character
        charMessage.y = char.mapPos.y;
        charMessage.level = char.level;
        // charMessage.cname = "Character";

        if (char.$traitsChanged) {
            char.$traitsChanged = false;
            charMessage.traits = char.GetTraitDescs();
            charMessage.skills = char.GetSkillsDescs();
        }

        if (char.$effectsChanged) {
            char.$effectsChanged = false;
            charMessage.effects = [];
            for (let e = 0; e < char.effects.length; e++) {
                let eff: M_Effect = new Object() as M_Effect;
                ObjectUtil.copyAllCommonPrimitiveValues(char.effects[e], eff, ["cname", "id", "source"]);
                if (char.effects[e].source.type == GlobalConst.SOURCE_TYPE.EQUIPMENT) {
                    eff.source = char.effects[e].source;
                }
                charMessage.effects.push(eff);
            }
        }

        if (char.$conditionsChanged) {
            char.$conditionsChanged = false;
            charMessage.conditions = [];
            for (let e = 0; e < char.conditions.length; e++) {
                let eff: M_Condition = new Object() as M_Condition;
                eff.desc = char.conditions[e].$data.desc;
                ObjectUtil.copyAllCommonPrimitiveValues(char.conditions[e], eff, ["cname", "id", "source"]);
                eff.sources = [];
                for (let s: number; s < char.conditions[e].sources.length; s++) {
                    if (char.conditions[e].sources[s].type == GlobalConst.SOURCE_TYPE.EQUIPMENT) {
                        eff.sources.push(char.conditions[e].sources[s]);
                    }
                }

                charMessage.conditions.push(eff);
            }
        }

        msg.ents.push(charMessage);
        this.game.dungeon.character.$ObjectCache = charDataObject;

        if (char.$inventoryChanged) {
            msg.inv = [];
            char.$inventoryChanged = false;
            for (let i = 0; i < this.game.dungeon.character.inventory.length; i++) {
                let invItem: InventoryItem = this.game.dungeon.character.inventory[i];

                let mItem: M_InventoryItem = new Object() as M_InventoryItem;

                mItem.name = invItem.item.name;
                ObjectUtil.copyAllCommonPrimitiveValues(invItem, mItem, ["cname"]);
                ObjectUtil.copyAllCommonPrimitiveValues(invItem.item, mItem, ["cname"]);
                mItem.id = invItem.item.id; //make sure we use item id, not inventory item id
                mItem.effects = [];
                for (let e = 0; e < invItem.item.effects.length; e++) {
                    let eff: M_Effect = new Object() as M_Effect;
                    ObjectUtil.copyAllCommonPrimitiveValues(invItem.item.effects[e], eff, ["cname", "id", "source"]);

                    mItem.effects.push(eff);
                }
                msg.inv.push(mItem);
            }
        }

        /**
         * Message System
         */
        if (this.game.dungeon.HasTurnEvents()) {
            msg.turnEvents = this.game.dungeon.GetTurnEvents();
        }

        //console.log("CLIENT UPDATE : " + JSON.stringify(msg));
        return msg;
    }

    //#region ClientUpdates
}
