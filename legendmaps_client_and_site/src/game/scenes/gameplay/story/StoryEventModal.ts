import { InputController } from "../../../types/frontendTypes";
import GlobalConst from "../../../types/globalConst";
import { GameScene } from "../GameScene";
import { GameUI } from "../ui/gameUI";
import { LMButtonText } from "../ui/uielements/LMButtonText";
import { FONT, PHASER_DEPTH } from "../../../types/localConst";
import { M_StoryEventOutcome, M_StoryEventReveal } from "../../../types/globalTypes";
import { StoryEventOption } from "./StoryEventOption";
import StoryEventOutcomeQueueItem from "./StoryEventOutcomeQueueItem";

export default class StoryEventModal implements InputController {
    private scene: GameScene;
    private ui: GameUI;
    private cont: Phaser.GameObjects.Container;
    private bg: Phaser.GameObjects.Rectangle;
    private bginner: Phaser.GameObjects.Rectangle;
    public blockInput: boolean = false;
    private closeBtn: LMButtonText;
    private outcomeQueue: StoryEventOutcomeQueueItem[];
    title: Phaser.GameObjects.DynamicBitmapText;
    body: Phaser.GameObjects.DynamicBitmapText;
    results: Phaser.GameObjects.DynamicBitmapText;

    options: StoryEventOption[];
    image: Phaser.GameObjects.Image;

    constructor(scene: GameScene, gameUI: GameUI) {
        this.scene = scene;
        this.ui = gameUI;
        this.cont = scene.add.container(0, 0);
        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);

        this.bg = scene.add.rectangle(1, 1, 935, 689, 0x000000, 1).setOrigin(0, 0);
        this.bg.setStrokeStyle(1, 0xffffffff, 1);
        this.cont.add(this.bg);
        this.ui.alignGrid.placeAtIndex(39, this.bg, 0, 5);

        this.bginner = scene.add.rectangle(1, 1, 925, 680, 0x000000, 1).setOrigin(0, 0);
        this.bginner.setStrokeStyle(1, 0xffffffff, 1);
        this.cont.add(this.bginner);
        this.ui.alignGrid.placeAtIndex(39, this.bginner, 5, 10);
        this.outcomeQueue = [];

        this.title = this.scene.add
            .dynamicBitmapText(0, 0, FONT.TITLE_32, "")
            .setOrigin(0, 0)
            .setLeftAlign()
            .setMaxWidth(510);
        this.ui.alignGrid.placeAtIndex(78, this.title, 10, 0);

        this.body = this.scene.add
            .dynamicBitmapText(0, 0, FONT.BODY_24, "")
            .setOrigin(0, 0)
            .setLeftAlign()
            .setMaxWidth(560);
        this.ui.alignGrid.placeAtIndex(110, this.body, 10);

        this.results = this.scene.add
            .dynamicBitmapText(0, 0, FONT.BODY_24, "")
            .setOrigin(0, 0)
            .setLeftAlign()
            .setMaxWidth(510);
        this.ui.alignGrid.placeAtIndex(299, this.results, 10, 25);

        this.closeBtn = new LMButtonText(
            scene,
            "Close",
            new Phaser.Math.Vector2(120, 42),
            Phaser.Math.Vector2.ZERO,
            this.close.bind(this),
        );
        this.ui.alignGrid.placeAtIndex(528, this.closeBtn.container, 0, 15);

        this.cont.add([
            this.title,
            this.body,
            this.results,
            this.closeBtn.container,
            //this.goldText.container,
        ]);
        this.closeBtn.hide();

        this.cont.setDepth(PHASER_DEPTH.CHARACTER_SHEET_UI);

        this.hide();
    }

    public ClearOptions(): void {
        if (this.options != undefined && this.options.length > 0) {
            for (let i = 0; i < this.options.length; i++) {
                let opt = this.options[i];
                this.cont.remove(opt.container);
                opt.container.destroy();
            }
        }
    }

    private ClearExisting() {
        this.closeBtn.hide();
        this.ClearOptions();
        this.outcomeQueue = [];
        this.options = [];

        if (this.image != null) {
            this.image.destroy();
            this.image = null;
        }

        this.title.text = "";
        this.body.text = "";
        this.results.text = "";
    }

    keyPressed(keyCode: number): void {
        // throw new Error("Method not implemented.");
    }
    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {
        //throw new Error("Method not implemented.");
    }

    pointerMove(x: number, y: number) {}

    touch(point: Phaser.Geom.Point) {
        // throw new Error("Method not implemented.");
    }
    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Phaser.Geom.Point, swipeEnd: Phaser.Geom.Point): void {
        // throw new Error("Method not implemented.");
    }

    escapePressed(): void {
        if (this.closeBtn.container.visible) {
            this.close();
        } else {
            //autoselect
            //this.options[this.options.length-1].use();
        }
    }

    optionPressed(opt: number): void {
        if (opt > this.options.length) {
            return;
        }
        this.options[opt - 1].use();
    }
    confirmPressed(): void {}

    close() {
        this.ui.CloseStoryEvent();
    }

    public hide() {
        this.cont.visible = false;
        this.cont.active = false;
    }

    public show(storyEventInfo: M_StoryEventReveal) {
        this.ClearExisting();

        this.cont.visible = true;
        this.cont.active = true;

        let imagekey = storyEventInfo.key;
        if (imagekey == GlobalConst.STORY_EVENT_KEYS.DOOR_UNLOCKED) {
            imagekey = GlobalConst.STORY_EVENT_KEYS.DOOR;
        } else if (
            imagekey == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_H ||
            imagekey == GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V
        ) {
            imagekey = "door_secret";
        }
        let imagename: string = "evt_" + imagekey + ".png";
        this.image = this.scene.add.image(0, 58, "storyevent", imagename).setOrigin(0, 0); //280x
        this.cont.add(this.image);
        this.ui.alignGrid.placeAtIndex(71, this.image, -15, -10);
        this.title.text = storyEventInfo.title;
        this.body.text = storyEventInfo.body;

        for (let i = 0; i < storyEventInfo.options.length; i++) {
            let optObj: StoryEventOption = new StoryEventOption(
                this,
                this.scene,
                storyEventInfo.options[i].text,
                storyEventInfo.options[i].hint,
                storyEventInfo.options[i].idx,
            );
            this.options.push(optObj);
            this.cont.add(optObj.container);
            this.ui.alignGrid.placeAtIndex(293, optObj.container, -18, 15 + i * 70);
        }
    }

    public get container(): Phaser.GameObjects.Container {
        return this.cont;
    }

    public ProcessStoryEventOutcome(params: M_StoryEventOutcome, message: string = "") {
        this.outcomeQueue.push(new StoryEventOutcomeQueueItem(params, message));
        //we let these pile up until we hit the final one
        if (params.isFinal) {
            if (this.outcomeQueue.length == 1 && this.outcomeQueue[0].GetText() == "") {
                this.scene.ui.CloseStoryEvent();
            } else {
                this.results.text = "";
                for (let i = 0; i < this.outcomeQueue.length; i++) {
                    console.log("msg " + this.outcomeQueue[i].message);
                    if (this.outcomeQueue[i].message != undefined && this.outcomeQueue[i].message != "") {
                        this.results.text += this.outcomeQueue[i].message + " ";
                    }
                    if (this.outcomeQueue[i].outcome.text != undefined && this.outcomeQueue[i].outcome.text != "") {
                        this.results.text += this.outcomeQueue[i].outcome.text + " ";
                    }
                    //TODO: Probably need to process .outcome params here as well.
                }
                this.closeBtn.show();
            }
        }
    }
}
