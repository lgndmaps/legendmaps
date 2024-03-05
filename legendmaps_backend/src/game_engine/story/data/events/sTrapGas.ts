import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectPositionOnEvent from "../effects/sePositionOnEvent";
import StoryEffectDamage from "../effects/seDamage";
import TrapDisarmRoll from "../conditions/ecTrapDisarmRoll";
import TrapDisarmReward from "../effects/seTrapDisarmReward";
import StoryEffectAllAttributes from "../effects/seEffectAllAttributes";

export default class StoryEventTrapGas extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TRAP_GAS, GlobalConst.STORY_EVENT_CATEGORY.TRAP);

        this.blocksVision = false;

        this.titleCopy = "Gas Trap.";
        this.bodyCopy =
            "A conspicuously placed green tile gives you pause. You note rubber gaskets at the edges: someone is hoping to fill this area with poison gas. You debate what to do about the trapped tile.";
        this.mapGraphic = "trap_gas";

        let avoid: StoryEventOption = new StoryEventOption(this);
        this.addOption(avoid);
        avoid.optionText = "[AVOID] You're tough enough; let us see what this gas can do.";
        avoid.outcomeHint = "";
        avoid.AddSuccessCondition(new SuccessRoll(30, GlobalConst.ATTRIBUTES.BRAWN));

        avoid.outcomeSuccess = new StoryEventOutcome(
            "It's an unconventional strategy, but you were always the best at holding your breath when you went diving at Gyrtle's Cove with your friends. You take a deep breath and trigger the gas. Against all reason, your stalwart lungs serve you well, and you only breath in a minimum of toxic fumes before the doors reopen. ",
        );
        avoid.outcomeSuccess.AddStoryEffect(
            new StoryEffectDamage(1, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "Gas Trap"),
        );
        avoid.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        avoid.outcomeSuccess.AddEndEvent(false);

        avoid.outcomeFail = new StoryEventOutcome(
            "You're not exactly sure why this seemed like a good idea as noxious gas makes its way up your nose, causing you to retch and inhale even more of the pungent vapor. At least this will be a fun story to tell a group of grizzled adventurers later in life. This of course assumes you have a later in life. ",
        );
        avoid.outcomeFail.AddStoryEffect(new StoryEffectDamage(20, true, GlobalConst.DAMAGE_TYPES.POISON, "Gas Trap"));
        avoid.outcomeFail.AddStoryEffect(new StoryEffectAllAttributes("Gas", -2, 30));
        avoid.outcomeFail.AddEndEvent(false);

        let disarm: StoryEventOption = new StoryEventOption(this);
        this.addOption(disarm);
        disarm.optionText = "[DISARM] If the pressure plate can be jammed, you can leave safely.";
        disarm.outcomeHint = "";
        disarm.AddSuccessCondition(new TrapDisarmRoll(20, GlobalConst.ATTRIBUTES.GUILE));

        disarm.outcomeSuccess = new StoryEventOutcome(
            "After cutting some of the rubber gaskets from the tile, you're able to wedge them into the crack between the pressure plate and the floor. You test it gingerly, and nothing happens. You're about to jump on it to see how sturdy the gasket is, but you think better of it and move on.  ",
        );
        disarm.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        disarm.outcomeSuccess.AddStoryEffect(new TrapDisarmReward());
        disarm.outcomeSuccess.AddEndEvent(true);

        disarm.outcomeFail = new StoryEventOutcome(
            "As you test the edge of the tile by pressing your hand on it, you realize your understanding of how a pressure plate works is not great. It slams down with a click and can't be budged. Well, maybe if you weren't choking on the bitter effluvium of the trap, you'd be able to budge it, but right now, you're indisposed.",
        );
        disarm.outcomeFail.AddStoryEffect(new StoryEffectDamage(20, true, GlobalConst.DAMAGE_TYPES.POISON, "Gas Trap"));
        disarm.outcomeFail.AddStoryEffect(new StoryEffectAllAttributes("Gas", -2, 30));
        disarm.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());

        disarm.outcomeFail.AddEndEvent(true);

        this.addLeaveOption(
            "The best offense is a good defense, and the best defense against traps is to avoid them. ",
        );

        //While you do feel minor embarrassment at letting a hole in the ground tell you where you can and can't go, you also don't feel extreme embarrassment from dying by falling on a spike. Bingelorn the Bold died on a spike, and his family never lived it down.
    }
}
