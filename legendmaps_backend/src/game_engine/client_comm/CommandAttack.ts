import Character from "../character/character";
import CombatAttack from "../combat/combatAttack";
import Dweller from "../dweller/dweller";
import type Game from "../game";
import MapTile from "../map/mapTile";
import Command from "./Command";
import FlagUtil from "../utils/flagUtil";
import GlobalConst from "../types/globalConst";
import EntityLiving from "../base_classes/entityLiving";
import ConditionManager from "../effect/conditionManager";
import RandomUtil from "../utils/randomUtil";
import MapUtil from "../utils/mapUtil";

export default class CommandAttack extends Command {
    private targetTile: MapTile;
    private char: Character;
    private invalidCommand: boolean = false;
    constructor(game: Game, x: number, y: number) {
        super(game);

        this.char = this.game.dungeon.character; //shorthand
        this.targetTile = this.game.data.map.GetTileIfExists(x, y);
    }

    Validate(): boolean {
        if (this.invalidCommand || !this.targetTile) {
            return false;
        }
        let weaponRange = this.char.GetActiveWeapon().GetRange();
        // validate target is in range
        // if weapon range is 1, and chebychev distance is > 1, target is out of range
        if (weaponRange == 1 && this.game.dungeon.GetTileDistance(this.char.mapPos, this.targetTile.pos) > 1) {
            return false;
        }
        // else if range > 1, use euclidian distance comparison
        if (weaponRange > 1) {
            if (!this.game.dungeon.TileInEuclidianRange(this.char.mapPos, this.targetTile.pos, weaponRange)) {
                return false;
            }
        }
        // passed all checks
        return true;
    }

    Execute() {
        super.Execute();

        if (ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.STUNNED)) {
            this.game.dungeon.AddMessageEvent("You are stunned.");
            return;
        }

        if (
            ConditionManager.instance.HasCondition(this.char, GlobalConst.CONDITION.CONFUSED) &&
            RandomUtil.instance.percentChance(50 - GlobalConst.GetGenericBagsBonus(this.char.guile) * 2)
        ) {
            this.game.dungeon.AddMessageEvent("You are confused & attack the empty air.");
            return;
        }

        let weaponRange = this.char.GetActiveWeapon().GetRange();

        let dwellerInTile: Dweller | null = this.game.dungeon.GetDwellerInTile(
            this.targetTile.pos.x,
            this.targetTile.pos.y,
        );

        if (dwellerInTile != null) {
            let wpn = this.game.dungeon.character.GetActiveWeapon();
            let attack: CombatAttack = new CombatAttack(this.game, this.game.dungeon.character, wpn);

            if (weaponRange > 1 && FlagUtil.IsSet(wpn.itemFlags, GlobalConst.ITEM_FLAGS.IS_BEAM)) {
                attack.flags = FlagUtil.Set(attack.flags, GlobalConst.ATTACK_FLAGS.IS_BEAM);
                let tiles = this.game.dungeon.GetAllTilesInLineThroughTile(
                    this.char.mapPos,
                    this.targetTile.pos,
                    weaponRange,
                );
                let reachedTarget: boolean = false;
                for (let t = 0; t < tiles.length; t++) {
                    let tile = this.game.data.map.GetTileIfExists(tiles[t].x, tiles[t].y);
                    if (tile == undefined || (tile.BlocksVision() && reachedTarget)) {
                        break; //hit a wall after target.
                    }
                    if (tiles[t].x == this.targetTile.pos.x && tiles[t].y == this.targetTile.pos.y) {
                        reachedTarget = true;
                    }
                    if (t != 0) {
                        let ents = this.game.dungeon.GetEntitiesInTile(tiles[t].x, tiles[t].y);
                        let added: boolean = false;
                        for (let e = 0; e < ents.length; e++) {
                            if (
                                ents[e].cname == GlobalConst.ENTITY_CNAME.DWELLER ||
                                ents[e].cname == GlobalConst.ENTITY_CNAME.CHARACTER
                            ) {
                                added = true;
                                attack.AddTarget(ents[e] as EntityLiving);
                            }
                        }
                        if (!added) {
                            attack.AddTile(tiles[t].x, tiles[t].y);
                        }
                    }
                }
            } else if (FlagUtil.IsSet(wpn.itemFlags, GlobalConst.ITEM_FLAGS.IS_AOE)) {
                attack.flags = FlagUtil.Set(attack.flags, GlobalConst.ATTACK_FLAGS.IS_AOE);
                throw new Error("AOE Only happens thru spell.");
            } else {
                attack.AddTarget(dwellerInTile);
            }

            attack.doAttack();
        } else {
            this.game.dungeon.AddMessageEvent("You seem to be attacking a dweller that isn't there.");
            this.duration = 0; //being nice, removing clock change
        }
    }
}
