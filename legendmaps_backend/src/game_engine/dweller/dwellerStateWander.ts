import Game from "../game";
import ArrayUtil from "../utils/arrayUtil";
import MapPos from "../utils/mapPos";
import RandomUtil from "../utils/randomUtil";
import Dweller from "./dweller";
import DwellerState from "./dwellerState";
import MapTile from "../map/mapTile";
import GlobalConst from "../types/globalConst";

export default class DwellerStateWander extends DwellerState {
    state_name: string = "wander";

    constructor(game: Game, dweller: Dweller) {
        super(game, dweller);
    }

    ChooseAction() {
        if (this.CheckForChase()) {
            return;
        }

        if (this.dweller.$data?.speed == GlobalConst.DWELLER_SPEED.SLOW && this.game.data.turn % 2 != 0) {
            return; //slow dwellers only move on even turns
        }

        let tiles: MapPos[] = this.game.dungeon.GetWalkableNeighbors(this.dweller.mapEntity.pos, true);
        if (tiles.length > 0) {
            let foundTile: MapPos;
            tiles = ArrayUtil.Shuffle(tiles);
            for (let i = 0; i < tiles.length; i++) {
                //dwellers dont wander into halls.
                if (foundTile == undefined && !this.game.data.map.GetTileBase(tiles[i].x, tiles[i].y).IsHall()) {
                    foundTile = tiles[i];
                }
            }
            if (foundTile) {
                if (!this.dweller.CheckMovementConditions()) {
                    return;
                }
                this.AddMoveAction(foundTile);
                this.CheckForChase(); //checking again for chase condition
            } else {
                //console.log("Dweller has nowhere to wander, only available tiles nearby are halls.");
            }
        } else {
            //console.log("Dweller has nowhere to wander, no walkable tiles nearby.");
        }
    }
}
