import Game from "../game";
import ArrayUtil from "../utils/arrayUtil";
import MapPos from "../utils/mapPos";
import RandomUtil from "../utils/randomUtil";
import Dweller from "./dweller";
import DwellerState from "./dwellerState";

export default class DwellerStateWait extends DwellerState {
    state_name: string = "wait";

    constructor(game: Game, dweller: Dweller) {
        super(game, dweller);
    }

    ChooseAction() {
        if (this.CheckForChase()) {
            return;
        }
    }
}
