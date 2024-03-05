import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectAllAttributes from "../effects/seEffectAllAttributes";
import StoryEffectGiveCondition from "../effects/seGiveCondition";
import StoryEffectAddEffect from "../effects/seAddEffect";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGiveGold from "../effects/seGiveGold";
import StoryEffectDamage from "../effects/seDamage";

export default class StoryEventStatue extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.STATUE, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 12;

        this.titleCopy = "Ancient Statue";
        this.bodyCopy =
            "A curious-looking statue of a woman sits on a worn plinth, with the inscription below in a language you neither understand nor recognize. The sculptor responsible must've been quite a talent however, as the statue has an uncannily lifelike quality to her sad expression. Your gaze returns to the statue over and over as you explore the room, so you decide to investigate more closely.";
        this.mapGraphic = "statue_1";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Sing. A strange compulsion to perform to the statue grips you.";
        opt1.outcomeHint = "";

        opt1.AddSuccessCondition(new SuccessRoll(50, GlobalConst.ATTRIBUTES.GUILE));

        opt1.outcomeSuccess = new StoryEventOutcome(
            "You remember the melody to the lullaby your mother once used to put you to bed, and somehow the words come to you as you begin to sing it. You're quite certain this is the best you've ever sung before, but something about standing in front of this situation brings out your natural talent. As you finish, you feel as though perhaps it was not such a strange compulsion after all, and you whistle as you return to the dungeon. You feel a surge of new energy, your feet moving faster than seems possible.",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGiveCondition(120, GlobalConst.CONDITION.HASTED));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            'You feel compelled to regale the statue with a spirited rendition of "The Merriment of the Marmonian Maids in the Meadow," but it\'s a tricky song under ideal conditions, especially when you yourself are not much of a singer. You continue on to the bitter end, but the shame you feel will linger for some time. ',
        );
        opt1.outcomeFail.AddStoryEffect(new StoryEffectAddEffect("Shame", GlobalConst.EFFECT_TYPES.SPIRIT, -2));
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Smash. Its presence is unnatural and you will not abide it. ";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(40, GlobalConst.ATTRIBUTES.BRAWN));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "You get beneath the statue and give it a powerful shove; it slides from its stand and shatters on the rough ground. You smirk with the philistine's satisfaction of having ruined something truly beautiful. You collect the gold inlay at the statue's edge, and come away with gold, but the more time you spend looking at the statue, the more you regret the barbarism of your actions.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGiveGold(100, 400));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "You put all of your weight into a solid push against the statue, and it rocks away from you before returning to its regular position. Then, of course, it rocks forward and falls on top of you, remaining largely undamaged. You are not so lucky.",
        );
        opt2.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(9, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "crumbling statue"),
        );
        opt2.outcomeFail.AddEndEvent();

        this.addLeaveOption("Something about this sculpture makes you uneasy.");
    }
}
