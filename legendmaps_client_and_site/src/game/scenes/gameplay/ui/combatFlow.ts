import GlobalConst from "../../../types/globalConst";
import TimeUtil from "../../../util/timeUtil";
import { GameScene } from "../GameScene";
import { GameUI } from "./gameUI";
import { EntityLiving } from "../entities/EntityLiving";
import Slash from "../effects/Slash";
import { GameMapTile } from "../map/GameMapTile";
import ProjectileArrow from "../effects/ProjectileArrow";
import ProjectileMagic from "../effects/ProjectileMagic";
import BeamMagic from "../effects/BeamMagic";
import EffectAOE from "../effects/EffectAOE";

export default class CombatFlow {
    public gameScene: GameScene;
    public ui: GameUI;

    constructor(gameScene: GameScene) {
        this.gameScene = gameScene;
    }

    async AnimateMapAttack(
        attacker: EntityLiving,
        targetTile: GameMapTile,
        weaponType: string,
        damageType: GlobalConst.DAMAGE_TYPES,
        isBeam: boolean = false,
        isAOE: boolean = false,
        multiAttackTiles: GameMapTile[] = [],
    ) {
        let atk = attacker.GetCurrentMapGraphic();
        if (atk == undefined) {
            console.log("atk  is undefined");
            return;
        }
        let dir: GlobalConst.MOVE_DIR = attacker.tile.GetCompassHeadingToAnotherTile(targetTile);
        let dirVec: Phaser.Math.Vector2 = this.gameScene.map.GetNormalVectorFromCompass(dir);
        let start: Phaser.Math.Vector2 = new Phaser.Math.Vector2(atk.x, atk.y);

        let timeline: Phaser.Tweens.Timeline = this.gameScene.tweens.createTimeline({});

        let time: number = 200;
        let onCompleteFx: Function = null;

        if (isAOE) {
            let exp = new EffectAOE().Init(this.gameScene, targetTile);
            exp.damageType = damageType;
            onCompleteFx = () => {
                exp.Play();
            };
        } else if (isBeam) {
            let beam = new BeamMagic().Init(this.gameScene, attacker.tile);
            time = beam.SetTiles(multiAttackTiles);
            onCompleteFx = () => {
                beam.Play(dir, damageType);
            };
        } else if (
            weaponType == GlobalConst.WEAPON_BASE_TYPE.WAND ||
            weaponType == GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC
        ) {
            let bolt = new ProjectileMagic().Init(this.gameScene, attacker.tile);
            time = bolt.SetTarget(targetTile);
            onCompleteFx = () => {
                bolt.Play(dir, damageType);
            };
        } else if (
            weaponType == GlobalConst.WEAPON_BASE_TYPE.BOW ||
            weaponType == GlobalConst.DWELLER_ATTACK_TYPE.RANGED_PHYSICAL
        ) {
            let arrow = new ProjectileArrow().Init(this.gameScene, attacker.tile);
            time = arrow.SetTarget(targetTile);
            onCompleteFx = () => {
                arrow.Play(dir);
            };
        } else {
            onCompleteFx = () => {
                new Slash().Play(this.gameScene, attacker.tile.getPixelPos(this.gameScene), dir);
            };
        }
        timeline.add({
            targets: atk,
            x: start.x + 20 * dirVec.x,
            y: start.y + 20 * dirVec.y,
            duration: 150,
            ease: "Sine.easeIn",
        });
        timeline.add({
            targets: atk,
            x: start.x,
            y: start.y,
            duration: 80,
            ease: "Sine.easeOut",
            onComplete: onCompleteFx,
        });

        timeline.play();
        await TimeUtil.sleep(time);
    }

    DoMiss(attacker: EntityLiving, defender: EntityLiving) {
        let atk = attacker.GetCurrentMapGraphic();
        let def = defender.GetCurrentMapGraphic();
        if (atk == undefined || def == undefined) {
            console.log("atk or def is undefined");
            return;
        }
        let dir: GlobalConst.MOVE_DIR = attacker.tile.GetCompassHeadingToAnotherTile(defender.tile);

        let dirVec: Phaser.Math.Vector2 = this.gameScene.map.GetNormalVectorFromCompass(dir);
        let start: Phaser.Math.Vector2 = new Phaser.Math.Vector2(atk.x, atk.y);

        let timeline: Phaser.Tweens.Timeline = this.gameScene.tweens.createTimeline({});

        timeline.add({
            targets: atk,
            x: start.x - 15 * dirVec.x,
            y: start.y - 15 * dirVec.y,
            duration: 100,
            ease: "Sine.easeIn",
        });
        timeline.add({
            targets: atk,
            x: start.x,
            y: start.y,
            duration: 50,
            ease: "Sine.easeOut",
        });

        timeline.play();
    }

    DoHit(attacker: EntityLiving, defender: EntityLiving) {
        let atk = attacker.GetCurrentMapGraphic();
        let def = defender.GetCurrentMapGraphic();
        if (atk == undefined || def == undefined) {
            console.log("atk or def is undefined");
            return;
        }
        let dir: GlobalConst.MOVE_DIR = attacker.tile.GetCompassHeadingToAnotherTile(defender.tile);
        //new Slash().Play(this.gameScene, attacker.tile.getPixelPos(this.gameScene), dir);
        let startColor: number = def.tint;
        let timeline: Phaser.Tweens.Timeline = this.gameScene.tweens.createTimeline({});

        timeline.add({
            targets: def,

            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            ease: "Sine.easeIn",
        });
        timeline.add({
            targets: def,
            scaleX: 1,
            scaleY: 1,
            duration: 80,
            ease: "Sine.easeOut",
        });

        timeline.play();
    }

    DoDie(defender: EntityLiving) {
        let def = defender.GetCurrentMapGraphic();
        if (def == undefined) {
            console.log("atk or def is undefined");
            return;
        }
        def.setOrigin(0.5, 1);
        def.setPosition(def.x, def.y + 30);
        let timeline: Phaser.Tweens.Timeline = this.gameScene.tweens.createTimeline({});

        timeline.add({
            targets: def,

            scaleX: 1,
            scaleY: 0,
            alpha: 0.4,
            duration: 500,
            ease: "Sine.easeOut",
        });
        console.log("DEATH ANIM");
        timeline.play();
    }

    GetColorFromDamageType(type: GlobalConst.DAMAGE_TYPES) {
        if (GlobalConst.DAMAGE_TYPES.ELECTRIC) {
            return 0xffff00;
        }
        return 0xffffff;
    }
}
