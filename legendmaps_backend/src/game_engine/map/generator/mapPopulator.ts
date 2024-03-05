import MapPos from "../../utils/mapPos";
import Game from "../../game";
import RandomUtil from "../../utils/randomUtil";
import Item from "../../item/item";
import TreasureFactory from "../../item/itemgen/treasureFactory";
import DwellerFactory from "../../dweller/dwellerFactory";
import Dweller from "../../dweller/dweller";
import GlobalConst from "../../types/globalConst";
import WeaponFactory from "../../item/itemgen/weaponFactory";
import ArmorFactory from "../../item/itemgen/armorFactory";
import ConsumableFactory from "../../item/itemgen/consumableFactory";
import ItemGenCommon from "../../item/itemgen/itemGenCommon";
import StoryEvent from "../../story/storyEvent";
import JewelryFactory from "../../item/itemgen/jewelryFactory";
import MapRoom from "../mapRoom";
import type Entity from "../../base_classes/entity";
import MapPortal from "../mapPortal";
import GameConfig from "../../gameConfig";
import MapRect from "../../utils/mapRect";
import {ProbTable} from "../../utils/probTable";
import StoryEventFactory from "../../story/storyEventFactory";
import Trap from "../../trap/trap";
import TrapFactory from "../../trap/trapFactory";
import SpecialRoomFactory from "./data/specialrooms/SpecialRoomFactory";
import GameUtil from "../../utils/gameUtil";
import Merchant from "../../merchant/merchant";
import MerchantFactory from "../../merchant/merchantFactory";
import FlagUtil from "../../utils/flagUtil";
import * as Sentry from "@sentry/node";
import ArrayUtil from "../../utils/arrayUtil";
import MathUtil from "../../utils/mathUtil";

