import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGiveCondition from "../effects/seGiveCondition";
import StoryEffectAllAttributes from "../effects/seEffectAllAttributes";
import StoryEffectDamage from "../effects/seDamage";
import StoryEffectHeal from "../effects/seHeal";
import StoryEffectHunger from "../effects/seHunger";

export default class StoryEventTree extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TREE, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 10;

        this.titleCopy = "Mysterious Tree";
        this.bodyCopy =
            "In the middle of this chamber sprouts an ancient tree, its gnarled roots pushing up the stones on the floor, branches reaching up and snaking along the ceiling. The tree is bathed in a soft glow, a calm and natural oasis amidst the carnage of this place. You ponder how it is possible for a tree to have grown so old without any apparent source of light or water. Perhaps, like yourself, it owes its survival to the occasional kindness of strangers.";
        this.mapGraphic = "pine";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Offering. A meager offering, open your flask and pour a trickle of water.";
        opt1.outcomeHint = "";

        opt1.AddSuccessCondition(new SuccessRoll(50, GlobalConst.ATTRIBUTES.SPIRIT));

        opt1.outcomeSuccess = new StoryEventOutcome(
            "The glow surrounding the tree envelops you. You feel empowered as magic flows through your veins.",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectAllAttributes("Nature's Blessing", 2, 80));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome("The water disappears into the ground. Nothing happens.");
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Attempt to craft a wand from the branches.";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(35, GlobalConst.ATTRIBUTES.GUILE));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "You carefully select a branch, examining it for the perfect size and shape. You use your knife to carefully whittle away at the branch, shaping it. You can already feel power coursing through the wood. Before you have a chance to appreciate your handiwork you realize you are not alone. It was only one branch, but taking it seems to have summoned the forest's protectors.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.WAND]));
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.FEY_WING));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "You break off a likely branch, and not long after realize you don't know much about wand crafting. After some desultory carving you find yourself holding a rather normal looking stick with some childish scratches on the surface. Worse, your desecration of the tree seems to have summoned the forest's protectors.",
        );
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.FEY_WING));
        opt2.outcomeFail.AddEndEvent();

        //OPTION 3
        let opt3: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt3);
        opt3.optionText = "Rest. Looks like a safe place to nap.";
        opt3.outcomeHint = "Heal, but time will pass.";
        opt3.outcomeSuccess = new StoryEventOutcome(
            "You realize you have seen this tree before - it grew in the ranging hills outside your childhood home. You suddenly yearn for nothing so much as a rest under this tree, free from the cares and burdens of your adult life. You sit, weary, amongst its tangled roots and fall into a sleep that is, for the first time in recent memory, peaceful. Not sure how much time has passed, you awaken refreshed, but a little hungry.",
        );
        opt3.outcomeSuccess.AddStoryEffect(new StoryEffectHeal(25));
        opt3.outcomeSuccess.AddStoryEffect(new StoryEffectHunger(-25));
        opt3.outcomeSuccess.AddEndEvent();

        this.addLeaveOption(
            "You didn't come to this dungeon to look at some withered tree in an empty room. Natural magicks are for nudists and weaklings!",
        );
    }
}
