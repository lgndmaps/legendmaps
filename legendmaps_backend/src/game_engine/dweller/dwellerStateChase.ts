import Game from "../game";
import GlobalConst from "../types/globalConst";
import ArrayUtil from "../utils/arrayUtil";
import MapPos from "../utils/mapPos";
import CombatAttack from "../combat/combatAttack";
import Dweller from "./dweller";
import DwellerState from "./dwellerState";

/**
 * Chase state attempts to reach range for basic attack and attack
 */
export default class DwellerStateChase extends DwellerState {
    state_name: string = "chase";

    constructor(game: Game, dweller: Dweller) {
        super(game, dweller);
    }

    ChooseAction() {
        //   console.log(this.dweller.name + " is chasing");
        if (!this.dweller.CheckAcitonConditions()) {
            return;
        }

        if (this.dweller.$data.CheckSpecialAttack(this.dweller)) {
            //dweller did special attack, that function will handle feedback.
            return;
        }

        if (
            this.game.dungeon.IsFreeLinePathToTile(
                this.dweller.mapPos,
                this.game.dungeon.character.mapPos,
                this.dweller.$primaryAttack.range,
            )
        ) {
            let attack: CombatAttack = new CombatAttack(this.game, this.dweller, this.dweller.$primaryAttack);
            attack.AddTarget(this.game.dungeon.character);
            attack.doAttack();
            if (this.game.dungeon.character.skillIds.includes(10)) {
                //RIPOSTE
                let wpn = this.game.dungeon.character.GetActiveWeapon();
                let weaponRange = this.game.dungeon.character.GetActiveWeapon().GetRange();
                let dwellerRange = this.dweller.$primaryAttack.range;
                if (weaponRange == 1 && dwellerRange == 1) {
                    this.game.dungeon.AddMessageEvent("You riposte! ", [GlobalConst.MESSAGE_FLAGS.APPEND]);
                    let attack: CombatAttack = new CombatAttack(this.game, this.game.dungeon.character, wpn);
                    attack.AddTarget(this.dweller);
                    attack.doAttack();
                }
            }
        } else {
            if (this.dweller.$data?.speed == GlobalConst.DWELLER_SPEED.SLOW && this.game.data.turn % 2 != 0) {
                return; //slow dwellers only move on even turns
            }

            let repeatCount = this.dweller.$data?.speed == GlobalConst.DWELLER_SPEED.FAST ? 2 : 1;

            for (let i = 0; i < repeatCount; i++) {
                let path: MapPos[] = this.game.dungeon.FindPath(
                    this.dweller.mapPos,
                    this.game.dungeon.character.mapPos,
                    true,
                );

                if (path.length > 1) {
                    if (!this.dweller.CheckMovementConditions()) {
                        return;
                    }
                    this.AddMoveAction(path[1]);
                } else {
                    let tiles: MapPos[] = this.game.dungeon.GetWalkableNeighbors(this.dweller.mapEntity.pos, true);
                    if (tiles.length > 0) {
                        let foundTile: MapPos;
                        tiles = ArrayUtil.Shuffle(tiles);
                        this.AddMoveAction(tiles[0]);
                    }
                }
            }
        }
    }
}
