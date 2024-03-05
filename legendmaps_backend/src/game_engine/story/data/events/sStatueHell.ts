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
import StoryEffectLuck from "../effects/seLuck";
import StoryEffectChangeMaxHP from "../effects/seChangeMaxHP";

export default class StoryEventStatueHell extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.STATUE_HELL, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 10;

        this.titleCopy = "Demonic Statue";
        this.bodyCopy =
            "you come across a large, imposing statue. It's carved from a deep, reddish-black stone, and it depicts a demonic creature with horns, wings, and a twisted, grotesque face. The statue is covered in intricate carvings and symbols, and it exudes a palpable sense of malevolence. As you approach, you feel a chill run down your spine, and you can't shake the feeling that the statue is watching you, waiting for the right moment to strike. You can feel the dark energy emanating from the statue.";
        this.mapGraphic = "statue_hell";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Smash It. ";
        opt1.outcomeHint = "";

        opt1.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.BRAWN));

        opt1.outcomeSuccess = new StoryEventOutcome(
            "In a fit of rage, you lash out at the statue, toppling it from it pedestal where it shatters on the floor in a cloud of red dust. You feel a weight lift from the air as the statue collapses, as if some evil force has been banished. The unleashed energy flows into you making you feel refreshed.",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectHeal(25));
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectAllAttributes("Blessing", 1, 80));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            " You try to push the statue over, but it doesn't budge. It seems to be rooted to the ground, and no matter how hard you try, you can't knock it down. Suddenly, you hear a loud, booming scream echoing in your own head. The statue begins to move of it's own under your hands. ",
        );
        opt1.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.DRAMOCK));
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Blood Ritual.";
        opt2.outcomeHint = "Permanently gain HP & lose luck";

        opt2.outcomeSuccess = new StoryEventOutcome(
            "In a moment of madness, you decide to sacrifice yourself to the statue. You take your dagger and deliberately stab yourself in the hand, offering your blood to the demonic entity. The statue pulses with energy, and you feel a dark power coursing through your veins. You know that you have made a terrible mistake, and you can only hope that the statue will be satisfied with your offering.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectLuck(-5));
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectChangeMaxHP(10));
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectHeal(20));
        opt2.outcomeSuccess.AddEndEvent();

        this.addLeaveOption("Best to leave something so obviously malevolent alone.");
    }
}
