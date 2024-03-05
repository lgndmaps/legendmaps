import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SpendKeys from "../conditions/ecSpendKeys";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectLoseGold from "../effects/seLoseGold";
import StoryEffectDamage from "../effects/seDamage";
import StoryEffectPositionOnEvent from "../effects/sePositionOnEvent";
import StoryEffectSpawnEvent from "../effects/seSpawnEvent";

export default class StoryEventDoorOpen extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.DOOR_OPEN, GlobalConst.STORY_EVENT_CATEGORY.DOOR);

        this.blocksVision = false;
        this.dwellerWalkable = true;

        this.ascii = "-";

        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 0; //doors never spawn randomly.

        this.titleCopy = "Open Door";
        this.bodyCopy = "The door is open and you can pass easily.";
        this.mapGraphic = "door_open";

        let walk: StoryEventOption = new StoryEventOption(this);
        this.addOption(walk);
        walk.optionText = "Walk through the door.";
        walk.outcomeSuccess = new StoryEventOutcome("You walk through the open door.");
        walk.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        walk.outcomeSuccess.AddEndEvent(false);

        let close: StoryEventOption = new StoryEventOption(this);
        this.addOption(close);
        close.optionText = "Close the door, perhaps it will stop the dwellers.";
        close.outcomeHint = "";
        close.outcomeSuccess = new StoryEventOutcome(
            "The door shuts with a solid thud. These dwellers probably have no idea how to open a door, right?",
        );
        this.SpawnClosedDoor(close.outcomeSuccess);

        //LEAVE OPTIONS
        this.addLeaveOption("On second thought, let's choose another path.");
    }

    SpawnClosedDoor(successOutcome: StoryEventOutcome) {
        successOutcome.AddStoryEffect(new StoryEffectSpawnEvent(GlobalConst.STORY_EVENT_KEYS.DOOR_UNLOCKED, false));
    }
}
