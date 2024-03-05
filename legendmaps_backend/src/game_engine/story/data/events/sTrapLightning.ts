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
import StoryEffectAddEffect from "../effects/seAddEffect";

export default class StoryEventTrapLightning extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TRAP_LIGHTNING, GlobalConst.STORY_EVENT_CATEGORY.TRAP);

        this.blocksVision = false;

        this.titleCopy = "Lightning Trap.";
        this.bodyCopy =
            "A floor like any other stands in front of you, save for the thin wires running along the stone tiles. You're not sure what will happen if you do touch it, but you assume it's unlikely to be good. You take a moment to consider the best way forward.";
        this.mapGraphic = "trap_shock";

        let smash: StoryEventOption = new StoryEventOption(this);
        this.addOption(smash);
        smash.optionText = "[DESTROY] If you smash the mechanism completely, you're in the clear.";
        smash.outcomeHint = "";
        smash.AddSuccessCondition(new SuccessRoll(35, GlobalConst.ATTRIBUTES.BRAWN));

        smash.outcomeSuccess = new StoryEventOutcome(
            "The trick to smashing it without touching is to make sure you move quickly. With this simple dungeon trick, you've reduced the trapped floor tile to rubble within seconds with only minimal damage to yourself and your belongings. ",
        );
        smash.outcomeSuccess.AddStoryEffect(
            new StoryEffectDamage(5, true, GlobalConst.DAMAGE_TYPES.ELECTRIC, "Lightning Trap"),
        );
        smash.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        smash.outcomeSuccess.AddEndEvent(true);

        smash.outcomeFail = new StoryEventOutcome(
            "Seconds into this plan, you realize its fatal flaw: you are not very accurate when slamming your weapon into the floor. All it takes is one stumble and you've made contact with the trap. As you spasm violently from the shocks, you resolve to practice your swings to prevent this sort of thing in the future.",
        );
        smash.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(30, true, GlobalConst.DAMAGE_TYPES.ELECTRIC, "Lightning Trap"),
        );
        smash.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());

        smash.outcomeFail.AddEndEvent(false);

        let disarm: StoryEventOption = new StoryEventOption(this);
        this.addOption(disarm);
        disarm.optionText = "[DISARM] Disconnecting the wire should allow you to continue.";
        disarm.outcomeHint = "";
        disarm.AddSuccessCondition(new TrapDisarmRoll(20, GlobalConst.ATTRIBUTES.GUILE));

        disarm.outcomeSuccess = new StoryEventOutcome(
            "Ultimately disconnecting the wire proves easier than expected, thanks to your pocket knife with the insulated grip. The shopkeep touted it as being 'revolutionary' and charged you extra for it, but you see now he was right - you're living the future via edged tools.   ",
        );
        disarm.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        disarm.outcomeSuccess.AddStoryEffect(new TrapDisarmReward());
        disarm.outcomeSuccess.AddEndEvent(true);

        disarm.outcomeFail = new StoryEventOutcome(
            "You've never fully understood the concept of electricity, and it seems you're no closer now, after using your knife edge to free the wire from the handle, all while holding the knife. You drop the knife quickly, so perhaps you've saved your body wear and tear at the cost of the embarrassment of not learning your lesson. ",
        );
        disarm.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(20, true, GlobalConst.DAMAGE_TYPES.ELECTRIC, "Lightning Trap"),
        );
        disarm.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Shocked", GlobalConst.EFFECT_TYPES.AGILITY, -3, -1, 30),
        );
        disarm.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());

        disarm.outcomeFail.AddEndEvent(true);

        this.addLeaveOption("Step back and return the way you came. ");

        //While you do feel minor embarrassment at letting a hole in the ground tell you where you can and can't go, you also don't feel extreme embarrassment from dying by falling on a spike. Bingelorn the Bold died on a spike, and his family never lived it down.
    }
}
