import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGiveCondition from "../effects/seGiveCondition";
import StoryEffectAttribute from "../effects/seAttribute";

export default class StoryEventLostToad extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.LOST_TOAD, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 1;

        this.titleCopy = "Lost Toad";
        this.bodyCopy =
            "You enter an overgrown room with all sorts of unfamiliar flora sprawling across the floor. It takes you a moment to realize that in the middle of the room sits a strikingly vibrant toad with abnormally large eyes. You recognize this as one of the many strange and wonderful toads that hail from the Uniswamp - or at least they once did, until the evil King Gremplin conquered it and renamed it the decidedly less friendly Grempland. But if this toad has managed to survive the Croakening, perhaps it's smarter than it looks.";
        this.mapGraphic = "dw_losttoad";

        // option 1 honor the dead
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Offer the toad some food. Surely this creature grows hungry, just as you do.";
        opt1.outcomeHint = "";

        let sr = new SuccessRoll(30, GlobalConst.ATTRIBUTES.SPIRIT);
        sr.AddTraitBonus(90, 45);
        sr.AddTraitBonus(92, 25);
        opt1.AddSuccessCondition(sr);

        opt1.outcomeSuccess = new StoryEventOutcome(
            "The toad approaches the offering slowly, and takes an exploratory nibble. After a moment, it swallows the rest whole, and bounds off to another part of the dungeon. You're patting yourself on the back for your selflessness when you realize the toad has left behind a olden ring. Perhaps this is the toad's way of saying, \"Thank you.\" You're welcome, toad.",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.RING]));
        // opt1.outcomeSuccess.AddStoryEffect(new StoryEffectAddEffect("Boon", GlobalConst.EFFECT_TYPES.SPIRIT, 1));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "The toad does not seem to like your offering. It starts croaking loudly. You cover your ears as it leaps off past you, but you fear that the sound, echoing down the corridor, might have been heard by some non-toads. ",
        );

        opt1.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.SHADOW_ELF));
        opt1.outcomeFail.AddEndEvent();

        // option 2 gravedigger
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Grab it. The aura of these creatures is said to have strange properties";
        opt2.outcomeHint = "permanent boost guile, at the cost of loss of brawn.";

        opt2.outcomeSuccess = new StoryEventOutcome(
            "You pretend to be uninterested and walk onward, and that's when you pounce! Toad in hand, you dream of riches at the animal market. You feel your mind & body shift as the slime on the toad's skin coats your hand. It locks eyes with you. Its hypnotic gaze compels you to think of the wretched life of an imprisoned toad, and the sorrow of it all loosens your grasp. The toads hops off, you nod as you realize toads were meant to live free. ",
        );

        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectAttribute(GlobalConst.ATTRIBUTES.GUILE, 2));
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectAttribute(GlobalConst.ATTRIBUTES.BRAWN, -1));

        opt2.outcomeSuccess.AddEndEvent();

        this.addLeaveOption("Toads can take care of themselves, you reason, plus they're slimy.  ");
    }
}
