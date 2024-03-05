import { LMScene } from "../../LMScene";
import CommandManager from "../CommandManager";
import { LMButtonText } from "../ui/uielements/LMButtonText";
import LMUIElement from "../ui/uielements/LMUIElement";
import StoryEventModal from "./StoryEventModal";
import { FONT } from "../../../types/localConst";

export class StoryEventOption extends LMUIElement {
    private useBtn: LMButtonText;
    private descText: Phaser.GameObjects.BitmapText;
    private eventScreen: StoryEventModal;
    index: number;
    constructor(
        eventScreen: StoryEventModal,
        scene: LMScene,
        optionText: string,
        optionHint: string,
        optionIndex: number,
    ) {
        super(scene);
        this.eventScreen = eventScreen;
        this.index = optionIndex;
        let rect: Phaser.GameObjects.Rectangle = this.scene.add.rectangle(1, 0, 790, 70, 0x000000, 1).setOrigin(0, 0);
        rect.setStrokeStyle(1, 0xffffff);
        let eventText = optionIndex + 1 + ": " + optionText;
        if (optionHint != undefined && optionHint != "" && optionHint.length > 0) {
            eventText += "\n[" + optionHint + "]";
        }
        this.descText = this.scene.add
            .bitmapText(10, 6, FONT.BODY_20, eventText)
            .setMaxWidth(670)
            .setOrigin(0, 0);


        this.useBtn = new LMButtonText(
            scene,
            "Select",
            new Phaser.Math.Vector2(73, 42),
            Phaser.Math.Vector2.ZERO,
            this.use.bind(this),
        );

        this.container.add([rect, this.descText, this.useBtn.container]);

        this.useBtn.setPosition(710, 18);
    }

    use() {
        this.eventScreen.ClearOptions();
        CommandManager.instance.SendStoryEventOption(this.index);
    }
}
