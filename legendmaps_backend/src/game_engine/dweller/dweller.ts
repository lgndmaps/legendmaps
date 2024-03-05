import type Game from "../game";
import MapEntity from "../map/mapEntity";
import { DwellerD, ItemD, M_TurnEvent_DwellerKilled, M_TurnEvent_Names } from "../types/globalTypes";
import FlagUtil from "../utils/flagUtil";
import DwellerData from "./data/DwellerData";
import DwellerFactory from "./dwellerFactory";
import DwellerState from "./dwellerState";
import DwellerStateWander from "./dwellerStateWander";
import DwellerStateChase from "./dwellerStateChase";
import DwellerStateDead from "./dwellerStateDead";
import GlobalConst from "../types/globalConst";
import RandomUtil from "../utils/randomUtil";

import EntityLiving from "../base_classes/entityLiving";
import DwellerAttack from "./dwellerAttack";
import ObjectUtil from "../utils/objectUtil";
import DwellerStateWait from "./dwellerStateWait";
import ConditionManager from "../effect/conditionManager";
import Item from "../item/item";
//TODO: status effect
//TODO: special attacks
//TODO: death drops

export default class Dweller extends EntityLiving implements DwellerD {
    kind: GlobalConst.DWELLER_KIND;
    level: number = 1;
    state_name: string = "";
    turnsSinceLastAction: number = 1;
    turnSpecialLastUsed: number = -100;
    boss: number = 0;
    carriedItem?: Item;
    //Dweller Attack class provides accessors for dweller data at current level for combat, always recreated on restore.
    $primaryAttack: DwellerAttack;
    $secondAttack: DwellerAttack;

    $state: DwellerState; //only state_name is saved, state object is rereferenced on load
    $data: DwellerData; //reference to dweller file in data/ with all dweller powers and stats, this must be reloaded on restore

    protected _immunities: GlobalConst.DAMAGE_TYPES[];
    protected _resistances: GlobalConst.DAMAGE_TYPES[];
    protected _vulnerabilities: GlobalConst.DAMAGE_TYPES[];

    constructor(game: Game, json: DwellerD | "" = "", kind: GlobalConst.DWELLER_KIND | "" = "", level: number = 1) {
        super(game, json);
        this.level = level;
        this.cname = GlobalConst.ENTITY_CNAME.DWELLER;

        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.IS_DWELLER_WALKABLE);
        this.flags = FlagUtil.UnSet(this.flags, GlobalConst.ENTITY_FLAGS.BLOCKS_VISION);

        if (json) {
            ObjectUtil.copyAllCommonPrimitiveValues(json, this);
            this.setState(json.state_name);
            this.$data = DwellerFactory.instance.GetDwellerData(this.kind);
            this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "⸘";
        } else {
            if (kind == "") {
                throw new Error("trying to construct dweller with no kind");
            }
            this.kind = kind;
            this.$data = DwellerFactory.instance.GetDwellerData(this.kind);

            this.setBaseHP(this.$data.level_hp[this.level]);
            this.mapEntity = new MapEntity(this.game);
            this.mapEntity.ascii = this.$data.ascii != undefined ? this.$data.ascii : "⸘";
        }

        this.$primaryAttack = new DwellerAttack(this.game, this, this.$data.basic_attack);
        this.$primaryAttack.name = this.$data.basic_attack.name;

        /*
        if (this.$data.special_attack !== undefined) {
            this.$secondAttack = new DwellerAttack(this, this.$data.special_attack);
        }
        */

