import GlobalConst from "../../types/globalConst";
import StoryEventOption from "./storyEventOption";
import StoryEventCondition from "./storyEventCondition";
import StoryEventEffect from "./storyEventEffect";
import StoryEventOptionLeave from "./optionLeave";

export default class StoryEventData {
    allowRandomSpawns: boolean = false;
    randomSpawnWeight: number = 0; //higher is more frequent
    kind: GlobalConst.STORY_EVENT_KEYS; //unique key name for each
    category: GlobalConst.STORY_EVENT_CATEGORY;
    subcategory?: string;
    ascii: string = "_";
    mapGraphic: string;
    titleCopy: string;
    bodyCopy: string;
    canReEnter: boolean = false;
    options: StoryEventOption[];
    prereqs?: StoryEventCondition[]; //optional, if present player must meet condition for the event to be usable at all
    onTrigger?: StoryEventEffect[]; //optional. If present, applied when event is first triggered/opens.

    dwellerWalkable: boolean = false;
    blocksVision: boolean = false;

    constructor(kind: GlobalConst.STORY_EVENT_KEYS, category: GlobalConst.STORY_EVENT_CATEGORY) {
        this.kind = kind;
        this.category = category;
        this.options = [];
    }

    //Adds a back away/leave option, stops event from being deleted!
    addLeaveOption(text: string, destroyEvent: boolean = false) {
        this.addOption(new StoryEventOptionLeave(this, text, destroyEvent));
    }

    addOption(opt: StoryEventOption) {
        let index: number = this.options.length;
        this.options.push(opt);
        opt.index = index;
    }
}
