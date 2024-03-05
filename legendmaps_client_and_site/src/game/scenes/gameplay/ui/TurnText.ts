import {GameScene} from "../GameScene";
import GlobalConst from "../../../types/globalConst";
import FlagUtil from "../../../util/flagUtil";
import TimeUtil from "../../../util/timeUtil";
import {FONT} from "../../../types/localConst";

export default class TurnText {
    private static DISPLAY_TIME: number = 3000;
    private static MAX_CHAR_LENGTH: number = 1000;

    private gameScene: GameScene;
    private descText: Phaser.GameObjects.DynamicBitmapText;
    private defaultDisplayFlags: number = 0;
    private lastDisplayTime: number = -5;
    private clearAfterLastMessage: boolean = false;
    private activeTimeline: Phaser.Tweens.Timeline;

    private log: string[];

    constructor(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.defaultDisplayFlags = 0;
        this.log = [];
        this.descText = this.gameScene.add
            .dynamicBitmapText(630, 1, FONT.BODY_24_BLACKOUTLINE, "...", 24)
            .setDepth(125)
            .setMaxWidth(600)
            .setOrigin(0.5, 0)
            .setLetterSpacing(0);
    }

    private FixFormat(text: string = ""): string {
        if (text.length < 5) return text; //ignore short messages.
        //Make sure we have a space after punctuation.
        text = text.trim();

        text = text.replace(/\s*([,.!?:;]+)(?!\s*$)\s*/g, "$1 ");

        //clean up ellipses
        text = text.replace(".. .", "...");
        text = text.replace(". .", "..");
        text = text.replace(". ..", "...");

        //Remove any double or more spacing.
        text = text.replace(/\s+/g, " ");
        text = text.charAt(0).toUpperCase() + text.slice(1); //first char
        text = text.replace(/([!?.]\s+)([a-z])/g, (m, $1, $2) => {
            //remaining
            return $1 + $2.toUpperCase();
        });

        return this.AddPeriodIfNoPunctuation(text);
    }

    private AddPeriodIfNoPunctuation(text: string): string {
        text = text.trim();
        if (text.length > 5) {
            let c: string = text.charAt(text.length - 1);
            if (c != "." && c != "?" && c != "!" && c != ":" && c != ";") {
                text += ".";
            }
        }

        return text;
    }

    async showWithFlags(text: string, msgFlags: GlobalConst.MESSAGE_FLAGS[], addDisplayTime: number = 0) {
        let mflags = 0;
        for (let f = 0; f < msgFlags.length; f++) {
            mflags = FlagUtil.Set(mflags, msgFlags[f]);
        }
        await this.show(text, mflags, addDisplayTime);
    }

    clearAppend() {
        this.clearAfterLastMessage = true;
    }

    //shows text -- note that any delay related flags need to be handled before calling this function
    //addDisplayTime adds time to default time before message fades out.
    async show(text: string, mflags?: number, addDisplayTime?: number) {
        if (this.gameScene == undefined || this.gameScene.turnText == undefined) return;
        if (this.activeTimeline != null) {
            this.activeTimeline.stop();
            this.activeTimeline.destroy();
            this.activeTimeline = null;
        }

        this.lastDisplayTime = new Date().getTime();
        if (mflags == undefined) {
            mflags = this.defaultDisplayFlags;
        }

        text = this.FixFormat(text);
        if (
            this.descText.text.length < 3 ||
            this.clearAfterLastMessage ||
            FlagUtil.IsNotSet(mflags, GlobalConst.MESSAGE_FLAGS.APPEND) ||
            this.descText.text.length > TurnText.MAX_CHAR_LENGTH
        ) {
            this.descText.text = this.FixFormat(text);
        } else {
            this.descText.text = this.FixFormat(this.descText.text + ". " + text);
        }

        this.clearAfterLastMessage = FlagUtil.IsSet(mflags, GlobalConst.MESSAGE_FLAGS.CLEAR_AFTER);
        this.descText.alpha = 1;
        this.descText.setScale(1, 1);

        let displayTime: number = TurnText.DISPLAY_TIME;
        if (addDisplayTime != undefined) {
            displayTime += addDisplayTime;
        }

        if (FlagUtil.IsSet(mflags, GlobalConst.MESSAGE_FLAGS.EMPHASIZE)) {
            // console.log("emphasize code currently not in use");
            /*
            this.gameScene.tweens.add({
                targets: this.descText,
                alpha: 1,
                onUpdate: (tween) => {
                    console.log("A" + tween.progress);
                    let r: number = 255 * tween.progress;
                    this.descText.setTint(GFXUtil.RGBToHex(r, 100, 100));
                },
                duration: 5000,
            });

            this.gameScene.tweens.add({
                targets: this.descText,
                alpha: 1,
                onUpdate: (tween) => {
                    console.log("B" + tween.progress);
                    let r: number = 255;
                    let gb: number = 100 + 155 * tween.progress;
                    this.descText.setTint(GFXUtil.RGBToHex(r, gb, gb));
                },
                duration: 5000,
                delay: 1001,
            });
           
             */
        }
        if (FlagUtil.IsSet(mflags, GlobalConst.MESSAGE_FLAGS.REPLACE_PREVIOUS)) {
            this.log.shift();
        }

        if (FlagUtil.IsNotSet(mflags, GlobalConst.MESSAGE_FLAGS.NOLOG)) {
            this.log.unshift(">" + text);
            this.gameScene.ui.eventLogText.text = this.log.join("\n");
        }

        if (FlagUtil.IsSet(mflags, GlobalConst.MESSAGE_FLAGS.ELLIPSES)) {
            await TimeUtil.sleep(250);
            this.descText.text = this.descText.text + ".";
            await TimeUtil.sleep(250);
            this.descText.text = this.descText.text + ".";
            await TimeUtil.sleep(250);
            this.descText.text = this.descText.text + " ";
            await TimeUtil.sleep(250);
        }

        if (FlagUtil.IsSet(mflags, GlobalConst.MESSAGE_FLAGS.DELAY_AFTER)) {
            await TimeUtil.sleep(1100);
        }

        if (this.activeTimeline == null) {
            this.activeTimeline = this.gameScene.tweens.createTimeline();
            this.activeTimeline.add({
                targets: this.descText,
                alpha: 0,
                onComplete: () => {
                    this.descText.text = "";
                },
                delay: displayTime,
                duration: 200,
            });

            this.activeTimeline.play();
        }
    }
}
