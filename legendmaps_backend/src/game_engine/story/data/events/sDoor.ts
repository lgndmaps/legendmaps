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

export default class StoryEventDoor extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.DOOR, GlobalConst.STORY_EVENT_CATEGORY.DOOR);
        this.ascii = "+";

        this.blocksVision = true;
        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 0; //doors never spawn randomly.

        this.titleCopy = "Locked Door";
        this.bodyCopy =
            "Set into the stones in this wall is a heavy door, reinforced with iron plates and bearing a complex keyhole below the latch. Either there's something valuable inside, or the dungeon custodian is overly protective of his cleaning supplies.";
        this.mapGraphic = "door_closed";

        //UNLOCK OPTION
        let unlock: StoryEventOption = new StoryEventOption(this);
        this.addOption(unlock);
        unlock.optionText = "Use a key to open the door.";
        unlock.outcomeHint = "Success: 100%. A key never fails. ";
        unlock.AddSuccessCondition(new SpendKeys(1));
        unlock.outcomeSuccess = new StoryEventOutcome("The lock turns and the door opens smoothly.");
        this.SpawnOpenDoor(unlock.outcomeSuccess);
        //this.AddChestLoot(unlock.outcomeSuccess);
        unlock.outcomeFail = new StoryEventOutcome(
            "Alas, you have no keys. Perhaps you might find some in the dungeon and return?",
        );
        unlock.outcomeFail.AddEndEvent(false);

        //BREAK IT OPTION
        let smash: StoryEventOption = new StoryEventOption(this);
        this.addOption(smash);
        smash.optionText = "Smash it. If you want an egress omelet, you gotta break some door eggs.";
        smash.outcomeHint = "";

        smash.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.BRAWN));
        smash.outcomeSuccess = new StoryEventOutcome(
            'Success. You burst through the locked door, sending its pieces flying. "O Yea!" you exclaim, like some sort of Kool-Potion man. The door is in splinters, no one is going to be closing this door again.',
        );
        this.DestroyDoor(smash.outcomeSuccess);
        smash.outcomeFail = new StoryEventOutcome(
            'Fail. Alright, turns out you are NOT stronger than a iron-clad oaken door. After forcing your shoulder back into its socket with a sickening "pop," you decide maybe it\'s best to try another route. ',
        );
        smash.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(5, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "wooden door"),
        );
        this.SpawnDamagedDoor(smash.outcomeFail);

        //PICK IT OPTION
        let pickit: StoryEventOption = new StoryEventOption(this);
        this.addOption(pickit);
        pickit.optionText = "Pick lock. Doors open for the wily.";
        pickit.outcomeHint = "";
        let successRoll = new SuccessRoll(25, GlobalConst.ATTRIBUTES.GUILE);
        successRoll.AddTraitBonus(81, 25);
        pickit.AddSuccessCondition(successRoll);

        pickit.outcomeSuccess = new StoryEventOutcome(
            "Success. It takes a few moments, but the lock's complexity is no match for your cunning. You swing the door free.",
        );

        this.SpawnOpenDoor(pickit.outcomeSuccess);

        pickit.outcomeFail = new StoryEventOutcome(
            "Fail. You quickly realize that the inner workings of this lock have jammed, rendering it hard to open. Forcing it to move again, the rusty mechanism cuts your hand.",
        );
        pickit.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(5, true, GlobalConst.DAMAGE_TYPES.PIERCE, "rusty lock"),
        );
        this.SpawnDamagedDoor(pickit.outcomeFail);

        //LEAVE OPTIONS
        this.addLeaveOption("It's not worth the effort.");
    }

    DestroyDoor(successOutcome: StoryEventOutcome) {
        successOutcome.AddEndEvent(true);
    }

    SpawnOpenDoor(successOutcome: StoryEventOutcome) {
        successOutcome.AddStoryEffect(new StoryEffectSpawnEvent(GlobalConst.STORY_EVENT_KEYS.DOOR_OPEN, true));
    }

    SpawnDamagedDoor(successOutcome: StoryEventOutcome) {
        successOutcome.AddEndEvent(true);
        successOutcome.AddStoryEffect(new StoryEffectSpawnEvent(GlobalConst.STORY_EVENT_KEYS.DOOR_DAMAGED, false));
    }
}
