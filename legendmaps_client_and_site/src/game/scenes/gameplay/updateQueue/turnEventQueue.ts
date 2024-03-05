import {
    M_TurnEvent_AttackResult,
    M_TurnEvent_Names,
    M_TurnEvent_Param,
    M_TurnEvent_UseItem,
    M_TurnEventAttackInit,
    M_TurnEventAttackStep,
} from "../../../types/globalTypes";
import TurnEvent from "./turnEvent";
import TurnEventMessage from "./turnEventMessage";
import { GameScene } from "../GameScene";
import TurnEventStoryOutcome from "./turnEventStoryOutcome";
import TurnEventStoryKickoff from "./turnEventStoryKickoff";
import TurnEventEffectTick from "./turnEventEffectTick";
import TurnEventDwellerDead from "./turnEventDwellerDead";
import TurnEventPlayerDead from "./turnEventPlayerDead";
import TurnEventUseItem from "./turnEventUseItem";
import TurnEventPlayerMove from "./turnEventPlayerMove";
import TurnEventDwellerMove from "./turnEventDwellerMove";
import TurnEventDwellerSpecial from "./turnEventDwellerSpecial";
import TurnEventFx from "./turnEventFx";
import TurnEventInstantPickup from "./turnEventInstantPickup";
import TurnEventPlayerEscape from "./turnEventPlayerEscape";
import TurnEventTrapTrigger from "./turnEventTrapTrigger";
import TurnAttackGroup from "./turnAttackGroup";
import TurnEventMerchantStart from "./turnEventMerchantStart";
import TurnEventMerchantUpdate from "./turnEventMerchantUpdate";

/**
 * Organized version of the turn events sent
 * from server on a particular turn.
 */
export default class TurnEventQueue {
    queue: TurnEvent[] = [];
    gameScene: GameScene;
    public activeAttackGroup: TurnAttackGroup;
    public activeItemUse: TurnEventUseItem;

    constructor(gameScene: GameScene) {
        this.queue = [];
        this.gameScene = gameScene;
    }

    clear() {
        this.activeAttackGroup = null;
        this.queue = [];
    }

