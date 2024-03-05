import Game from "../game";
import ArrayUtil from "../utils/arrayUtil";
import MapPos from "../utils/mapPos";
import RandomUtil from "../utils/randomUtil";
import Dweller from "./dweller";
import DwellerState from "./dwellerState";

export default class DwellerStateDead extends DwellerState {
    state_name: string = "dead";

    constructor(game: Game, dweller: Dweller) {
        super(game, dweller);
    }

    ChooseAction() {
        //dead don't do much!
    }
}
