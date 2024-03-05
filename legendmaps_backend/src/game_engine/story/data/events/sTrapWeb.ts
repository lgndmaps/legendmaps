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
import StoryEffectGiveCondition from "../effects/seGiveCondition";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";

export default class StoryEventTrapWeb extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TRAP_WEB, GlobalConst.STORY_EVENT_CATEGORY.TRAP);

        this.blocksVision = false;

        this.titleCopy = "Web Trap.";
        this.bodyCopy =
            "Harmless-looking wisps of cobweb hang down in front of your path ahead, but you notice one that seems to be frozen in midair. It droops down unnaturally, and as you inspect it, you can see the nearly invisible strands of spider silk waiting to ensnare you. You breathe a sigh of relief for not blundering into it unaware, but the threat remains. How you deal with it now is a matter of some import.";
        this.mapGraphic = "trap_web";

        let jump: StoryEventOption = new StoryEventOption(this);
        this.addOption(jump);
        jump.optionText = "[AVOID] Work your way through the web slowly and avoid getting stuck.";
        jump.outcomeHint = "";
        jump.AddSuccessCondition(new SuccessRoll(35, GlobalConst.ATTRIBUTES.AGILITY));

        jump.outcomeSuccess = new StoryEventOutcome(
            "It's no easy feat, but bending and twisting around the hundreds of strands of spider-web seems to be working. You wisely engaged in your regimen of calisthenics before entering this dungeon, and the resulting limberness that it's granted you has allowed you to reach the other side a bit sweaty, but otherwise unharmed. ",
        );
        jump.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        jump.outcomeSuccess.AddEndEvent(false);

        jump.outcomeFail = new StoryEventOutcome(
            "On a warmer day, you tell yourself, you would've been able to do this. But the chill of the dungeon leaves your joints just a little stiff, and you're unable to get around one particular strand without falling flat on your face. The sound of your collapse draws the owners of the web, but at least you're not covered in spider silk. At least not until they consume you!",
        );
        jump.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());
        jump.outcomeFail.AddStoryEffect(new StoryEffectGiveCondition(5, GlobalConst.CONDITION.HELD));

        jump.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.GIANT_RAT));
        jump.outcomeFail.AddEndEvent(false);

        let fill: StoryEventOption = new StoryEventOption(this);
        this.addOption(fill);
        fill.optionText = "[DISARM] Slash through the web. It surely no match for some well placed cuts. ";
        fill.outcomeHint = "";
        fill.AddSuccessCondition(new TrapDisarmRoll(20, GlobalConst.ATTRIBUTES.GUILE));

        fill.outcomeSuccess = new StoryEventOutcome(
            "You weave your own web of glinting edges and broad slashes, rending the web into scraps that fall to the floor. You're quite proud of yourself until you remember that spiders can feel the vibrations of a web, and you've basically shaken the web to its very core. Best to get moving quickly. ",
        );
        fill.outcomeSuccess.AddStoryEffect(new StoryEffectPositionOnEvent());
        fill.outcomeSuccess.AddStoryEffect(new TrapDisarmReward());
        fill.outcomeSuccess.AddEndEvent(true);

        fill.outcomeFail = new StoryEventOutcome(
            "Perhaps last night was the wrong night to skip your customary sharpening routine you usually perform to keep your equipment in sterling condition, as your weapon is now hopelessly coated with spider-web. What's more, your frustrated attempts to clean it before moving on has given the spiders time to catch you in the act. It's decided: never skimp on maintenance! ",
        );
        fill.outcomeFail.AddStoryEffect(new StoryEffectPositionOnEvent());
        jump.outcomeFail.AddStoryEffect(new StoryEffectGiveCondition(5, GlobalConst.CONDITION.HELD));

        jump.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.GIANT_SPIDER));

        fill.outcomeFail.AddEndEvent(true);

        this.addLeaveOption("Turn back and let the web alone.  ");

        //While you do feel minor embarrassment at letting a hole in the ground tell you where you can and can't go, you also don't feel extreme embarrassment from dying by falling on a spike. Bingelorn the Bold died on a spike, and his family never lived it down.
    }
}
