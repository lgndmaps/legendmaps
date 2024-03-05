import {GameScene} from "../GameScene";
import TurnAttackGroup from "./turnAttackGroup";
import {EntityLiving} from "../entities/EntityLiving";
import {MapTile} from "../../../../types/metaMapTypes";
import TurnAttackGroupStep from "./turnAttackGroupStep";
import {M_TurnEvent_AttackResult} from "../../../types/globalTypes";

export default class TurnAttackGroupResult {
    group:TurnAttackGroup;
    step:TurnAttackGroupStep;
    gameScene:GameScene;
    attackResult:M_TurnEvent_AttackResult;

    
    constructor(gameScene:GameScene, parentStep:TurnAttackGroupStep, res:M_TurnEvent_AttackResult) {
        this.gameScene = gameScene;
        this.step = parentStep;
        this.group = parentStep.group;
        this.attackResult = res;
    }




}