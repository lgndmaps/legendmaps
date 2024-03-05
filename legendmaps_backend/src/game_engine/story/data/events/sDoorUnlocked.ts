import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectSpawnEvent from "../effects/seSpawnEvent";

export default class StoryEventDoorUnlocked extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.DOOR_UNLOCKED, GlobalConst.STORY_EVENT_CATEGORY.DOOR);

        this.ascii = "+";

        this.blocksVision = true;

        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 0; //doors never spawn randomly.

        this.titleCopy = "Unlocked Door";
        this.bodyCopy = "The door is closed, but is unlocked and can be easily opened again.";
        this.mapGraphic = "door_closed";

        let opend: StoryEventOption = new StoryEventOption(this);
        this.addOption(opend);
        opend.optionText = "Open the door.";
        opend.outcomeSuccess = new StoryEventOutcome("With a heavy creak the door swings open.");
        this.SpawnOpenDoor(opend.outcomeSuccess);

        //LEAVE OPTIONS
        this.addLeaveOption("On second thought, let's choose another path.");
    }

    SpawnOpenDoor(successOutcome: StoryEventOutcome) {
        successOutcome.AddStoryEffect(new StoryEffectSpawnEvent(GlobalConst.STORY_EVENT_KEYS.DOOR_OPEN, true));
    }
}
