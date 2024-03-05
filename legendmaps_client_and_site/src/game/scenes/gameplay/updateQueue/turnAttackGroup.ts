//Holder class which tracks the full flow of all the turn events in attack action.
import {
    M_TurnEvent_AttackResult,
    M_TurnEvent_Names,
    M_TurnEventAttackInit,
    M_TurnEventAttackStep,
} from "../../../types/globalTypes";
import TurnEvent from "./turnEvent";
import {GameScene} from "../GameScene";
import TurnEventPlayerDead from "./turnEventPlayerDead";
import TurnEventDwellerDead from "./turnEventDwellerDead";
import {EntityLiving} from "../entities/EntityLiving";
import EntityManager from "../entities/EntityManager";
import FlagUtil from "../../../util/flagUtil";
import GlobalConst from "../../../types/globalConst";
import TurnAttackGroupStep from "./turnAttackGroupStep";
import {GameMapTile} from "../map/GameMapTile";
import TimeUtil from "../../../util/timeUtil";
import AudioManager from "../sound/audioManager";
import {Floater} from "../ui/floater";
import BloodSplatter from "../effects/BloodSplatter";
import Phaser from "phaser";
import MissPuff from "../effects/MIssPuff";
import EffectUtil from "../effects/EffectUtil";
import EffectHitGeneric from "../effects/EffectHitGeneric";
import Dweller from "../entities/Dweller";

export default class TurnAttackGroup extends TurnEvent {
    attacker: EntityLiving;
    attackerName: string;
    weaponDamageType: string;
    weaponName: string;
    weaponType: string;
    originTile: GameMapTile;
    tiles: GameMapTile[];
    isBeam: boolean = false;
    isMultTile: boolean = false;
    isAOE: boolean = false;
    playerIsAttacker: boolean = false;

    public isClosed: boolean = false;

    private attackMessage: string[];

    private steps: TurnAttackGroupStep[] = [];

    constructor(gameScene: GameScene, turnEvent: M_TurnEvent_Names, turnEventParam: M_TurnEventAttackInit) {
        super(gameScene, turnEvent, turnEventParam);

        this.tiles = [];
        this.steps = [];
        this.attackMessage = [];

        this.addInit(turnEvent, turnEventParam);
    }

    addInit(name: M_TurnEvent_Names, init: M_TurnEventAttackInit) {
        if (name == M_TurnEvent_Names.PLAYER_ATTACK) {
            this.playerIsAttacker = true;
            this.attacker = this.gameScene.player;
        } else {
            this.playerIsAttacker = false;
            this.attacker = EntityManager.instance.GetOrCreateDweller(
                init.attackerId,
                init.dwellerKind,
                init.attackerName,
            );
            let originTile = this.gameScene.map.GetTile(init.originTile.x, init.originTile.y);
            if (originTile == null) {
                console.log("WARNING: dweller attack tile is undefined, using pending tile as stop gap!");
                let dw = this.attacker as Dweller;
                originTile = dw.pendingTile;
            }
            this.attacker.MoveTo(originTile);
        }
        this.attackerName = init.attackerName;
        this.weaponName = init.weaponName;
        this.weaponType = init.weaponType;
        this.weaponDamageType = init.primaryDamageType as GlobalConst.DAMAGE_TYPES;
        if (FlagUtil.IsSet(init.flags, GlobalConst.ATTACK_FLAGS.IS_BEAM)) {
            this.isBeam = true;
        }
        if (FlagUtil.IsSet(init.flags, GlobalConst.ATTACK_FLAGS.IS_AOE)) {
            this.isAOE = true;
            console.log("IS AOE");
        }
        if (FlagUtil.IsSet(init.flags, GlobalConst.ATTACK_FLAGS.MULTITILE)) {
            this.isMultTile = true;
        }

        this.originTile = this.gameScene.map.GetTile(init.originTile.x, init.originTile.y);
        for (let i = 0; i < init.tiles.length; i++) {
            this.tiles.push(this.gameScene.map.GetTile(init.tiles[i].x, init.tiles[i].y));
        }
    }

    addStep(step: M_TurnEventAttackStep) {
        let turnStep = new TurnAttackGroupStep(this.gameScene, this, step);
        this.steps.push(turnStep);
    }

    addResult(res: M_TurnEvent_AttackResult) {
        if (this.steps.length == 0) {
            throw new Error("adding result but no steps have been sent");
        }
        this.steps[this.steps.length - 1].addResult(res);
    }

    addPlayerDeath(death: TurnEventPlayerDead) {
        if (this.steps.length == 0) {
            throw new Error("adding death but no steps have been sent");
        }
        this.steps[this.steps.length - 1].killedTarget = true;
        this.steps[this.steps.length - 1].deathEvent = death;
    }

    addDwellerDeath(death: TurnEventDwellerDead) {
        if (this.steps.length == 0) {
            throw new Error("adding death but no steps have been sent");
        }
        this.steps[this.steps.length - 1].killedTarget = true;
        this.steps[this.steps.length - 1].deathEvent = death;
    }

    protected override parseEvent() {
        return true;
    }

