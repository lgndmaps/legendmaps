import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectAttribute from "../effects/seAttribute";

export default class StoryEventLostPunk extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.LOST_PUNK, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = false;
        this.randomSpawnWeight = 0;

        this.titleCopy = "Lost Punk";
        this.bodyCopy =
            "All manner of dweller can be found in dungeons, but you feel as though the strange-looking punk, leaning nonchalantly against the cavern wall while reading their map, may not belong here. They grant you a head-nod as you approach, and sensing no danger, you engage them about their quest. They claim they were headed to some festivities in the Forest and got quite lost indeed. Perhaps you could aid them in finding their way, or failing that, help them pass the time here in the dungeon for a while.";
        this.mapGraphic = "dw_lostpunk";

        // option 1 honor the dead
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Give them directions. Attempt to read their map and guide them out of the dungeon.";
        opt1.outcomeHint = "";

        let sr = new SuccessRoll(50, GlobalConst.ATTRIBUTES.GUILE);
        sr.AddTraitBonus(28, 25);
        opt1.AddSuccessCondition(sr);

        opt1.outcomeSuccess = new StoryEventOutcome(
            'You are no expert, but you have spent a fair amount of time in dungeons. You compare your own map to theirs, and after some time, manage to find a common thread and direct the punk back to the entrance of this stretch of dungeon. The punk smiles and engages in a complex handshake with you that you don\'t entirely grasp, but the punk claims you are "good" and tosses you a shimmering object.',
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.WRIST]));
        // opt1.outcomeSuccess.AddStoryEffect(new StoryEffectAddEffect("Boon", GlobalConst.EFFECT_TYPES.SPIRIT, 1));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            'You are no expert, and frankly, it shows. After minutes of comparing both the punk\'s map and your own and making no headway, you opt to deliver a gormless speech about "seizing the day" as some sort of recompense for wasting their time so profoundly. The punk frowns and walks off without saying anything, and you feel as you did at the Midwinter Dance years ago, when no one was impressed by your flailing, irregular dancing.',
        );

        opt1.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Disappointment", GlobalConst.EFFECT_TYPES.SPIRIT, -2),
        );
        opt1.outcomeFail.AddEndEvent();

        // option 2 gravedigger
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Share some pipeweed. The punk seems keen to offer you some.";
        opt2.outcomeHint = "permanent boost spirit, at the cost of loss of agility.";

        opt2.outcomeSuccess = new StoryEventOutcome(
            "You use your flint & steel to light the punk's hand-rolled pipeweed, and the two of you are soon puffing away. The discussion soon drifts to the linguistic strangeness that this underworld you both find yourself in is also a world in and of itself, and if that's true, shouldn't there be, like, an under-underworld? A heady deliberation indeed! After some time, you feel you must continue onward, but your time with the punk has buoyed your heart and your mind. ",
        );

        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectAttribute(GlobalConst.ATTRIBUTES.SPIRIT, 2));
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectAttribute(GlobalConst.ATTRIBUTES.AGILITY, -1));

        opt2.outcomeSuccess.AddEndEvent();

        this.addLeaveOption(
            "You are apologetic as you explain you have never heard of this Forest, so you will be of no help. ",
        );
    }
}