    add(mName: M_TurnEvent_Names, mTurnEventParam: M_TurnEvent_Param) {
        let evt: TurnEvent;
        let skipAddingEvent: boolean = false;

        if (mName == M_TurnEvent_Names.USED_ITEM_COMPLETE) {
            this.activeItemUse.AddClose(mTurnEventParam as M_TurnEvent_UseItem);
            evt = this.activeItemUse;
            this.activeItemUse = null;
        } else if (mName == M_TurnEvent_Names.USED_ITEM) {
            this.activeItemUse = new TurnEventUseItem(this.gameScene, mName, mTurnEventParam);
            skipAddingEvent = true;
        } else if (mName == M_TurnEvent_Names.PLAYER_ATTACK || mName == M_TurnEvent_Names.DWELLER_ATTACK) {
            this.gameScene.ui.ForceCloseCharSheetIfOpen();
            if (this.activeAttackGroup == null) {
                evt = this.activeAttackGroup = new TurnAttackGroup(
                    this.gameScene,
                    mName,
                    mTurnEventParam as M_TurnEventAttackInit,
                );
            } else {
                this.activeAttackGroup.addInit(mName, mTurnEventParam as M_TurnEventAttackInit);
                skipAddingEvent = true;
            }
        } else if (mName == M_TurnEvent_Names.ATTACK_STEP) {
            this.gameScene.ui.ForceCloseCharSheetIfOpen();
            if (this.activeAttackGroup == null) {
                throw new Error("Attack step sent with no init");
            }
            this.activeAttackGroup.addStep(mTurnEventParam as M_TurnEventAttackStep);
            skipAddingEvent = true;
        } else if (mName == M_TurnEvent_Names.ATTACK_RESULT) {
            if (this.activeAttackGroup == null) {
                throw new Error("Attack result sent with no init");
            }
            this.activeAttackGroup.addResult(mTurnEventParam as M_TurnEvent_AttackResult);
            skipAddingEvent = true;
        } else if (mName == M_TurnEvent_Names.ATTACK_COMPLETE) {
            this.gameScene.ui.ForceCloseCharSheetIfOpen();
            if (this.activeAttackGroup == null) {
                //throw new Error("Attack complete sent with no init");
                //console.log("Attack complete, but previously closed");//ok situation due to dweller death effects
            } else {
                this.activeAttackGroup.isClosed = true;
                this.activeAttackGroup = null;
            }

            skipAddingEvent = true;
        } else if (mName == M_TurnEvent_Names.MESSAGE) {
            evt = new TurnEventMessage(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.FX) {
            evt = new TurnEventFx(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.MERCHANT_START) {
            evt = new TurnEventMerchantStart(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.MERCHANT_UPDATE) {
            evt = new TurnEventMerchantUpdate(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.STORY_EVENT_KICKOFF) {
            evt = new TurnEventStoryKickoff(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.TRAP_TRIGGER) {
            evt = new TurnEventTrapTrigger(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.STORY_EVENT_OUTCOME) {
            evt = new TurnEventStoryOutcome(this.gameScene, mName, mTurnEventParam);
        } else if (
            mName == M_TurnEvent_Names.PLAYER_HP_EFFECT_TICK ||
            mName == M_TurnEvent_Names.DWELLER_HP_EFFECT_TICK
        ) {
            evt = new TurnEventEffectTick(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.DWELLER_KILLED) {
            let death = new TurnEventDwellerDead(this.gameScene, mName, mTurnEventParam);
            if (this.activeAttackGroup != null) {
                this.activeAttackGroup.addDwellerDeath(death);
                skipAddingEvent = true;
            } else {
                evt = death;
            }
        } else if (mName == M_TurnEvent_Names.PLAYER_DEAD) {
            let death = new TurnEventPlayerDead(this.gameScene, mName, mTurnEventParam);
            if (this.activeAttackGroup != null) {
                this.activeAttackGroup.addPlayerDeath(death);
                skipAddingEvent = true;
            } else {
                evt = death;
            }
        } else if (mName == M_TurnEvent_Names.PLAYER_EXIT) {
            evt = new TurnEventPlayerEscape(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.PLAYER_MOVE) {
            evt = new TurnEventPlayerMove(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.DWELLER_MOVE) {
            evt = new TurnEventDwellerMove(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.GOLD_PICKUP || mName == M_TurnEvent_Names.KEY_PICKUP) {
            evt = new TurnEventInstantPickup(this.gameScene, mName, mTurnEventParam);
        } else if (mName == M_TurnEvent_Names.DWELLER_SPECIAL) {
            evt = new TurnEventDwellerSpecial(this.gameScene, mName, mTurnEventParam);
        }
        if (skipAddingEvent) {
            return;
        }
        if (evt == undefined) {
            throw new Error("unknown turn event " + mName + " " + JSON.stringify(mTurnEventParam));
        } else {
            evt.initialize();
            if (this.activeItemUse) {
                this.activeItemUse.AddChildTurnEvent(evt);
            } else {
                this.queue.push(evt);
            }
        }
    }

    validate() {
        //TODO: Validate queue here making sure we don't have impossible combos like Story Event and Combat
        /*
        for (let i = 0; i < this.queue.length; i++) {
            console.log(
                "\nQ" + i + ": " + this.queue[i].mEventName + " " + JSON.stringify(this.queue[i].mTurnEventParam),
            );
        }

         */
        return true;
    }

    async process() {
        for (let i = 0; i < this.queue.length; i++) {
            await this.queue[i].process();
            if (this.queue[i].updateMapAfter) {
                this.gameScene.map.Draw();
            }
            if (this.queue[i].centerMapAfter) {
                this.gameScene.map.CenterOnTile(this.gameScene.player.tile.x, this.gameScene.player.tile.y);
            }
        }
    }
}