class MapPopulator {
    game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    PopulateMap(): void {
        let curMap = this.game.data.map;
        /*
        console.log("NFT MAP DATA for: " + curMap.mapname);
        console.log("Dwellers: " + curMap.dwellers);
        console.log("Traps: " + curMap.traps);
        console.log("Special Room: " + curMap.specialRoom);
        */
        //PROCESSING TESTING FIELDS
        for (let d = 0; d < GameConfig.TEST_DWELLERS.length; d++) {
            let dwell: Dweller = DwellerFactory.instance.CreateDweller(
                this.game,
                GameConfig.TEST_DWELLERS[d].dweller,
                GameConfig.TEST_DWELLERS[d].level,
            );
            console.log("TEST: Spawning test dweller: " + dwell.kind + " " + dwell.level);
            let t = this.game.dungeon.GetTileWalkable(new MapRect(7, 8, 3, 18));
            dwell.Spawn(t.x, t.y);
        }

        if (GameConfig.TEST_ALLEVENTS) {
            for (let key in GlobalConst.STORY_EVENT_KEYS) {
                if (!key.toLowerCase().includes("door")) {
                    let se: StoryEvent = StoryEventFactory.instance.CreateStoryEvent(
                        this.game,
                        GlobalConst.STORY_EVENT_KEYS[key],
                    );
                    let t = this.game.dungeon.GetTileWalkable(new MapRect(7, 1, 3, 18));
                    se.Spawn(t.x, t.y);
                } else {
                    console.log("DOOR!");
                }
            }

            for (let key in GlobalConst.MERCHANT_TYPES) {
                let m: Merchant = MerchantFactory.instance.CreateMerchant(this.game, GlobalConst.MERCHANT_TYPES[key]);
                let tile = this.game.dungeon.GetTileWalkable(new MapRect(7, 1, 3, 18));
                m.Spawn(tile.x, tile.y);
            }
        }

        for (let s = 0; s < GameConfig.TEST_STORYEVENTS.length; s++) {
            let se: StoryEvent = StoryEventFactory.instance.CreateStoryEvent(this.game, GameConfig.TEST_STORYEVENTS[s]);
            console.log("TEST: Spawning test story event: " + GameConfig.TEST_STORYEVENTS[s]);
            let t = this.game.dungeon.GetTileWalkable(new MapRect(7, 8, 3, 18));

            se.Spawn(t.x, t.y);
        }

        for (let s = 0; s < GameConfig.TEST_TRAPS.length; s++) {
            let t: Trap = TrapFactory.instance.CreateTrap(this.game, GameConfig.TEST_TRAPS[s]);

            let tile = this.game.dungeon.GetTileWalkable(new MapRect(7, 8, 3, 18));
            console.log("TEST: Spawning test trap: " + GameConfig.TEST_TRAPS[s] + " at " + tile.toStr());
            t.Spawn(tile.x, tile.y);
        }

        if (GameConfig.TEST_MERCHANTS != undefined && GameConfig.TEST_MERCHANTS.length > 0) {
            for (let i = 0; i < GameConfig.TEST_MERCHANTS.length; i++) {
                let m: Merchant = MerchantFactory.instance.CreateMerchant(this.game, GameConfig.TEST_MERCHANTS[i]);

                let tile = this.game.dungeon.GetTileWalkable(new MapRect(7, 8, 3, 18));
                console.log("TEST: Spawning test merchant: " + GameConfig.TEST_MERCHANTS[i] + " at " + tile);
                m.Spawn(tile.x, tile.y);
            }
        }

        // DELETE ME, JUST TESTING
        // let tile = this.game.dungeon.GetTileWalkable(new MapRect(7, 8, 3, 18));
        // ConsumableFactory.instance
        //     .CreatePotionByEnhancementId(
        //         this.game,
        //         GlobalConst.RARITY.UNCOMMON,
        //         2,
        //         GlobalConst.ITEM_ENHANCEMENTS.HEALING_MINOR,
        //     )
        //     .Spawn(tile.x, tile.y);

        // let tile2 = this.game.dungeon.GetTileWalkable(new MapRect(7, 8, 3, 18));
        // ConsumableFactory.instance
        //     .CreatePotionByEnhancementId(
        //         this.game,
        //         GlobalConst.RARITY.UNCOMMON,
        //         2,
        //         GlobalConst.ITEM_ENHANCEMENTS.HEALING_MINOR,
        //     )
        //     .Spawn(tile.x, tile.y);

        //END TEST FIELDS

        for (const map_item of curMap.items) {
            // console.log("description: " + map_item.description);
            // console.log("name: " + item.name);
            // console.log("objectIdentifier: " + item.objectIdentifier);
            // console.log("rarityString: " + item.rarityString);

            // 1. parse out item type/relevant data
            // Rarity
            let item_rarity: GlobalConst.RARITY = GameUtil.GetRarityFromString(map_item.rarityString);

            // Item type
            let item_type: GlobalConst.ITEM_BASE_TYPE = map_item.name as GlobalConst.ITEM_BASE_TYPE;
            //console.log("generating map item: " + map_item.description + "...");

            // 2. create item in random room

            let entity: Entity;
            if (map_item.name == "chest") {
                entity = ItemGenCommon.GenerateChest(this.game);
                let entityPos: MapPos = this.game.data.map.GetRandomWalkableAndNonBlockingTileInAnyRoom();
                entity.Spawn(entityPos.x, entityPos.y);
            } else {
                entity = ItemGenCommon.GenerateItem(this.game, item_type, item_rarity, curMap.cr);
                let entityPos: MapPos = curMap.GetRandomEmptyTileInAnyRoom();
                entity.Spawn(entityPos.x, entityPos.y);
            }


        }

        // Adding Story Events & Merchants
        let storyEventCount = RandomUtil.instance.int(1, 2);
        if (this.game.data.map.specialRoom != undefined && this.game.data.map.specialRoom) {
            storyEventCount--;
        }
        for (let i = 0; i < storyEventCount; i++) {
            let event = StoryEventFactory.instance.CreateRandomStoryEvent(this.game);
            let tile = this.game.data.map.GetRandomWalkableAndNonBlockingTileInAnyRoom();
            if (tile != null) {
                event.Spawn(tile.x, tile.y);
            } else {
                throw new Error("no tile found anywhere for story event");
            }
        }

        let merchantCount = RandomUtil.instance.int(1, 2);
        if (storyEventCount > 1) {
            merchantCount--;
            if (merchantCount < 1) {
                merchantCount = 1;
            }
        }
        for (let i = 0; i < merchantCount; i++) {
            let merch = MerchantFactory.instance.CreateRandomMerchant(this.game);
            let tile = this.game.data.map.GetRandomWalkableAndNonBlockingTileInAnyRoom();
            if (tile != null) {
                merch.Spawn(tile.x, tile.y);
            } else {
                throw new Error("no tile found anywhere for merchant");
            }
        }

        // Building list of possible dweller types (no types here to deal with string/enum issues).
        let requiredDwellerTypes: any[] = [];
        let dwellerTypes: any[] = [];
        let requiredCount: number = 0;
        let requiredIndex: number = 0;

        for (let i = 0; i < curMap.dwellers.length; i++) {
            console.log("curMap.dwellers[i]: " + JSON.stringify(curMap.dwellers[i]));
            let dwellerinfo: any = curMap.dwellers[i];
            let dwellername: any = dwellerinfo.name;
            dwellername = dwellername.replace(/\s/g, "");
            dwellername = dwellername.toLowerCase();

            if (dwellername == "bats") {
                dwellername = "giantbats";
            }

            if (dwellername == "gainsgoblin") {
                dwellername = "gainsgob";
            }

            if (dwellername == "gemlizard") {
                dwellername = "gem_lizard";
            }

            if (dwellername == "lostpunk") {
                //spawning lost punk event

                let event = StoryEventFactory.instance.CreateStoryEvent(
                    this.game,
                    GlobalConst.STORY_EVENT_KEYS.LOST_PUNK,
                );
                let tile = this.game.data.map.GetRandomWalkableAndNonBlockingTileInAnyRoom();
                if (tile != null) {
                    event.Spawn(tile.x, tile.y);
                } else {
                    throw new Error("no tile found anywhere for story event");
                }
            } else if (dwellername == "losttoad") {
                let event = StoryEventFactory.instance.CreateStoryEvent(
                    this.game,
                    GlobalConst.STORY_EVENT_KEYS.LOST_TOAD,
                );
                let tile = this.game.data.map.GetRandomWalkableAndNonBlockingTileInAnyRoom();
                if (tile != null) {
                    event.Spawn(tile.x, tile.y);
                } else {
                    throw new Error("no tile found anywhere for story event");
                }
            } else if (DwellerFactory.instance.CheckIfDwellerKindExists(dwellername)) {

                requiredDwellerTypes.push(dwellername);
            } else {
                Sentry.captureException(new Error("Unknown/unimplemented dweller type: " + dwellername));
            }
        }


        //shuffle rooms
        curMap.rooms = RandomUtil.instance.shuffleArray(curMap.rooms);

        //place doors
        let doorCount = RandomUtil.instance.int(2, 5);
        for (let i = 0; i < doorCount; i++) {
            let room = curMap.rooms[i];

            try {
                if (room == null || room.exits == null || room.exits.length == 0) {
                    continue;
                }
            } catch {
                continue;
            }

            let exits = RandomUtil.instance.shuffleArray(room.exits);

            let tile = null;
            for (let e = 0; e < exits.length; e++) {
                let maptile = curMap.GetTileIfExists(exits[e].x, exits[e].y);
                if (tile == null && maptile != null && !maptile.$event) {
                    tile = exits[e];
                }
            }
            if (tile != null) {
                let doorType: GlobalConst.STORY_EVENT_KEYS;
                let prob = RandomUtil.instance.int(1, 100);
                if (prob <= 60) {
                    doorType = GlobalConst.STORY_EVENT_KEYS.DOOR;
                } else if (prob < 85) {
                    doorType = GlobalConst.STORY_EVENT_KEYS.DOOR_MAGIC;
                } else {
                    doorType = GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V;
                }
                let event = StoryEventFactory.instance.CreateStoryEvent(this.game, doorType);
                event.Spawn(tile.x, tile.y);
            }
        }

        //reshuffle rooms
        curMap.rooms = RandomUtil.instance.shuffleArray(curMap.rooms);

        // loop through every room in the dungeon
        for (let r: number = 0; r < curMap.rooms.length; r++) {
            if (curMap.rooms[r].specialRoom != undefined) {
                let specData = SpecialRoomFactory.GetSpecialRoomByKind(curMap.rooms[r].specialRoom);
                specData.spawnContents(this.game, curMap.rooms[r]);
                continue;
            }
            let dwellerPos = curMap.rooms[r].GetRandomTileWalkable();
            if (dwellerPos != null) {
                if (!GameConfig.TEST_NODWELLERS) {
                    let dweller: Dweller;
                    if (requiredCount < 5) {
                        dweller = DwellerFactory.instance.CreateDweller(
                            this.game,
                            requiredDwellerTypes[requiredIndex],
                            curMap.cr - 1,
                        );
                        requiredIndex++;
                        if (requiredIndex >= requiredDwellerTypes.length) {
                            requiredIndex = 0;
                        }
                        requiredCount++;
                    } else {
                        dweller = DwellerFactory.instance.CreateRandomDweller(this.game, curMap.cr - 1);
                    }

                    dweller.Spawn(dwellerPos.x, dwellerPos.y);

                    const numberAppearing = dweller.$data.level_number_appearing[curMap.cr - 1];
                    // If more than one Dweller appears at CR level, spawn multiple
                    if (numberAppearing > 1) {
                        for (let i: number = 1; i < numberAppearing; i++) {
                            let targetTile = curMap.rooms[r].GetRandomTileWalkable();
                            if (targetTile != null) {
                                //only dupe if we can find a spot
                                const dwellerDupe: Dweller = DwellerFactory.instance.CreateDweller(
                                    this.game,
                                    dweller.$data.kind,
                                    curMap.cr - 1,
                                );

                                dwellerDupe.Spawn(targetTile.x, targetTile.y);
                            }
                        }
                    }
                }

                this.AddRandomItemToRoom(r);
            }
        }

        //TRAP SET UP
        let randomTrapCount = RandomUtil.instance.int(2, 3);
        let traps: GlobalConst.TRAP_TYPES[] = [];

        if (curMap.traps != null && curMap.traps.length > 0) {
            for (let i = 0; i < curMap.traps.length; i++) {
                let trapName: string = curMap.traps[i];
                //first trap in list gets doubled
                if (trapName == "pit") {
                    traps.push(GlobalConst.TRAP_TYPES.PIT);
                    if (i == 0) traps.push(GlobalConst.TRAP_TYPES.PIT);
                } else if (trapName == "web") {
                    traps.push(GlobalConst.TRAP_TYPES.WEB);
                    if (i == 0) traps.push(GlobalConst.TRAP_TYPES.WEB);
                } else if (trapName == "lightning") {
                    traps.push(GlobalConst.TRAP_TYPES.LIGHTNING);
                    if (i == 0) traps.push(GlobalConst.TRAP_TYPES.LIGHTNING);
                } else if (trapName == "spiked wall") {
                    traps.push(GlobalConst.TRAP_TYPES.SPIKED_WALL);
                    if (i == 0) traps.push(GlobalConst.TRAP_TYPES.SPIKED_WALL);
                } else if (trapName == "gas") {
                    traps.push(GlobalConst.TRAP_TYPES.GAS);
                    if (i == 0) traps.push(GlobalConst.TRAP_TYPES.GAS);
                } else {
                    console.log("UNKNOWN TRAP NAME:" + trapName);
                }
            }
            randomTrapCount = 2;
        }
        for (let i = 0; i < randomTrapCount; i++) {
            traps.push(RandomUtil.instance.fromEnum(GlobalConst.TRAP_TYPES));
        }

        let mapRect = this.game.data.map.GetRect();
        mapRect.origin.x = 15;
        mapRect.extents.x -= 15;

        for (let i = 0; i < traps.length; i++) {
            let tile: MapPos = this.game.dungeon.GetTileWalkable(mapRect); //TODO: Make trap placement smarter (favor room exits, halls, ignore special rooms)
            let t: Trap = TrapFactory.instance.CreateTrap(this.game, traps[i]);
            t.Spawn(tile.x, tile.y);
        }

        //PICKING ROOM FOR BOSS
        let furthestRoom: MapRoom = undefined;
        let dwellerPos: MapPos = undefined;
        let dist: number = -1;
        for (let r: number = 0; r < curMap.rooms.length; r++) {
            if (curMap.rooms[r].specialRoom == undefined) {
                //special room cant be boss room
                let d = curMap.rooms[r].GetCenter().distCardinal(curMap.entranceTile.mapPos);
                if (d > dist) {
                    let possiblePos = curMap.rooms[r].GetRandomTileWalkable();
                    if (possiblePos != null) {
                        dwellerPos = possiblePos;
                        furthestRoom = curMap.rooms[r];
                        dist = d;
                    } else {
                        console.log("room has no sapce");
                    }
                }
            }
        }

        //BOSS SPAWN
        let bossType = RandomUtil.instance.fromArray(requiredDwellerTypes);
        let boss: Dweller = DwellerFactory.instance.CreateDweller(this.game, bossType, curMap.cr);
        boss.setState("wait");
        boss.flags = FlagUtil.Set(boss.flags, GlobalConst.ENTITY_FLAGS.IS_BOSS);
        boss.setHPMax(Math.round(boss.hp * 1.4));
        boss.boss = 1;
        boss.Spawn(dwellerPos.x, dwellerPos.y);

        let p = furthestRoom.GetEmptyEastWall();
        //PLACING EXIT
        let exitPortal: MapPortal = new MapPortal(this.game);
        exitPortal.CreateAndSpawn(p.x, p.y, GlobalConst.SPECIAL_TILE_TYPE.EXIT);
        exitPortal.close();
        this.game.data.map.exitTile = exitPortal;
    }

