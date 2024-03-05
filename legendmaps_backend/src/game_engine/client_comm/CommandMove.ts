import Character from "../character/character";
import Entity from "../base_classes/entity";
import Item from "../item/item";
import type Game from "../game";
import GlobalConst from "../types/globalConst";
import { M_TurnEvent_Names, M_TurnEvent_PlayerMove } from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import MapPos from "../utils/mapPos";
import MapUtil from "../utils/mapUtil";
import Command from "./Command";
import ConditionManager from "../effect/conditionManager";
import Trap from "../trap/trap";
import SpecialRoomFactory from "../map/generator/data/specialrooms/SpecialRoomFactory";
import RandomUtil from "../utils/randomUtil";

export default class CommandMove extends Command {
    private dir: MapUtil.DIR;
    public targetTile: MapPos = new MapPos();
    private char: Character;
    private invalidCommand: boolean = false;
    constructor(game: Game, directionString: string) {
        super(game);

        if (directionString == MapUtil.DIR.NORTH) {
            this.dir = MapUtil.DIR.NORTH;
        } else if (directionString == MapUtil.DIR.NORTHEAST) {
            this.dir = MapUtil.DIR.NORTHEAST;
        } else if (directionString == MapUtil.DIR.EAST) {
            this.dir = MapUtil.DIR.EAST;
        } else if (directionString == MapUtil.DIR.SOUTHEAST) {
            this.dir = MapUtil.DIR.SOUTHEAST;
        } else if (directionString == MapUtil.DIR.SOUTH) {
            this.dir = MapUtil.DIR.SOUTH;
        } else if (directionString == MapUtil.DIR.SOUTHWEST) {
            this.dir = MapUtil.DIR.SOUTHWEST;
        } else if (directionString == MapUtil.DIR.WEST) {
            this.dir = MapUtil.DIR.WEST;
        } else if (directionString == MapUtil.DIR.NORTHWEST) {
            this.dir = MapUtil.DIR.NORTHWEST;
        } else {
            this.invalidCommand = true;
        }

        this.char = this.game.dungeon.character; //shorthand
        if (ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.CONFUSED)) {
            this.dir = RandomUtil.instance.fromEnum(MapUtil.DIR);
            game.dungeon.AddMessageEvent("You are confused & move in a random direction.");
        }
        let moveVec: MapPos = MapUtil.GetVectorFromDir(this.dir);
        this.targetTile = this.char.mapPos.AddMapPos(moveVec);
    }

    Validate(): boolean {
        if (!this.invalidCommand && MapUtil.DistBetween(this.char.mapPos, this.targetTile) == 1) {
            return true;
        } else {
            return false;
        }
    }

    Execute() {
        super.Execute();

        if (ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.STUNNED)) {
            this.game.dungeon.AddMessageEvent("You are stunned.");
            return;
        }

        if (this.char.mapEntity) {
            if (FlagUtil.IsSet(this.game.data.flags, GlobalConst.GAMESTATE_FLAGS.PLAYER_DEAD)) {
                //DEAD player cant move
                return;
            }

            if (ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.HELD)) {
                this.game.dungeon.AddMessageEvent("You are held in place and can not move!", [
                    GlobalConst.MESSAGE_FLAGS.EMPHASIZE,
                    GlobalConst.MESSAGE_FLAGS.DELAY_AFTER,
                ]);
                return;
            }

            //Special case to prevent walking back out into wilderness.
            if (this.targetTile.x < 7) {
                this.game.dungeon.AddMessageEvent("No turning back! Proceed through the entrance to the east.");
                this.duration = 0; //being nice, removing clock change
                return;
            }

            //Walkable tile means we are free to move.
            if (this.game.dungeon.TileIsWalkable(this.targetTile.x, this.targetTile.y)) {
                this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.PLAYER_MOVE, {
                    x: this.targetTile.x,
                    y: this.targetTile.y,
                } as M_TurnEvent_PlayerMove);

                this.char.mapEntity.pos = this.targetTile;

                //CHECKING FOR ITEMS
                this.game.dungeon.PickupItemsInTile(this.targetTile.x, this.targetTile.y);

                //CHECKING FOR HIDDEN EVENTS/TRAPS
                let traps: Array<Entity> = this.game.dungeon.GetEntitiesInTile(
                    this.char.mapPos.x,
                    this.char.mapPos.y,
                    0,
                    0,
                    GlobalConst.ENTITY_CNAME.TRAP,
                );
                if (traps.length > 1) {
                    throw new Error("multiple traps in single tile");
                } else if (traps.length == 1) {
                    //console.log("TRAP HIT: " + traps[0]);
                    let trap: Trap = traps[0] as Trap;
                    trap.Trigger(this.game);
                }

                //CHECKING FOR ROOM ENTER EVENTS
                let room = this.game.data.map.GetCurrentRoom(this.targetTile.x, this.targetTile.y);
                if (room != null && room.specialRoom != undefined && room.visited == 0) {
                    room.visited = 1;
                    this.game.dungeon.AddFXEvent(
                        SpecialRoomFactory.GetSpecialRoomByKind(room.specialRoom).introText,
                        GlobalConst.CLIENTFX.NONE,
                        [GlobalConst.MESSAGE_FLAGS.EMPHASIZE],
                    );
                }

                //CHECKING FOR ENTER/EXIT EVENTS
                if (
                    this.game.data.map.entranceTile.isOpen &&
                    this.char.mapPos.x == this.game.data.map.entranceTile.mapPos.x + 1 &&
                    Math.abs(this.char.mapPos.y - this.game.data.map.entranceTile.mapPos.y) <= 1
                ) {
                    this.game.data.map.entranceTile.close();
                    this.game.dungeon.AddFXEvent(
                        "The gate slams shut behind you. The only way out is through.",
                        GlobalConst.CLIENTFX.ENTER_DUNGEON,
                        [GlobalConst.MESSAGE_FLAGS.DELAY_AFTER],
                    );

                    this.game.data.flags = FlagUtil.Set(
                        this.game.data.flags,
                        GlobalConst.GAMESTATE_FLAGS.PLAYER_IN_DUNGEON,
                    );
                    return;
                } else if (
                    this.game.data.map.exitTile.isOpen &&
                    this.char.mapPos.equals(this.game.data.map.exitTile.mapPos.x, this.game.data.map.exitTile.mapPos.y)
                ) {
                    this.game.dungeon.character.Escape();
                    return;
                }

                //CHECKING FOR ENTRANCE FLAVOR MESSAGES
                if (FlagUtil.IsNotSet(this.game.data.flags, GlobalConst.GAMESTATE_FLAGS.PLAYER_IN_DUNGEON)) {
                    //We're outside, add color messages
                    let t: number = this.game.data.turn;
                    if (t == 1) {
                        this.game.dungeon.AddMessageEvent(
                            "Welcome Adventurer! {Map Token ID: " + this.game.data.tokenId + "}",
                        );
                    } else if (t == 3) {
                        this.game.dungeon.AddMessageEvent("You approach " + this.game.data.map.mapname);
                    } else if (t == 4) {
                        if (this.game.data.map.biome.name == "forest") {
                            this.game.dungeon.AddMessageEvent("Dead leaves crunch beneath your feet...");
                        } else if (this.game.data.map.biome.name == "mountains") {
                            this.game.dungeon.AddMessageEvent("The sun begins to set behind the mountain peaks...");
                        } else if (this.game.data.map.biome.name == "grasslands") {
                            this.game.dungeon.AddMessageEvent("The tall grasses shiver in the breeze...");
                        } else if (this.game.data.map.biome.name == "graveyard") {
                            this.game.dungeon.AddMessageEvent("You pick your way past ancient graves...");
                        } else if (this.game.data.map.biome.name == "hells") {
                            this.game.dungeon.AddMessageEvent("You hear the plaintive howling of a distant beast...");
                        } else if (this.game.data.map.biome.name == "desert") {
                            this.game.dungeon.AddMessageEvent("Your feet sink into the hot sand...");
                        } else if (this.game.data.map.biome.name == "ice") {
                            this.game.dungeon.AddMessageEvent("The winds howl through the frost covered trees...");
                        } else if (this.game.data.map.biome.name == "volcano") {
                            this.game.dungeon.AddMessageEvent("The sulfurous air stings your lungs...");
                        }
                    } else if (t == 5) {
                        this.game.dungeon.AddMessageEvent(
                            "The " + this.game.data.map.wall.name + " walls loom before you...",
                        );
                    }
                }
            } else {
                this.game.dungeon.AddMessageEvent("You walk into a wall. It refuses to move.");
                if (!ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.CONFUSED)) {
                    this.duration = 0; //being nice, removing clock change
                }
            }
        }
    }
}
