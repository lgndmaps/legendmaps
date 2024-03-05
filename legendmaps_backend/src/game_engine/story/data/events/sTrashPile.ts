import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectGiveGold from "../effects/seGiveGold";
import StoryEffectPoison from "../effects/sePoison";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectAllAttributes from "../effects/seEffectAllAttributes";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectHeal from "../effects/seHeal";
import StoryEffectHunger from "../effects/seHunger";

export default class StoryEventTrashPile extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TRASH_PILE, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 15;

        this.titleCopy = "Trash Pile.";
        this.bodyCopy =
            "In the corner of the chamber is a heap of broken and twisted shapes. At first glance it appears to be some discarded clothing and armor, or perhaps the dismembered and long-decomposed remains of an adventurer. Whatever it is - or was - it's long past being of any use to you.";
        this.mapGraphic = "pile";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Search & Salvage. One adventurer's trash is THIS adventurer's treasure.";
        opt1.outcomeHint = "";

        let sr = new SuccessRoll(45, GlobalConst.ATTRIBUTES.GUILE);
        sr.AddTraitBonus(54, 25);
        opt1.AddSuccessCondition(sr);

        opt1.outcomeSuccess = new StoryEventOutcome(
            "Hot blood pudding, you've done it! Inside a disintegrated leather pouch you discover some coins! You feel a little gross, yes, but as they say, treasure is soap for the soul.",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGiveGold(100, 200));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "And… nothing. You stand back up and look around sheepishly, grateful that no other adventurers are around to have watched you burrow in the trash like a rat.",
        );
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Wary approach. Mayhaps it is a trap.";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(35, GlobalConst.ATTRIBUTES.AGILITY));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "You plunge your weapon into the heap and hear a pleasant *thunk*. You peel back some rusted scraps of metal to reveal a helm, in excellent condition. Your cautious fascination with trash has paid dividends once more!",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.HELM]));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "You draw your weapon and approach the heap carefully, giving it a firm prod. With a shriek, a Crawler rises up, its eyes glowing with rage! Why would it hide here? Why didn't you leave a trash pile alone? It makes no sense!",
        );
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.CRAWLER));
        opt2.outcomeFail.AddEndEvent();

        //OPTION 3
        let opt3: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt3);
        opt3.optionText = "Make it nice. Clean up the mess.";
        opt3.outcomeHint = "";
        let sr3 = new SuccessRoll(40, GlobalConst.ATTRIBUTES.SPIRIT);
        sr3.AddTraitBonus(31, 30);
        opt3.AddSuccessCondition(sr3);

        opt3.outcomeSuccess = new StoryEventOutcome(
            "This is a dungeon, not a village midden. The least you can do is tidy up a bit. You set to work sorting through the rubbish, folding and stacking the cloth, putting pieces of rubble into the cracks in the brick work, when you come across a shield, in nearly perfect condition. Of course - this pile of trash was once an adventurer, and this shield must have failed to save the poor fool. Discoverers Recoverers!",
        );
        opt3.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.SHIELD]));
        opt3.outcomeSuccess.AddEndEvent();

        opt3.outcomeFail = new StoryEventOutcome(
            "After a few short minutes you've made neatly sorted stacks up against the wall - metals, rubble, cloth and human remains. Sure, there's nothing remotely worth taking, but knowing you've made this dungeon a little more presentable is its own kind of treasure.",
        );
        opt3.outcomeFail.AddEndEvent();

        this.addLeaveOption(
            "You are an ADVENTURER, not some RUBBISH GREMLIN rooting through LITERAL REFUSE for teeth & silver embroidery thread.",
        );
    }
}