    public async addMessage(msg) {
        this.attackMessage.push(msg);
        let flags = [GlobalConst.MESSAGE_FLAGS.EMPHASIZE];
        if (this.attackMessage.length > 1) {
            flags.push(GlobalConst.MESSAGE_FLAGS.REPLACE_PREVIOUS);
        }
        this.gameScene.turnText.showWithFlags(this.attackMessage.join(""), flags);
    }

    static TIME_MISS = 100;
    static TIME_HIT_1 = 200;
    static TIME_HIT_X = 150;
    static TIME_DEATH = 250;

    override async process() {
        let introText = "";
        if (this.playerIsAttacker) {
            introText = "You attack with your " + this.weaponName + ". ";
        } else {
            this.gameScene.ui.dwellerPanel.highlightCombat(this.attacker.id);
            introText = "The " + this.attackerName + " attacks with its " + this.weaponName + ". ";
        }
        this.addMessage(introText);

        //ANIMATE ATTACKER ATTACK
        await this.gameScene.uiCombat.AnimateMapAttack(
            this.attacker,
            this.tiles[0],
            this.weaponType,
            this.weaponDamageType as GlobalConst.DAMAGE_TYPES,
            this.isBeam,
            this.isAOE,
            this.tiles,
        );
        this.PlayAttackSound();
        //await TimeUtil.sleep(TurnAttackGroup.TIME_ATTACK);

        //roll thru each defender
        for (let s = 0; s < this.steps.length; s++) {
            let step = this.steps[s];

            if (step.defender != null) {
                this.gameScene.ui.dwellerPanel.highlightCombat(step.defender.id);
            }
            let attackHeading: GlobalConst.MOVE_DIR = this.attacker.tile.GetCompassHeadingToAnotherTile(
                step.defender.tile,
            );

            let pos: Phaser.Math.Vector2 | null = null;
            if (!this.gameScene.map.GetTileHasActiveGraphic(step.tile)) {
                pos = null;
            } else {
                pos = this.gameScene.map.GetTileScreenPosition(step.tile);
            }

            if (pos == null) {
                //effect is on off stage tile, ignore
            } else if (step.isMiss) {
                AudioManager.instance.PlayGameSound(this.gameScene, "miss", 0, 3);

                if (step.isPointBlank) {
                    new Floater(this.gameScene, "Miss: point blank", pos.x, pos.y, 0x565656, 0xffffff, 0);
                    this.addMessage("Missed (Ranged weapon point blank penalty)");
                } else {
                    this.addMessage("Missed. ");
                }

                this.gameScene.uiCombat.DoMiss(this.attacker, step.defender);
                new MissPuff().Init(this.gameScene, step.defender.tile).Play(attackHeading);
                //new Floater(this.gameScene, "Miss!", pos.x, pos.y, 0x229922, 0xffffff, 0);
                await TimeUtil.sleep(TurnAttackGroup.TIME_MISS);
            } else if (step.isDodged) {
                AudioManager.instance.PlayGameSound(this.gameScene, "miss", 0, 3);
                if (step.defenderIsPlayer()) {
                    this.addMessage("You dodge. ");
                } else {
                    this.addMessage("The " + step.defenderName + " dodges. ");
                }

                this.gameScene.uiCombat.DoMiss(this.attacker, step.defender);
                new MissPuff().Init(this.gameScene, step.defender.tile).Play(attackHeading);

                new Floater(this.gameScene, "Dodge!", pos.x, pos.y, 0x229922, 0xffffff, 0);
                await TimeUtil.sleep(TurnAttackGroup.TIME_MISS);
            } else {
                for (let r = 0; r < step.results.length; r++) {
                    let resText: string = "";
                    let floaterText: string = "";
                    let floaterColor: number = 0xffffff;
                    let res = step.results[r].attackResult;
                    let hitIntensity: 1 | 2 | 3 = 1;
                    if (res.effect.type == GlobalConst.EFFECT_TYPES.DAMAGE) {
                        this.gameScene.uiCombat.DoHit(this.attacker, step.defender);

                        if (FlagUtil.IsSet(res.flags, GlobalConst.ATTACK_FLAGS.IMMUNE)) {
                            if (step.defenderIsPlayer()) {
                                resText = "You are immune to " + res.effect.damage_type + ". ";
                            } else {
                                resText = step.defenderName + " is immune to " + res.effect.damage_type + ". ";
                            }
                            AudioManager.instance.PlayGameSound(this.gameScene, "blocked");
                            floaterText = "Immune!";
                            floaterColor = 0x229922;
                        } else {
                            resText = step.defenderName;
                            if (step.defenderName.toLowerCase() == "you") {
                                resText += " take ";
                            } else {
                                resText += " takes ";
                            }
                            resText += res.finalDamage + " " + res.effect.damage_type + " damage";
                            let modif: string = "";
                            if (FlagUtil.IsSet(res.flags, GlobalConst.ATTACK_FLAGS.VULN)) {
                                modif = " [vulnerable";
                                hitIntensity = 2;
                            } else if (FlagUtil.IsSet(res.flags, GlobalConst.ATTACK_FLAGS.RESISTED)) {
                                modif = " [resisted";
                            }
                            if (FlagUtil.IsSet(res.flags, GlobalConst.ATTACK_FLAGS.BLOCKED)) {
                                AudioManager.instance.PlayGameSound(this.gameScene, "blocked");
                                if (modif == "") {
                                    modif = " [blocked";
                                } else {
                                    modif += ", blocked";
                                }
                            }
                            if (FlagUtil.IsSet(res.flags, GlobalConst.ATTACK_FLAGS.CRIT)) {
                                if (modif == "") {
                                    modif = " [CRIT";
                                    hitIntensity = 2;
                                } else {
                                    modif += ", CRIT";
                                }
                            }

                            if (modif != "") {
                                modif += "]";
                                resText += modif;
                            }
                            floaterText = "-" + res.finalDamage + " " + res.effect.damage_type;
                            floaterColor = 0x993333;
                            resText += ". ";
                        }

                        if (res.targetUpdate !== undefined) {
                            if (step.targetId != 0) {
                                this.gameScene.ui.dwellerPanel.updateHP(step.defender.id, res.targetUpdate.hp);
                            } else {
                                this.gameScene.ui.adventurerPortrait.updateHP(res.targetUpdate.hp);
                            }
                        }

                        this.PlayHitSound(res.effect.damage_type);
                        if (step.killedTarget) {
                            hitIntensity = 3;
                        }
                        new BloodSplatter().Init(this.gameScene, step.defender.tile).Play(attackHeading, hitIntensity);
                        if (EffectUtil.IsMagicType(res.effect.damage_type)) {
                            let eff = new EffectHitGeneric().Init(this.gameScene, step.defender.tile, 0);
                            eff.damageType = res.effect.damage_type;
                            eff.Play();
                        }

                        new Floater(this.gameScene, floaterText, pos.x, pos.y, floaterColor, 0xffffff, 100);
                        let initialWait = TurnAttackGroup.TIME_HIT_1;
                        await TimeUtil.sleep(r == 0 ? initialWait : TurnAttackGroup.TIME_HIT_X);
                    } else if (res.effect.type == GlobalConst.EFFECT_TYPES.GIVES_CONDITION) {
                        resText =
                            (this.playerIsAttacker ? step.defenderName + " is " : "You are ") + res.effect.condition;
                    } else {
                        resText = " UNHANDLED EFFECT : " + res.effect.type;
                    }

                    this.addMessage(resText);
                }
                if (step.killedTarget) {
                    step.deathEvent.initialize();
                    if (step.defender == this.gameScene.player) {
                        //Killed player.
                        this.addMessage("You died.");
                        step.deathEvent.process(true);
                        return;
                    } else {
                        //Killed dweller.
                        this.addMessage(step.defenderName + " is ded.");
                        step.deathEvent.process(true);
                        await TimeUtil.sleep(TurnAttackGroup.TIME_DEATH);
                    }
                }
            }
        }

        if (this.isAOE) {
            await TimeUtil.sleep(1000);
        }

        this.gameScene.ui.dwellerPanel.highlightClearAll();
    }

