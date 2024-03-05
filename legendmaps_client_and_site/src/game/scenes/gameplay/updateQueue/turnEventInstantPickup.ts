import TurnEvent from "./turnEvent";
import {M_TurnEvent_InstantPickup, M_TurnEvent_Names} from "../../../types/globalTypes";

import GoldTrail from "../effects/GoldTrail";
import {Floater} from "../ui/floater";
import Phaser from "phaser";

export default class TurnEventInstantPickup extends TurnEvent {
    p: M_TurnEvent_InstantPickup;
    amount: number;
    newtotal: number;

    protected override parseEvent(): boolean {
        this.p = this.mTurnEventParam as M_TurnEvent_InstantPickup;
        this.amount = this.p.amount;
        this.newtotal = this.p.newtotal;
        return true;
    }

    override async process() {
        let floaterText = "+";

        if (this.mEventName == M_TurnEvent_Names.GOLD_PICKUP) {
            floaterText += this.amount + " gold";
            new GoldTrail().Play(
                this.gameScene,
                new Phaser.Math.Vector2(850, 350),
                new Phaser.Math.Vector2(this.gameScene.ui.goldText.x, this.gameScene.ui.goldText.y),
                500,
            );

            let timeline = this.gameScene.tweens.createTimeline();

            timeline.add({
                targets: this.gameScene.ui.goldText,
                scaleX: 1.5,
                scaleY: 1.5,
                ease: Phaser.Math.Easing.Quadratic.Out,
                duration: 300,
                delay: 490,
                onStart: () => {
                    this.gameScene.ui.goldText.text = "" + this.newtotal;
                },
            });

            timeline.add({
                targets: this.gameScene.ui.goldText,
                scaleX: 1,
                scaleY: 1,
                ease: Phaser.Math.Easing.Quadratic.In,
                duration: 100,
            });

            timeline.play();
        } else if (this.mEventName == M_TurnEvent_Names.KEY_PICKUP) {
            floaterText += this.amount + " Key";
            if (this.amount > 1) {
                floaterText += "s";
            }
            this.gameScene.ui.keyText.text = "" + this.newtotal;
        }
        let pos: Phaser.Math.Vector2 = this.gameScene.map.GetTileScreenPosition(this.gameScene.player.tile);
        new Floater(this.gameScene, floaterText, pos.x, pos.y, 0x947e42);
        //await TimeUtil.sleep(100);
    }
}