        //now that we've got $data, do any other initial set up
        if (json) {
        } else {
            this.setState(this.$data.startingStateName);
        }
    }

    public Die(killerType: GlobalConst.DAMAGE_SOURCE, killerName: string) {
        if (this.state_name == "dead" || FlagUtil.IsSet(this.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL)) {
            console.log("Redundant dweller kill called on already dead dweller");
            return;
        }

        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.IS_DEAD); //Make sure this is set before we die to prevent recursive calls.
        this.$data.CheckSpecialOnDeath(this);

        this.$data.DropLoot(this, this.mapEntity.pos);

        //TODO: Might want visibility check on send here.
        let evt: M_TurnEvent_DwellerKilled = {
            id: this.id,
            kind: this.kind,
            name: this.name,
        };
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_KILLED, evt);

        this.setState("dead");
        this.mapEntity = null;
        this.flags = FlagUtil.Set(this.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL);

        this.game.data.stats.DwellerKilled(this.kind, this.level);

        //BOSS DWELLER SHOULD TRIGGER EXIT TO OPEN
        if (this.boss == 1) {
            this.game.data.map.exitTile.open();
            this.game.dungeon.AddFXEvent("The dungeon shakes as the exit opens!", GlobalConst.CLIENTFX.EXIT_OPEN, []);
        }
    }

    public GetBasicAttackMessage(isHit: boolean) {
        // console.log(JSON.stringify(this.$data.basic_attack));
        // console.log(this.$data.basic_attack.msg_hit.length);
        if (isHit) {
            return RandomUtil.instance.fromArray(this.$data.basic_attack.msg_hit);
        } else {
            return RandomUtil.instance.fromArray(this.$data.basic_attack.msg_miss);
        }
    }

    public get name(): string {
        if (this.$data.level_names[this.level].length > 18) {
            console.log("WARNING DWELLER NAME TOO LONG: " + this.$data.level_names[this.level].length);
        }
        return this.boss == 1 ? "[BOSS] " + this.$data.kind : this.$data.level_names[this.level];
    }

    public get alertness(): number {
        //  return GlobalConst.DWELLER_ALERT_LEVELS.LOW; -
        return this.$data.alertness;
    }

    public get defense(): number {
        return this.$data.level_def[this.level];
    }

    public get block(): number {
        return this.$data.level_block[this.level];
    }

    public get dodge(): number {
        return this.$data.level_dodge[this.level];
    }

    public get range(): number {
        return this.$data.basic_attack.range;
    }

    public get tohit(): number {
        return this.$data.basic_attack.level_to_hit[this.level];
    }

    public get damageBonusAdditive(): number {
        return 0;
    }

    public GetDamageBonusMultiplier(): number {
        return 1;
    }

    public get crit(): number {
        return this.$data.basic_attack.level_crit[this.level];
    }

    public setState(stateName: string) {
        let nextState: DwellerState;
        if (stateName == "wander") {
            nextState = new DwellerStateWander(this.game, this);
        } else if (stateName == "wait") {
            nextState = new DwellerStateWait(this.game, this);
        } else if (stateName == "chase") {
            nextState = new DwellerStateChase(this.game, this);
        } else if (stateName == "dead") {
            nextState = new DwellerStateDead(this.game, this);
        } else {
            throw new Error("Attmpt to set dweller to null state " + stateName);
        }
        if (this.$state != null) {
            this.$state.Exit();
        }
        this.state_name = nextState.state_name;
        this.$state = nextState;
        this.$state.Enter();
    }

    public CheckForSpecialAttack(): boolean {
        return false;
    }

    TurnClockStep() {
        this.turnsSinceLastAction++;

        if (
            (this.$data.speed == GlobalConst.DWELLER_SPEED.SLOW && this.turnsSinceLastAction >= 2) ||
            this.$data.speed != GlobalConst.DWELLER_SPEED.SLOW
        ) {
            this.$state.ChooseAction();
        }
        //Second move if VERY_FAST, or FAST and turn clock is even number
        if (
            this.$data.speed == GlobalConst.DWELLER_SPEED.VERY_FAST ||
            (this.$data.speed == GlobalConst.DWELLER_SPEED.FAST && this.game.data.turn % 2 == 0)
        ) {
            //TODO: This needs to leave a record of first action in game update
            this.$state.ChooseAction();
        }

        this.CheckTimed();
    }

    public CheckMovementConditions(): boolean {
        if (
            ConditionManager.instance.HasCondition(this, GlobalConst.CONDITION.HELD) ||
            ConditionManager.instance.HasCondition(this, GlobalConst.CONDITION.STUNNED)
        ) {
            this.game.dungeon.AddMessageEvent(this.name + " can not move!", [
                GlobalConst.MESSAGE_FLAGS.EMPHASIZE,
                GlobalConst.MESSAGE_FLAGS.DELAY_AFTER,
            ]);
            return false;
        }
        return true;
    }

    public CheckAcitonConditions(): boolean {
        if (ConditionManager.instance.HasCondition(this, GlobalConst.CONDITION.STUNNED)) {
            this.game.dungeon.AddMessageEvent(this.name + " is stunned & can not act.", [
                GlobalConst.MESSAGE_FLAGS.EMPHASIZE,
                GlobalConst.MESSAGE_FLAGS.DELAY_AFTER,
            ]);
            return false;
        }
        return true;
    }

    public get immunities(): GlobalConst.DAMAGE_TYPES[] {
        return this.$data.immunities;
    }

    public get resistances(): GlobalConst.DAMAGE_TYPES[] {
        return this.$data.resistances;
    }

    public get vulnerabilities(): GlobalConst.DAMAGE_TYPES[] {
        return this.$data.vulnerabilities;
    }
}