    private PlayAttackSound() {
        let soundRange = 1;
        let soundName: string = "attack_";
        if (
            this.weaponType == GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH ||
            this.weaponType == GlobalConst.WEAPON_BASE_TYPE.DAGGER ||
            this.weaponType == GlobalConst.WEAPON_BASE_TYPE.SWORD ||
            this.weaponType == GlobalConst.WEAPON_BASE_TYPE.AXE
        ) {
            soundName += "blade";
            soundRange = 2;
        } else if (
            this.weaponType == GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE ||
            this.weaponType == GlobalConst.WEAPON_BASE_TYPE.SPEAR
        ) {
            soundName += "pierce";
            soundRange = 2;
        } else if (
            this.weaponType == GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON ||
            this.weaponType == GlobalConst.WEAPON_BASE_TYPE.STAFF ||
            this.weaponType == GlobalConst.WEAPON_BASE_TYPE.HAMMER
        ) {
            soundName += "bludgeon";
            soundRange = 2;
        } else if (this.weaponType == GlobalConst.WEAPON_BASE_TYPE.BOW) {
            soundName += "bow";
            soundRange = 0;
        } else if (
            this.weaponType == GlobalConst.WEAPON_BASE_TYPE.WAND ||
            this.weaponType == GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC
        ) {
            soundName += "wand";
            soundRange = 0;
        } else {
            //default
            soundName += "bludgeon";
            soundRange = 2;
        }

        AudioManager.instance.PlayGameSound(this.gameScene, soundName, 0, soundRange);
    }

    private PlayHitSound(damageType: GlobalConst.DAMAGE_TYPES) {
        let soundRange = 1;
        let soundName: string = "hit_" + damageType;

        if (
            damageType == GlobalConst.DAMAGE_TYPES.PIERCE ||
            damageType == GlobalConst.DAMAGE_TYPES.BLADE ||
            damageType == GlobalConst.DAMAGE_TYPES.BLUDGEON
        ) {
            soundRange = 2;
        }
        AudioManager.instance.PlayGameSound(this.gameScene, soundName, 0, soundRange);
    }
}
