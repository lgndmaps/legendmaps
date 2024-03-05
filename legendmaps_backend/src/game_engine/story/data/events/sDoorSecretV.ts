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

export default class StoryEventDoorSecret extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V, GlobalConst.STORY_EVENT_CATEGORY.DOOR);
        this.ascii = "-";

        this.blocksVision = true;
        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 0; //doors never spawn randomly.

        this.titleCopy = "Secret Door";
        this.bodyCopy =
            "You almost miss the inset frame of the door as you pass the dungeon wall. The is made of a thick, heavy stone and has faint carvings of symbols scratched intro the surface. An unadorned keyhole is set into the door, covered is dust and cobwebs.";
        this.mapGraphic = "door_secret_v";

        //UNLOCK OPTION
        let unlock: StoryEventOption = new StoryEventOption(this);
        this.addOption(unlock);
        unlock.optionText = "Use a key to open the door.";
        unlock.outcomeHint = "Success: 100%. A key never fails. ";
        unlock.AddSuccessCondition(new SpendKeys(1));
        unlock.outcomeSuccess = new StoryEventOutcome("The door opens with a creak and a cloud of dust.");
        this.SpawnOpenDoor(unlock.outcomeSuccess);
        //this.AddChestLoot(unlock.outcomeSuccess);
        unlock.outcomeFail = new StoryEventOutcome(
            "Alas, you have no keys. Perhaps you might find some in the dungeon and return?",
        );
        unlock.outcomeFail.AddEndEvent(false);

        //BREAK IT OPTION
        let smash: StoryEventOption = new StoryEventOption(this);
        this.addOption(smash);
        smash.optionText = "Force it. Try to pry the door open.";
        smash.outcomeHint = "";
        smash.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.BRAWN));
        smash.outcomeSuccess = new StoryEventOutcome(
            "Success. You feel the weight of the heavy door as you place your hands on either side of the frame. Taking a deep breath, you slowly begin to push, feeling the tension in the hinges. You strain, slowly pushing harder and harder until it finally pops open, off its hinges, and the whole door crashes to the ground.",
        );
        this.DestroyDoor(smash.outcomeSuccess);
        smash.outcomeFail = new StoryEventOutcome(
            "Fail. You struggle to open the heavy door, but it won't budge. Your efforts do manage to dislodge some loose stones above the door which crash down on you.",
        );
        smash.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(5, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "stone door"),
        );
        this.SpawnDamagedDoor(smash.outcomeFail);

        //PICK IT OPTION
        let pickit: StoryEventOption = new StoryEventOption(this);
        this.addOption(pickit);
        pickit.optionText = "Pick lock. Ancient and rusted, but it can be picked.";
        pickit.outcomeHint = "";
        let successRoll = new SuccessRoll(25, GlobalConst.ATTRIBUTES.GUILE);
        successRoll.AddTraitBonus(81, 25);
        pickit.AddSuccessCondition(successRoll);

        pickit.outcomeSuccess = new StoryEventOutcome(
            "Success. It takes a few moments, but the lock's complexity is no match for your cunning. The door opens with a groan.",
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
