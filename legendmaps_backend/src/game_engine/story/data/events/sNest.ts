import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectAllAttributes from "../effects/seEffectAllAttributes";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectHeal from "../effects/seHeal";
import StoryEffectHunger from "../effects/seHunger";
import StoryEffectPoison from "../effects/sePoison";
import StoryEffectAttribute from "../effects/seAttribute";
import StoryEffectDamage from "../effects/seDamage";

export default class StoryEventNest extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.WASPNEST, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 10;

        this.titleCopy = "Wasp's Nest";
        this.bodyCopy =
            "You come across a massive wasp's nest. It's made of a thick, grey, sticky substance, doubtless assembled from whatever matter the wasps could find in the dungeon. You can see nestled inside are several translucent amber eggs, bigger than your fist.";
        this.mapGraphic = "waspnest";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Snack. The eggs look surprisingly tasty.";
        opt1.outcomeHint = "";

        opt1.AddSuccessCondition(new SuccessRoll(30, GlobalConst.ATTRIBUTES.SPIRIT));

        opt1.outcomeSuccess = new StoryEventOutcome(
            "The egg is delicious but you immediately feel you've made a mistake. Your blood boils. Yet you also feel new power in your muscles. That which does not kill you... assuming it does not kill you.",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectPoison(8));
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectAttribute(GlobalConst.ATTRIBUTES.BRAWN, 1));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "The egg is delicious but you immediately feel you've made a mistake, you try to spit out the half eaten egg as you can feel toxin seeping in.",
        );
        opt1.outcomeFail.AddStoryEffect(new StoryEffectPoison(3));
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Burn it. One less hazard in the dungeon.";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(35, GlobalConst.ATTRIBUTES.GUILE));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "The nest quickly catches fire, burning brightly and illuminating the entire chamber. As the flames fade you are surprised to find something lying in the ashes below the nest.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "The nest quickly catches fire, so quickly in fact you are forced to scramble backwards. But too slow, the flames catch your clothes and you are forced to drop to the ground rolling around madly trying to extinguish them.",
        );
        opt2.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(15, true, GlobalConst.DAMAGE_TYPES.FIRE, "flaming wasp nest"),
        );
        opt2.outcomeFail.AddEndEvent();

        this.addLeaveOption("You'll be long gone before these eggs hatch. ");
    }
}
