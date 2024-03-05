import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGiveGold from "../effects/seGiveGold";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGiveCondition from "../effects/seGiveCondition";

export default class StoryEventPortal extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.PORTAL, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 10;

        this.titleCopy = "Strange Sorcerer";
        this.bodyCopy =
            'A robed figure approaches you from the shadows, though surely there was not enough room for them in the alcove they stepped from. You see the glint of a smile with strange reddened teeth from behind the hood as the figure extends their hand cordially."You are strong, adventurer, but have you truly tested yourself? Do you dare to battle a real threat?" the figure asks between ragged breaths. The figure\'s thin hands move with precision and focus as they open a summoning portal, which casts a sickening green light on the rough stone floor. "Defeat the dwellers & I shall reward you."';
        this.mapGraphic = "npc";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Face the challenge.";
        opt1.outcomeHint = "";
        opt1.outcomeSuccess = new StoryEventOutcome(
            "The sorcerer hands you an aged parchment & a you feel a surge of knowledge. He flicks his other hand and shapes begin to emerge from the portal. Even before they have arrived the figure himself disappears in flash of silvery sparks.",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateDwellers(null, null, 1));
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGiveCondition(250, GlobalConst.CONDITION.INSIGHT));
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.SCROLL]));
        opt1.outcomeSuccess.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        let sr = new SuccessRoll(25, GlobalConst.ATTRIBUTES.BRAWN);
        sr.AddTraitBonus(91, 90);
        opt2.AddSuccessCondition(sr);
        opt2.optionText = "Threaten him. How about a reward and no dweller challenge?";
        opt2.outcomeHint = "";
        opt2.outcomeSuccess = new StoryEventOutcome(
            "The figure's cool demeanor cracks as he laughs nervously. 'I suppose I can give you a small gift to help in your journey, no need for violence'. He hands you a scroll than quickly scuttles into his own portal which disappears with a flash of silvery sparks.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.SCROLL]));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "The figure shakes his head sadly at you as he finishes his incantation. Shapes begin to emerge from the portal. Even before they have arrived the figure himself disappears in flash of silvery sparks.",
        );
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(null, null, 2));
        opt2.outcomeFail.AddEndEvent();

        //OPTION 3
        let opt3: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt3);
        opt3.optionText = "Steal. He wears pretty sweet looking hat under that cowl.";
        opt3.outcomeHint = "";
        let sr3 = new SuccessRoll(20, GlobalConst.ATTRIBUTES.AGILITY);
        sr3.AddTraitBonus(79, 30);
        sr3.AddTraitBonus(92, 35);
        opt3.AddSuccessCondition(sr3);

        opt3.outcomeSuccess = new StoryEventOutcome(
            "You pause for a moment, pretending to consider the mage's offer. In a flash you reach out and snag the hat off his head, pushing him into his own portal with your other hand. The figure lets out a yelp as he fall in, disappearing in a flash of silvery sparks.",
        );
        opt3.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.HAT]));
        opt3.outcomeSuccess.AddEndEvent();

        opt3.outcomeFail = new StoryEventOutcome(
            "The figure nimbly dodges. He shakes his head sadly at you. Shapes begin to emerge from the portal. Even before they have arrived the figure himself disappears in flash of silvery sparks.",
        );
        opt3.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(null, null, 2));
        opt3.outcomeFail.AddEndEvent();

        this.addLeaveOption("You have no need for additional challenges, this dungeon is trying enough.");
    }
}
