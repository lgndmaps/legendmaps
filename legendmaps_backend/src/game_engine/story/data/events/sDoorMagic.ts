import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SpendKeys from "../conditions/ecSpendKeys";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectSpawnEvent from "../effects/seSpawnEvent";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import RandomUtil from "../../../utils/randomUtil";
import StoryEffectSetInteractFlag from "../effects/seSetInteractFlag";

export default class StoryEventDoorMagic extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.DOOR_MAGIC, GlobalConst.STORY_EVENT_CATEGORY.DOOR);
        this.ascii = "+";

        this.blocksVision = true;
        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 0; //doors never spawn randomly.

        this.titleCopy = "Magically Locked Door";
        this.bodyCopy =
            "A simple door is here, with no visible reinforcements or locks. But when you try the latch, it is sealed tight. This can only be the work of magic.";
        this.mapGraphic = "door_closed";

        //UNLOCK OPTION
        let unlock: StoryEventOption = new StoryEventOption(this);
        this.addOption(unlock);
        unlock.optionText = "Use a key to open the door.";
        unlock.outcomeHint = "Success: 100%. A key never fails. ";
        unlock.AddSuccessCondition(new SpendKeys(1));
        unlock.outcomeSuccess = new StoryEventOutcome("The lock turns and the magic dissipates.");
        this.SpawnOpenDoor(unlock.outcomeSuccess);
        //this.AddChestLoot(unlock.outcomeSuccess);
        unlock.outcomeFail = new StoryEventOutcome(
            "Alas, you have no keys. Perhaps you might find some in the dungeon and return?",
        );
        unlock.outcomeFail.AddEndEvent(false);

        //BREAK IT OPTION
        let smash: StoryEventOption = new StoryEventOption(this);
        this.addOption(smash);
        smash.optionText = "Smash it. Magic is for weaklings!";
        smash.outcomeHint = "";
        smash.AddSuccessCondition(new SuccessRoll(20, GlobalConst.ATTRIBUTES.BRAWN));
        smash.outcomeSuccess = new StoryEventOutcome(
            "Success. You ready yourself and throw your shoulder into the flimsy door. With a crackling sound and a shower of blue sparks, the door splits clean down the middle, the pieces falling in splinters to the ground.",
        );
        this.DestroyDoor(smash.outcomeSuccess);

        smash.outcomeFail = new StoryEventOutcome(
            "Fail. You crack your knuckles, grab tight the lever on the door, and begin pulling with all your might. A flash of light and a swirl of sorcery fills the air around you, something appears to be moving within it. Gods, magic is THE WORST.\n ",
        );
        let kinds = [
            GlobalConst.DWELLER_KIND.BUBBLE_EYES,
            GlobalConst.DWELLER_KIND.QUEX,
            GlobalConst.DWELLER_KIND.GIANT_BATS,
        ];

        smash.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(RandomUtil.instance.fromArray(kinds)));
        this.SpawnDamagedDoor(smash.outcomeFail);

        //PICK IT OPTION
        let pickit: StoryEventOption = new StoryEventOption(this);
        this.addOption(pickit);
        pickit.optionText = "Counterspell. A magic lock requires a magic key.";
        pickit.outcomeHint = "";
        let successRoll = new SuccessRoll(25, GlobalConst.ATTRIBUTES.SPIRIT);
        successRoll.AddTraitBonus(81, 25);
        pickit.AddSuccessCondition(successRoll);

        pickit.outcomeSuccess = new StoryEventOutcome(
            'Success. You summon a powerful incantation taught to you by a boastful mercenary at the Dappled Mare in Mudhill, who claimed to have broken into the Helmfirth Treasury single-handed. (Rudy or something? He looked like a Rudy). Sure enough, you hear a satisfying "clink" as some mechanism inside the door moves. ',
        );

        this.SpawnOpenDoor(pickit.outcomeSuccess);

        pickit.outcomeFail = new StoryEventOutcome(
            "Fail. You mutter a powerful incantation to free the door from its charm, but the door remains unmoved. Your fumbling magic appears to have triggered something as a swirl of sorcery fills the air around you.\n ",
        );
        pickit.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(RandomUtil.instance.fromArray(kinds)));
        this.SpawnDamagedDoor(pickit.outcomeFail);

        //LEAVE OPTIONS
        this.addLeaveOption(
            "It's exhausting. You come all the way down here, at great personal risk & expense, & there are locked doors everywhere.",
        );
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
