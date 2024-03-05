import GlobalConst from "../../../../types/globalConst";
import MapPos from "../../../../utils/mapPos";
import { DwellerSpawn, ItemSpawn, StoryEventSpawn, TrapSpawn } from "./SpecialSpawns";
import Game from "../../../../game";
import MapRoom from "../../../mapRoom";
import Trap from "../../../../trap/trap";
import TrapFactory from "../../../../trap/trapFactory";
import ItemGenCommon from "../../../../item/itemgen/itemGenCommon";
import StoryEventFactory from "../../../../story/storyEventFactory";
import DwellerFactory from "../../../../dweller/dwellerFactory";
import GameUtil from "../../../../utils/gameUtil";
import RandomUtil from "../../../../utils/randomUtil";

export default class SpecialRoomData {
    public introText: string = "You enter a special room...";
    public map: string[];
    public traps: TrapSpawn[];
    public dwellers: DwellerSpawn[];
    public items: ItemSpawn[];
    public storyEvents: StoryEventSpawn[];

    private spawnSpots: MapPos[];
    public tildeIsLava: boolean = false;

    public kind: GlobalConst.SPECIAL_ROOM;
    constructor(roomKind: GlobalConst.SPECIAL_ROOM) {
        this.kind = roomKind;
        this.spawnSpots = new Array(10);
    }

    getSpawnSpot(spot: number): MapPos {
        let pos: MapPos = this.spawnSpots[spot];
        if (pos == undefined) {
            throw new Error("Special room does not have needed spot defined " + spot);
        }
        return pos;
    }

    spawnContents(game: Game, room: MapRoom) {
        //Build spawn spot array
        for (let y = 0; y < this.map.length; y++) {
            let row: string[] = this.map[y].split("");
            for (let x = 0; x < row.length; x++) {
                if (row[x] != " " && row[x] != "" && !isNaN(Number(row[x]))) {
                    this.spawnSpots[Number(row[x])] = new MapPos(room.rect.origin.x + x, room.rect.origin.y + y);
                }
            }
        }

        //loop thru all object types, place any tied to a spot
        for (let i = 0; i < this.traps.length; i++) {
            if (this.traps[i].spot != undefined) {
                let t: Trap = TrapFactory.instance.CreateTrap(game, this.traps[i].type);
                let pos: MapPos = this.getSpawnSpot(this.traps[i].spot);
                t.Spawn(pos.x, pos.y);
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].spot != undefined) {
                let rarity: GlobalConst.RARITY = this.items[i].rarity;
                if (rarity == undefined) {
                    rarity = this.GetItemRarityInNFTData(game, this.items[i].type);
                }
                let it = ItemGenCommon.GenerateItem(game, this.items[i].type, rarity, game.data.map.cr);
                let pos: MapPos = this.getSpawnSpot(this.items[i].spot);
                it.Spawn(pos.x, pos.y);
            }
        }

        for (let i = 0; i < this.storyEvents.length; i++) {
            if (this.storyEvents[i].spot != undefined) {
                let st = StoryEventFactory.instance.CreateStoryEvent(game, this.storyEvents[i].type);
                let pos: MapPos = this.getSpawnSpot(this.storyEvents[i].spot);
                st.Spawn(pos.x, pos.y);
            }
        }

        for (let i = 0; i < this.dwellers.length; i++) {
            if (this.dwellers[i].spot != undefined) {
                let dw = DwellerFactory.instance.CreateDweller(game, this.dwellers[i].type, game.data.map.cr);
                let pos: MapPos = this.getSpawnSpot(this.dwellers[i].spot);
                dw.Spawn(pos.x, pos.y);
            }
        }

        //loop thru all object types AGAIN, place any without spot //TODO: Could clear redundancy here, but need to makre sure spot placed ones go FIRST
        for (let i = 0; i < this.traps.length; i++) {
            if (this.traps[i].spot == undefined) {
                let t: Trap = TrapFactory.instance.CreateTrap(game, this.traps[i].type);
                let pos: MapPos = room.GetRandomEmptyTileInside();
                t.Spawn(pos.x, pos.y);
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].spot == undefined) {
                let rarity: GlobalConst.RARITY = this.items[i].rarity;
                if (rarity == undefined) {
                    rarity = this.GetItemRarityInNFTData(game, this.items[i].type);
                }
                let it = ItemGenCommon.GenerateItem(game, this.items[i].type, rarity, game.data.map.cr);
                let pos: MapPos = room.GetRandomEmptyTileInside();
                it.Spawn(pos.x, pos.y);
            }
        }

        for (let i = 0; i < this.storyEvents.length; i++) {
            if (this.storyEvents[i].spot == undefined) {
                let st = StoryEventFactory.instance.CreateStoryEvent(game, this.storyEvents[i].type);
                let pos: MapPos = room.GetRandomEmptyTileInside();
                st.Spawn(pos.x, pos.y);
            }
        }

        for (let i = 0; i < this.dwellers.length; i++) {
            if (this.dwellers[i].spot == undefined) {
                let dw = DwellerFactory.instance.CreateDweller(game, this.dwellers[i].type, game.data.map.cr);
                let pos: MapPos = room.GetRandomTileWalkable();
                dw.Spawn(pos.x, pos.y);
            }
        }
    }

    private GetItemRarityInNFTData(game: Game, itemType: GlobalConst.ITEM_BASE_TYPE) {
        for (let i = 0; i < game.data.map.items.length; i++) {
            let type = game.data.map.items[i].name as GlobalConst.ITEM_BASE_TYPE;
            if (type == itemType) {
                let r = GameUtil.GetRarityFromString(game.data.map.items[i].rarityString);
                return r;
            }
        }
        return GameUtil.GetRarityFromNumber(RandomUtil.instance.int(2, 4));
    }

    GetFootPrint(): MapPos {
        if (this.map == undefined || this.map.length == 0 || this.map[0] == undefined) {
            throw new Error("trying to get footprint of special room that isnt loaded");
        }

        let extX: number = 0;
        let extY: number = 0;

        for (let y = 0; y < this.map.length; y++) {
            let row: string[] = this.map[y].split("");
            for (let x = 0; x < row.length; x++) {
                if (row[x] != " " && row[x] != "") {
                    if (x > extX) extX = x;
                    if (y > extY) extY = y;
                }
            }
        }

        return new MapPos(extX, extY);
    }
}
