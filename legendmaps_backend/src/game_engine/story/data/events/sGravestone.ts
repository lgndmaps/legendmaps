import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGiveCondition from "../effects/seGiveCondition";

export default class StoryEventGravestone extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.GRAVESTONE, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 12;

        this.titleCopy = "A lone gravestone";
        this.bodyCopy =
            "A single gravestone juts out from the earth, marking the passing of some soul unfortunate enough to have died down here, but somehow fortunate enough to have secured burial services prior to death. You kneel down to read the inscription, but the letters have faded beyond recognition.";
        this.mapGraphic = "grave_2";

        // option 1 honor the dead
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Honor the dead";
        opt1.outcomeHint = "Blessing. ";

        opt1.AddSuccessCondition(new SuccessRoll(60, GlobalConst.ATTRIBUTES.SPIRIT));

        opt1.outcomeSuccess = new StoryEventOutcome(
            "Your compassionate words comfort the spirit of the deceased, letting them believe for a moment they didn't fall in battle to an embarrassing foe like a skell, but instead a respectable foe, like a dead knight (also known as the Gentleman's Skell).",
        );
        opt1.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Ancestor's Boon", GlobalConst.EFFECT_TYPES.SPIRIT, 2),
        );
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "Your halting words anger the spirit of the deceased, for you have implied their own cowardice was their downfall, and not the many, many wounds they sustained while running away.",
        );

        opt1.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Ancestor's Curse", GlobalConst.EFFECT_TYPES.SPIRIT, -1),
        );
        opt1.outcomeFail.AddEndEvent();

        // option 2 gravedigger
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Dig up the grave and look for treasure";
        opt2.outcomeHint = "Possible loot? ";
        let sr = new SuccessRoll(35, GlobalConst.ATTRIBUTES.GUILE);
        sr.AddTraitBonus(30, 30);
        opt2.AddSuccessCondition(sr);

        opt2.outcomeSuccess = new StoryEventOutcome(
            "Eureka! You hit paydirt, and have only the filth of the grave beneath your fingernails as a downside... you think.",
        );
        opt2.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Curse", GlobalConst.EFFECT_TYPES.SPIRIT, -1, -1, 50),
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot());

        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "Why would you not heed the words of your local cleric, and let the dead rest? It was a situation EXACTLY like this that they were referring to! Also, look out!",
        );

        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.ZOMBIE));
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGiveCondition(20, GlobalConst.CONDITION.DISEASED));

        opt2.outcomeFail.AddEndEvent();

        this.addLeaveOption("Nod solemnly and move on.");
    }
}
