import Game from "../game";
import { M_Dweller, M_TurnEvent_DwellerMove, M_TurnEvent_Names } from "../types/globalTypes";
import Dweller from "./dweller";
import { Mrpas } from "mrpas";
import MapPos from "../utils/mapPos";

export default class DwellerState {
    game: Game;
    dweller: Dweller;
    state_name: string = "";
    private fovCalc?: Mrpas; //FOV calculator
    private visMap: number[][]; //holds last calculated fov vision calculations

    constructor(game: Game, dweller: Dweller) {
        this.game = game;
        this.dweller = dweller;
        this.visMap = [];
    }

    Enter() {}

    ChooseAction() {}

    //This is used to keep visuals up to date during event log, "official" update will still be redundantly sent in end of turn character updates
    protected AddMoveAction(newTile: MapPos) {
        this.dweller.mapEntity.pos = newTile;
        //console.log("CHECKING DWELLER MAP POS TILE : " + JSON.stringify(this.dweller.mapPos));
        this.calculateFOV();
        if (this.game.dungeon.GetTileVisible(this.dweller.mapPos.x, this.dweller.mapPos.y)) {
            let dwellerUpdate: M_TurnEvent_DwellerMove = {
                id: this.dweller.id,
                kind: this.dweller.kind,
                name: this.dweller.name,
                x: this.dweller.mapPos.x,
                y: this.dweller.mapPos.y,
            };
            this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_MOVE, dwellerUpdate);
        }
    }

    protected calculateFOV() {
        if (this.dweller.mapPos.x < 0 || this.dweller.mapPos.y < 0) return; //I'm not spawned yet.
        if (this.fovCalc === undefined) {
            this.fovCalc = new Mrpas(100, 100, (x, y) => !this.game.dungeon.TileBlocksVision(x, y));
        }

        this.visMap = new Array(100).fill(0).map(() => new Array(100).fill(0));

        this.fovCalc.compute(
            this.dweller.mapPos.x,
            this.dweller.mapPos.y,
            8,
            (x, y) => this.GetTileVisible(x, y),
            (x, y) => this.SetTileVisible(x, y),
        );
    }

    SetTileVisible(x: number, y: number) {
        this.visMap[y][x] = 1;
    }

    GetTileVisible(x: number, y: number): boolean {
        if (
            this.visMap == undefined ||
            this.visMap.length <= y ||
            this.visMap[y] == undefined ||
            this.visMap[y].length <= x
        ) {
            //console log fov not calculated yet.
            this.calculateFOV();
        }
        if (
            this.visMap == undefined ||
            this.visMap.length < 1 ||
            this.visMap[y] == undefined ||
            this.visMap[y].length < 1
        ) {
            return false; //no vismap
        }
        return this.visMap[y][x] == 1;
    }

    protected CheckForChase(): boolean {
        if (this.game.dungeon.GetTileDistance(this.dweller.mapPos, this.game.dungeon.character.mapPos) > 10) {
            //optimization to ignore check if player really far away.

            return false;
        }
        //console.log(this.dweller.name + "Checking for chase...");
        if (this.dweller.hp < this.dweller.hpmax) {
            //console.log(this.dweller.name + " is injured, chasing");
            this.dweller.setState("chase");
            return true;
        }

        let playerTileVis: boolean = this.GetTileVisible(
            this.game.dungeon.character.mapPos.x,
            this.game.dungeon.character.mapPos.y,
        );

        let playerTileinAwareRange: boolean = this.game.dungeon.TileInEuclidianRange(
            this.dweller.mapPos,
            this.game.dungeon.character.mapPos,
            this.dweller.alertness,
        );

        //console.log("VIS CHECK: " + playerTileVis + " AWARE CHECK: " + playerTileinAwareRange);
        if (playerTileVis && playerTileinAwareRange) {
            this.dweller.setState("chase");
            return true;
        }
        return false;
    }

    Exit() {}
}
