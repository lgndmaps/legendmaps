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

export default class StoryEventTrapSpikedWall extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TRAP_SPIKED_WALL, GlobalConst.STORY_EVENT_CATEGORY.TRAP);

        this.blocksVision = false;

        this.titleCopy = "Spiked Trap.";
        this.bodyCopy =
            "Most adventurers don't pay much attention to what's beneath their feet, but you're not most adventurers. The slightest change in the texture of the ground in front of you catches your eye, and a quick scan of the surrounding area suggests that old favorite: a pit trap. You consider the best way to bypass it.";
        this.mapGraphic = "trap_spikedwall";

        let dash: StoryEventOption = new StoryEventOption(this);
        this.addOption(dash);
        dash.optionText = "[AVOID] Get a head start and with enough speed, the trap won't matter.";
        dash.outcomeHint = "";
        dash.AddSuccessCondition(new SuccessRoll(35, GlobalConst.ATTRIBUTES.AGILITY));

        dash.outcomeSuccess = new StoryEventOutcome(
            "The creator of such a trap wouldn't be expecting a victim to be running full tilt past it, so all you need do is run as fast as you can and you'll be fine. You take a deep breath and summon all your speed to propel you through. And with the sickening crunch behind you, you know you've made it! You let out a whoop for joy before you collide with the far wall at top speed. ",
        );
        dash.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        dash.outcomeSuccess.AddStoryEffect(
            new StoryEffectDamage(3, true, GlobalConst.DAMAGE_TYPES.PIERCE, "Spike Trap"),
        );
        dash.outcomeSuccess.AddEndEvent(false);

        dash.outcomeFail = new StoryEventOutcome(
            "You're hoping the trapped wall isn't terribly long, but there's unfortunately no way to tell without triggering the trap. You build up some speed and fix your eyes on the other side. But it's perhaps the moment when you look to the side to see if you've made that slows you just enough to get pinched by the last few spikes of the wall. Next time, focus!",
        );
        dash.outcomeFail.AddStoryEffect(new StoryEffectDamage(20, true, GlobalConst.DAMAGE_TYPES.PIERCE, "Spike Trap"));
        dash.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());

        dash.outcomeFail.AddEndEvent(false);

        let disarm: StoryEventOption = new StoryEventOption(this);
        this.addOption(disarm);
        disarm.optionText = "[DISARM] Hurl a heavy enough stone at the trigger and it might set it off.";
        disarm.outcomeHint = "";
        disarm.AddSuccessCondition(new TrapDisarmRoll(20, GlobalConst.ATTRIBUTES.BRAWN));

        disarm.outcomeSuccess = new StoryEventOutcome(
            "It seems a bit brutish in the face of the inspired engineering of the trap ahead, but sometimes the simplest solutions are the best. You struggle with a sizable rock and drop it on the trigger, stumbling backward with the effort. The trap snaps closed, and you remain unpunctured. You did land on a sharp rock, however, but overall: not so bad. ",
        );
        disarm.outcomeSuccess.AddStoryEffect(
            new StoryEffectDamage(5, false, GlobalConst.DAMAGE_TYPES.PIERCE, "Spike Trap"),
        );
        disarm.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        disarm.outcomeSuccess.AddStoryEffect(new TrapDisarmReward());
        disarm.outcomeSuccess.AddEndEvent(true);

        disarm.outcomeFail = new StoryEventOutcome(
            "You reason that the rock will need to be quite large to trigger the trap, so you wrap your arms around the largest one you can find. Trying to drag it to the trigger is a more difficult matter though, and you're forced to get low and use your leverage to muscle the stone into place. Of course, a little precision might have served you well, as you both trigger the trap and push yourself directly into its path. On the upside, the big rock does cushion the blow a bit. ",
        );
        disarm.outcomeFail.AddStoryEffect(new StoryEffectDamage(30, true, GlobalConst.DAMAGE_TYPES.PIERCE, "Pit Trap"));
        disarm.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());

        disarm.outcomeFail.AddEndEvent(true);

        this.addLeaveOption("Turn back and try another path. ");

        //While you do feel minor embarrassment at letting a hole in the ground tell you where you can and can't go, you also don't feel extreme embarrassment from dying by falling on a spike. Bingelorn the Bold died on a spike, and his family never lived it down.
    }
}
