import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGiveGold from "../effects/seGiveGold";
import StoryEffectLoseGold from "../effects/seLoseGold";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";

export default class StoryEventGoblinDice extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.GOBLIN_DICE, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 10;

        this.titleCopy = "A Goblin";
        this.bodyCopy =
            "The clatter of small objects inside a wooden box echoes softly down the corridor. Either a mountain orc is taunting you with his collection of teeth, or someone is mad enough to be gambling in a place such as this. A shifty-eyed goblin tosses a trio of dice into a box, over and over again. He pauses briefly when he sees you, but looks down and continues his game. " +
            '"Test your luck, adventurer? Beat me, and ten coins becomes twenty. Easy money!" ' +
            "He jingles his coin pouch as an enticement, but something tells you that his game may not be completely honest if he's won so much coin. ";
        this.mapGraphic = "npc";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Roll the dice. Take a chance and try to win the goblin's game.";
        opt1.outcomeHint = "";

        let sr3 = new SuccessRoll(25, GlobalConst.ATTRIBUTES.GUILE);
        sr3.AddTraitBonus(90, 30);
        sr3.AddTraitBonus(92, 50);
        opt1.AddSuccessCondition(sr3);

        opt1.outcomeSuccess = new StoryEventOutcome(
            "You toss the oddly shaped dice into the goblin's box. The goblin flashes you a jagged grin before rolling, but his face falls as he realizes he has lost." +
                'You steel yourself for a burst of outrage, but the goblin smiles at you with only a hint of menace. "A skillful roll, adventurer."',
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGiveGold(100, 400));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "You toss the oddly shaped dice into the goblin's box. The goblin flashes you a jagged grin before rolling, he barely glances down at his winning roll." +
                "The goblin shrugs, his eyes twinkling. \"Bad luck, adventurer! But like they say, you can't win if you don't play!\"",
        );
        opt1.outcomeFail.AddStoryEffect(new StoryEffectLoseGold(100, 400));
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Threaten. Inform him you'd like some of that easy money & won't be rolling dice.";
        opt2.outcomeHint = "";
        let sr2 = new SuccessRoll(25, GlobalConst.ATTRIBUTES.BRAWN);
        sr2.AddTraitBonus(91, 60);
        opt2.AddSuccessCondition(sr2);
        opt2.outcomeSuccess = new StoryEventOutcome(
            "The goblin squeals in fear. \"I'm sorry, adventurer! I didn't mean to offend you!\" He scurries away, leaving you with his coinpurse.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGiveGold(100, 400));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            'The goblin does not look intimidated. "You\'re not going to take my gold, adventurer!". He draws a small weapon and lunges at you.',
        );
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.GOBLIN));
        opt2.outcomeFail.AddEndEvent();

        this.addLeaveOption("You have no time for this goblin's foolish games.");
    }
}
