import { GameScene } from "../GameScene";
import TurnAttackGroup from "./turnAttackGroup";
import { EntityLiving } from "../entities/EntityLiving";
import TurnAttackGroupResult from "./turnAttackGroupResult";
import { M_TurnEvent_AttackResult, M_TurnEventAttackStep } from "../../../types/globalTypes";
import { GameMapTile } from "../map/GameMapTile";
import EntityManager from "../entities/EntityManager";
import FlagUtil from "../../../util/flagUtil";
import GlobalConst from "../../../types/globalConst";
import TurnEventPlayerDead from "./turnEventPlayerDead";
import TurnEventDwellerDead from "./turnEventDwellerDead";

export default class TurnAttackGroupStep {
    group: TurnAttackGroup;
    gameScene: GameScene;
    results: TurnAttackGroupResult[];

    defender: EntityLiving;
    defenderName: string;
    tile: GameMapTile;
    hitRoll: number;
    hitBonus: number;
    defense: number;
    isMiss: boolean = false;
    isPointBlank: boolean = false;
    isDodged: boolean = false;
    isBlocked: boolean = false;
    isCrit: boolean = false;
    targetId: number = -1;
    killedTarget: boolean = false;
    deathEvent: TurnEventPlayerDead | TurnEventDwellerDead;

    public defenderIsPlayer(): boolean {
        return this.defender == this.gameScene.player ? true : false;
    }
    constructor(gameScene: GameScene, parentGroup: TurnAttackGroup, stepEvent: M_TurnEventAttackStep) {
        this.gameScene = gameScene;
        this.group = parentGroup;
        this.results = [];

        this.defenderName = stepEvent.targetName;
        this.tile = this.gameScene.map.GetTile(stepEvent.tile.x, stepEvent.tile.y);
        this.hitBonus = stepEvent.hitBonus;
        this.hitRoll = stepEvent.hitRoll;
        this.defense = stepEvent.defense;
        this.targetId = stepEvent.targetId;

        if (stepEvent.dwellerKind != undefined && stepEvent.targetId > 0) {
            this.defender = EntityManager.instance.GetOrCreateDweller(
                stepEvent.targetId,
                stepEvent.dwellerKind,
                this.defenderName,
            );
        } else {
            this.defender = this.gameScene.player;
        }
        if (this.defender.tile.x != this.tile.x && this.defender.tile.y != this.tile.y) {
            console.log("Defender not in correct tile for attack, moving");
            this.defender.MoveTo(this.tile);
        }

        if (FlagUtil.IsSet(stepEvent.flags, GlobalConst.ATTACK_FLAGS.POINT_BLANK_PENALTY)) {
            this.isPointBlank = true;
        }
        if (FlagUtil.IsSet(stepEvent.flags, GlobalConst.ATTACK_FLAGS.MISSED)) {
            this.isMiss = true;
        }
        if (FlagUtil.IsSet(stepEvent.flags, GlobalConst.ATTACK_FLAGS.DODGED)) {
            this.isDodged = true;
        }
        if (FlagUtil.IsSet(stepEvent.flags, GlobalConst.ATTACK_FLAGS.BLOCKED)) {
            this.isBlocked = true;
        }
        if (FlagUtil.IsSet(stepEvent.flags, GlobalConst.ATTACK_FLAGS.CRIT)) {
            this.isCrit = true;
        }
    }

    addResult(res: M_TurnEvent_AttackResult) {
        this.results.push(new TurnAttackGroupResult(this.gameScene, this, res));
    }
}