    AddRandomItemToRoom(r: number) {
        let curMap = this.game.data.map;

        let itemPos: MapPos = curMap.rooms[r].GetRandomEmptyTileInside();
        if (itemPos == null) {
            return;
        }
        let item: Item | StoryEvent | Merchant;

        // for random items of unspecified rarity, choose a random rarity between 1 and maxRarity.
        let randomRarity: GlobalConst.RARITY = ItemGenCommon.GetRandomRarityByCR(curMap.cr);

        let roomContent: ProbTable<string> = new ProbTable<string>();
        roomContent.add("weapon", 50);
        roomContent.add("armor", 50);
        roomContent.add("keys", 35);
        roomContent.add("potion", 75);
        roomContent.add("food", 100);
        roomContent.add("treasure", 50);
        roomContent.add("scroll", 50);
        roomContent.add("jewelry", 25);
        roomContent.add("chest", 50);
        roomContent.add("empty", 175);

        let content: string = roomContent.roll();
        if (content == "chest") {
            itemPos = curMap.rooms[r].GetRandomTileWalkableAndNonBlocking();
            if (itemPos == null) {
                return;
            }
        }

        if (content == "weapon") {
            // Weapon
            item = WeaponFactory.instance.CreateRandomWeapon(this.game, randomRarity, curMap.cr);
        } else if (content == "armor") {
            // Armor
            item = ArmorFactory.instance.CreateRandomArmor(this.game, randomRarity, curMap.cr);
        } else if (content == "keys") {
            // Keys
            item = TreasureFactory.instance.CreateKeysbyRarity(this.game, randomRarity, curMap.cr);
        } else if (content == "potion") {
            //  Potion
            item = ConsumableFactory.instance.CreateRandomPotion(this.game, randomRarity, curMap.cr);
        } else if (content == "treasure") {
            // treasure
            item = TreasureFactory.instance.CreateRandomTreasure(this.game, randomRarity, curMap.cr);
        } else if (content == "food") {
            // Food
            item = ConsumableFactory.instance.CreateRandomFood(this.game, randomRarity, curMap.cr);
        } else if (content == "scroll") {
            // scroll
            item = ConsumableFactory.instance.CreateRandomScroll(this.game, randomRarity, curMap.cr);
        } else if (content == "jewelry") {
            // jewelry
            item = JewelryFactory.instance.CreateRandomJewelry(this.game, randomRarity, curMap.cr);
        } else if (content == "chest") {
            item = ItemGenCommon.GenerateChest(this.game);
        }
        if (item) {
            item.Spawn(itemPos.x, itemPos.y);
        }
    }
}

export default MapPopulator;
