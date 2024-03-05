import MapObject from "./mapObject";
import SerializableGameObject from "./serializableGameObject";
import Game from "../game";
import { EntityD, MapEntityD } from "../types/globalTypes";
import MapEntity from "../map/mapEntity";
import MapPos from "../utils/mapPos";
import FlagUtil from "../utils/flagUtil";

/**
 * Entities are ANY dynamic object that exists
 * in the game world/dungeon. They may have an associated mapEntity,
 * if they are currently present in the dungeon (e.g. an item when picked
 * up no longer has a mapEntity, even though it still exists.)
 */
abstract class Entity extends SerializableGameObject implements EntityD {
    flags: number = 0;
    mapEntity?: MapEntity;

    constructor(game: Game, json: EntityD | "" = "") {
        super(game, json);
        game.data.AddEntity(this); //new or loaded, always need to be in the dungeon
        if (json) {
            this.flags = json.flags;
            if (json.mapEntity != null) {
                this.mapEntity = new MapEntity(this.game, json.mapEntity);
            }
        }
    }

    //returns map character position (If exists)
    get mapPos(): MapPos {
        if (this.mapEntity == null) {
            throw new Error("Trying to get Map Position for Entity " + this.cname + " that is not on Map");
            return new MapPos();
        } else {
            return this.mapEntity.pos;
        }
    }

    //Removes character from map, but character remains refernced
    DeSpawn() {
        this.mapEntity = null;
    }

    //Currently called only from dungeon, Called when an character is created/placed on map
    Spawn(x: number, y: number) {
        if (this.mapEntity != null && this.mapEntity.isPlaced()) {
            throw new Error("Entity already spawned");
        }
        if (this.mapEntity == null) {
            this.mapEntity = new MapEntity(this.game);
        }
        this.mapEntity.pos = new MapPos(x, y);
    }

    //Called by dungeon any time turn clock advances by 1
    TurnClockStep(current_turn: number) {}
}

export default Entity;
