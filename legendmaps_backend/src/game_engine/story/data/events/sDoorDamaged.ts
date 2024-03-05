import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SpendKeys from "../conditions/ecSpendKeys";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectLoseGold from "../effects/seLoseGold";
import StoryEffectDamage from "../effects/seDamage";
import StoryEffectSpawnEvent from "../effects/seSpawnEvent";
import StoryEffectPositionOnEvent from "../effects/sePositionOnEvent";
import StoryEffectSetInteractFlag from "../effects/seSetInteractFlag";

export default class StoryEventDoorDamaged extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.DOOR, GlobalConst.STORY_EVENT_CATEGORY.DOOR);
        this.ascii = "+";

        this.blocksVision = true;
        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 0; //doors never spawn randomly.

        this.titleCopy = "Damaged Door";
        this.bodyCopy =
            "The door appears to be damaged from your previous attempts to get it open.";
        this.mapGraphic = "door_closed";


        //BREAK IT OPTION
        let smash: StoryEventOption = new StoryEventOption(this);
        this.addOption(smash);
        smash.optionText = "Smash it. One more good push will bring it down, might hurt a bit though.";
        smash.outcomeHint = "";

        smash.AddSuccessCondition(new SuccessRoll(150, GlobalConst.ATTRIBUTES.BRAWN));
        smash.outcomeSuccess = new StoryEventOutcome(
            'Success. You burst through the locked door with some effort, hurting your shoulder in the process. The door is in splinters, no one is going to be closing this door again.',
        );
        smash.outcomeSuccess.AddStoryEffect(
            new StoryEffectDamage(6, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "wooden door"),
        );
        this.DestroyDoor(smash.outcomeSuccess);


        //LEAVE OPTIONS
        this.addLeaveOption("It's not worth the effort.");
    }

    DestroyDoor(successOutcome: StoryEventOutcome) {
        successOutcome.AddEndEvent(true);
    }

   
}
