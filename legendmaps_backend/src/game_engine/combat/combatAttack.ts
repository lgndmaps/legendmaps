import { DamageResult } from "../types/types";
import GlobalConst from "../types/globalConst";
import RandomUtil from "../utils/randomUtil";
import FlagUtil from "../utils/flagUtil";
import Item from "../item/item";
import Effect from "../effect/effect";
import CombatAttackResult from "./combatAttackResult";
import {
    M_Tile,
    M_TurnEvent_AttackResult,
    M_TurnEvent_Names,
    M_TurnEventAttackInit,
    MapPosD,
} from "../types/globalTypes";
import Dweller from "../dweller/dweller";
import Character from "../character/character";
import EntityLiving from "../base_classes/entityLiving";
import Game from "../game";
import ObjectUtil from "../utils/objectUtil";
import ConditionManager from "../effect/conditionManager";
import MapPos from "../utils/mapPos";
import CombatAttackStep from "./combatAttackStep";

export default class CombatAttack {
    game: Game;

    steps: CombatAttackStep[];
    attacker: EntityLiving;
    attackItem: Item;
    flags: number = 0;
    tiles: MapPos[];
    initEvent: M_TurnEventAttackInit;
    $initEventName: M_TurnEvent_Names.PLAYER_ATTACK | M_TurnEvent_Names.DWELLER_ATTACK;

    $damageSource: GlobalConst.DAMAGE_SOURCE;
    $damageSourceName: string = "";
    $isHit: boolean = false;

    constructor(game: Game, attacker: EntityLiving, attackItem: Item) {
        this.game = game;
        this.attackItem = attackItem;
        this.attacker = attacker;

        this.tiles = [];
        this.steps = [];
    }

    AddTarget(defender: EntityLiving) {
        let step = new CombatAttackStep(this.game, this, defender);
        this.steps.push(step);
        this.AddTile(defender.mapPos.x, defender.mapPos.y);
    }

    AddTile(tileX: number, tileY: number) {
        let found = false;
        for (let t = 0; t < this.tiles.length; t++) {
            if (this.tiles[t].x == tileX && this.tiles[t].y == tileY) {
                found = true;
            }
        }
        if (!found) {
            this.tiles.push(new MapPos(tileX, tileY));
        }
        if (this.tiles.length > 1) {
            this.flags = FlagUtil.Set(this.flags, GlobalConst.ATTACK_FLAGS.MULTITILE);
        }
    }

    doAttack(): void {
        this.initEvent = {
            attackerName: "",
            weaponName: "",
            weaponType: "",
            primaryDamageType: GlobalConst.DAMAGE_TYPES.BLADE,
            originTile: { x: -1, y: -1 },
        } as M_TurnEventAttackInit;

        this.initEvent.weaponName = this.attackItem.nameBase;
        this.initEvent.weaponType = this.attackItem.baseType;
        let damage = this.attackItem.GetFirstEffectByType(GlobalConst.EFFECT_TYPES.DAMAGE);
        if (damage != undefined && damage.damage_type != undefined) {
            this.initEvent.primaryDamageType = damage.damage_type;
        }

        this.initEvent.originTile.x = this.attacker.mapPos.x;
        this.initEvent.originTile.y = this.attacker.mapPos.y;
        this.initEvent.tiles = [];
        if (this.attacker instanceof Character) {
            this.initEvent.attackerName = "You";
            this.$initEventName = M_TurnEvent_Names.PLAYER_ATTACK;
            this.$damageSource = GlobalConst.DAMAGE_SOURCE.PLAYER;
        } else {
            this.initEvent.attackerId = this.attacker.id;
            this.initEvent.attackerName = this.attacker.name;
            this.initEvent.dwellerKind = this.attacker.kind;
            this.initEvent.weaponType = this.attackItem.baseTypeDweller;
            this.$initEventName = M_TurnEvent_Names.DWELLER_ATTACK;
            this.$damageSource = GlobalConst.DAMAGE_SOURCE.DWELLER;
            this.$damageSourceName = this.attacker.name;
        }
        if (this.tiles != null) {
            this.initEvent.tiles = [];
            for (let t = 0; t < this.tiles.length; t++) {
                this.initEvent.tiles.push(this.tiles[t]);
            }
        }
        ObjectUtil.copyAllCommonPrimitiveValues(this, this.initEvent);
        this.game.dungeon.AddTurnEvent(this.$initEventName, this.initEvent);

        for (let s = 0; s < this.steps.length; s++) {
            this.steps[s].doAttackStep();
        }
        this.game.dungeon.AddTurnEvent(M_TurnEvent_Names.ATTACK_COMPLETE, {});
    }
}
