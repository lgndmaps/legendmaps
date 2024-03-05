import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SpendKeys from "../conditions/ecSpendKeys";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectPositionOnEvent from "../effects/sePositionOnEvent";
import StoryEffectPoison from "../effects/sePoison";
import StoryEffectDamage from "../effects/seDamage";
import TrapDisarmRoll from "../conditions/ecTrapDisarmRoll";
import TrapDisarmReward from "../effects/seTrapDisarmReward";

export default class StoryEventTrapPit extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TRAP_PIT, GlobalConst.STORY_EVENT_CATEGORY.TRAP);

        this.blocksVision = false;

        this.titleCopy = "Pit Trap.";
        this.bodyCopy =
            "Most adventurers don't pay much attention to what's beneath their feet, but you're not most adventurers. The slightest change in the texture of the ground in front of you catches your eye, and a quick scan of the surrounding area suggests that old favorite: a pit trap. You consider the best way to bypass it.";
        this.mapGraphic = "trap_pit";

        let jump: StoryEventOption = new StoryEventOption(this);
        this.addOption(jump);
        jump.optionText = "[AVOID] Leap across. Get a running start & jump over the trapped area.";
        jump.outcomeHint = "";
        jump.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.AGILITY));

        jump.outcomeSuccess = new StoryEventOutcome(
            "It's still quite a distance, but your odds are much better than average knowing where the pit begins and ends. You sprint up to the edge and leap… and land safely, if a bit clumsily, on the other side. Perhaps next time you should stretch first, but for now, you have crossed cleanly. ",
        );
        jump.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        jump.outcomeSuccess.AddEndEvent(false);

        jump.outcomeFail = new StoryEventOutcome(
            "Knowledge is power, they say, but unfortunately it doesn't make you jump any farther than before. You crash through the far end of the false floor with a feeling of true disappointment. Surely you deserve better than a pit full of spikes, right? Apparently not, it seems.",
        );
        jump.outcomeFail.AddStoryEffect(new StoryEffectDamage(30, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "Pit Trap"));
        jump.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());

        jump.outcomeFail.AddEndEvent(false);

        let fill: StoryEventOption = new StoryEventOption(this);
        this.addOption(fill);
        fill.optionText = "[DISARM] Throw debris into the pit. It's hard for a pit to hurt you if it's not so deep.";
        fill.outcomeHint = "";
        fill.AddSuccessCondition(new TrapDisarmRoll(20, GlobalConst.ATTRIBUTES.BRAWN));

        fill.outcomeSuccess = new StoryEventOutcome(
            "You manage to break the edge of the pit away and let it fall into the pit below. Caving in one of the sides renders the pit barely more than a depression, you'd say. You climb down and walk through it with pride. Perhaps a little too proudly, as the soft earth gives way and a tall spike pierces your foot. Painful yes, but not nearly so bad as death.  ",
        );
        fill.outcomeSuccess.AddStoryEffect(
            new StoryEffectDamage(2, false, GlobalConst.DAMAGE_TYPES.PIERCE, "Pit Trap"),
        );
        fill.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        fill.outcomeSuccess.AddStoryEffect(new TrapDisarmReward());
        fill.outcomeSuccess.AddEndEvent(true);

        fill.outcomeFail = new StoryEventOutcome(
            "You hurl a number of small rocks down, but the larger ones that might really help are too heavy for you to move. In fact, while trying to wrench one free, you lose your balance and fall back into the pit. But the tiny stones you tossed in earlier break your fall! Wait, not your fall. Your kneecaps.",
        );
        fill.outcomeFail.AddStoryEffect(new StoryEffectDamage(20, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "Pit Trap"));
        fill.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());

        fill.outcomeFail.AddEndEvent(true);

        this.addLeaveOption("Turn back. The easiest way to avoid a pit is to not step into it. ");

        //While you do feel minor embarrassment at letting a hole in the ground tell you where you can and can't go, you also don't feel extreme embarrassment from dying by falling on a spike. Bingelorn the Bold died on a spike, and his family never lived it down.
    }
}
