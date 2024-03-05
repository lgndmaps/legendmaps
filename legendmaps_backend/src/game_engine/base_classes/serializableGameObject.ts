import type Game from "../game";
import { SaveObjectCoreD } from "../types/globalTypes";

/**
 * Provides a generic toJSON that
 * ignores any property starting with $
 */

export default abstract class SerializableGameObject {
    /**
     * $ObjectCache is a critical generic object
     * used for all client updates, it saves a copy
     * of any dynamic data since last update was sent
     *
     * $ObjectMessage is an ephemeral object that holds
     * diff data since last update.
     *
     */
    public $ObjectCache: Object = {};
    public $ObjectMessage: Object = {};

    id: number = 0;
    kind: string = ""; //unique string which identifies any object for lookups, not required
    cname: string = ""; //had to change this from "class" to avoid reserved word

    public game: Game;

    GetParentGame(): Game {
        return this.game;
    }

    ClearCached() {
        this.$ObjectCache = {};
    }

    //Compared value of key in current object and value in $ObjectCache, if changed adds that key  to passed in msgobj
    CreateBaseMessageObject(currentObject: Object): Object {
        this.$ObjectMessage = {};
        Object.entries(currentObject).forEach(([key1, value1]) => {
            if (
                typeof currentObject[key1] === "number" ||
                typeof currentObject[key1] === "string" ||
                typeof currentObject[key1] === "boolean"
            ) {
                // console.log(currentObject[key1] + " === " + this.$ObjectCache[key1] + " TEST: " + (currentObject[key1] != this.$ObjectCache[key1]))
                if (currentObject[key1] != this.$ObjectCache[key1]) {
                    this.$ObjectMessage[key1] = currentObject[key1];
                    // console.log("UPDATED OBJECT MSSSAGE TO " + this.$ObjectMessage[key1])
                }
            } else {
                //console.log("unsupported type in objected copy: " + typeof currentObject[key1]);
            }
        });

        if (Object.keys(this.$ObjectMessage).length > 0) {
            this.$ObjectMessage["kind"] = this.cname;
            this.$ObjectMessage["id"] = this.id;
        }
        return this.$ObjectMessage;
    }

    constructor(game: Game, json: SaveObjectCoreD | "" = "") {
        this.game = game;
        this.cname = this.constructor.name;
        this.kind = "";
        if (json) {
            const { id } = json;
            this.id = json.id;
            this.kind = json.kind;
        } else if (this.constructor.name != "GameData") {
            if (this.game.data != null) {
                this.id = this.game.data.GetNextId();
                // console.log("added item with id " + this.id);
            } else {
                //NOTE: Only occurs in local testing.
                this.id = 0;
            }
        }
    }

    GetId(): number {
        return this.id;
    }

    /**
     * Overrides toJSON, used for creating JSON object
     * for saving to database ONLY!
     * @returns JSON object
     */
    toJSON(): object {
        let json: any = {};

        Object.entries(this).forEach(([key, value]) => {
            let exclude: boolean = false;
            if (key.charAt(0) == "$") {
                exclude = true; //ignore properties starting with $
            } else if (value instanceof Object && value.constructor.name == "Game") {
                exclude = true; //ignore Game class (prevents recursion)
            }
            if (!exclude) {
                json[key] = value;
            }
        });

        return json;
    }

    /**
     * This is intended for save data, returns all details every time
     * @returns complete JSON
     */
    GetSaveJSON(): string {
        return JSON.stringify(this);
    }
}
