import StoryEventOption from "./storyEventOption";
import StoryEventData from "./storyEventData";
import StoryEffectEndEvent from "./effects/seEndEvent";

export default class StoryEventOptionLeave extends StoryEventOption {
    constructor(parentEvent: StoryEventData, text: string = "Exit", destroyEventAfter: boolean = false) {
        super(parentEvent);
        this.optionText = text;
        this.outcomeHint = "exit";
        let evt: StoryEffectEndEvent = new StoryEffectEndEvent();
        evt.destroyEvent = destroyEventAfter;
        this.onSelect = [evt];
    }
}
