import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SpendKeys from "../conditions/ecSpendKeys";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectLoseGold from "../effects/seLoseGold";

export default class StoryEventChest extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.BASIC_CHEST, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.blocksVision = false;

        this.allowRandomSpawns = false; //FALSE because chest spawns are handled on their own.
        this.randomSpawnWeight = 20;

        this.titleCopy = "Chest";
        this.bodyCopy =
            "What have we here? A weathered, wooden chest, closed tight. You give the lid a test: locked, and with one of considerable heft and complexity. But when you give it a swift kick, you hear potentially valuable contents rattling around. Surely there is some way to obtain the riches within.";
        this.mapGraphic = "chest";

        //UNLOCK OPTION
        let unlock: StoryEventOption = new StoryEventOption(this);
        this.addOption(unlock);
        unlock.optionText = "Use a key to open the chest.";
        unlock.outcomeHint = "Success: 100%. A key never fails. ";
        unlock.AddSuccessCondition(new SpendKeys(1));
        unlock.outcomeSuccess = new StoryEventOutcome(
            "With a satisfying 'click' the chest unlocks, and its contents are revealed.",
        );
        this.AddChestLoot(unlock.outcomeSuccess);
        unlock.outcomeFail = new StoryEventOutcome(
            "Alas, you have no keys. Perhaps you might find some in the dungeon and return?",
        );
        unlock.outcomeFail.AddEndEvent(false);

        //BREAK IT OPTION
        let smash: StoryEventOption = new StoryEventOption(this);
        this.addOption(smash);
        smash.optionText = "Smash it. The chest is sturdy, but not indestructible.";
        smash.outcomeHint = "";
        smash.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.BRAWN));
        smash.outcomeSuccess = new StoryEventOutcome(
            "Success. It's not an easy one to beat, but you're no slouch in the 'opening things designed to stay closed' department. Sweat forms at your brow as you work a bit of iron around the lock's insides, only to hear a satisfying click after a few minutes. The chest opens and you help yourself to its contents of (x gold or valuable) before moving on.",
        );
        this.AddChestLoot(smash.outcomeSuccess);
        smash.outcomeFail = new StoryEventOutcome(
            "Fail. Despite being made of wood, the chest is all but impregnable to your feeble efforts. You give it one last kick out of frustration, and as you turn away, you realize the noise you've made has summoned the owners of the chest. ",
        );
        smash.outcomeFail.AddStoryEffect(new StoryEffectLoseGold(1, 1));

        smash.outcomeFail.AddEndEvent();

        //PICK IT OPTION
        let pickit: StoryEventOption = new StoryEventOption(this);
        this.addOption(pickit);
        pickit.optionText = "Pick lock. It's a strong lock to be sure, but every lock has its weaknesses.";
        pickit.outcomeHint = "";
        let successRoll = new SuccessRoll(25, GlobalConst.ATTRIBUTES.AGILITY);
        successRoll.AddTraitBonus(25, 20);
        successRoll.AddTraitBonus(81, 40);
        pickit.AddSuccessCondition(successRoll);
        pickit.outcomeSuccess = new StoryEventOutcome(
            "Success. The chest is no match for your fury, raining blows upon it until the lid has been reduced to flinders. Some of the treasure inside is perhaps a little worse for wear. Take that, you useless box!",
        );
        this.AddChestLoot(pickit.outcomeSuccess);

        pickit.outcomeFail = new StoryEventOutcome(
            "Fail. Not only were you unable to open the chest, you somehow managed to wedge a coin you were using for leverage into the keyhole, and now it's stuck fast. You pray no other adventurers bore witness to your incompetence, or worse, your stinginess, as you tried for minutes to reclaim your coin. ",
        );
        pickit.outcomeFail.AddStoryEffect(new StoryEffectLoseGold(1, 1));
        pickit.outcomeFail.AddEndEvent();

        //LEAVE OPTIONS
        this.addLeaveOption("It's not worth the effort.");
    }

    AddChestLoot(successOutcome: StoryEventOutcome) {
        successOutcome.outcomeText += "\nYou find: ";
        successOutcome.AddStoryEffect(
            new StoryEffectGenerateLoot(1, "any", [
                GlobalConst.RARITY.UNCOMMON,
                GlobalConst.RARITY.UNCOMMON,
                GlobalConst.RARITY.RARE,
                GlobalConst.RARITY.EPIC,
            ]),
        );
        //Note: redundant types in list below are a lazy/easy way to do probability weighting.
        successOutcome.AddStoryEffect(
            new StoryEffectGenerateLoot(0.5, [
                GlobalConst.ITEM_BASE_TYPE.COINBAG,
                GlobalConst.ITEM_BASE_TYPE.COINBAG,
                GlobalConst.ITEM_BASE_TYPE.GEM,
            ]),
        );
        successOutcome.AddStoryEffect(
            new StoryEffectGenerateLoot(
                0.5,
                [GlobalConst.ITEM_BASE_TYPE.FOOD, GlobalConst.ITEM_BASE_TYPE.FOOD, GlobalConst.ITEM_BASE_TYPE.POTION],
                [
                    GlobalConst.RARITY.UNCOMMON,
                    GlobalConst.RARITY.UNCOMMON,
                    GlobalConst.RARITY.RARE,
                    GlobalConst.RARITY.EPIC,
                ],
            ),
        );
        successOutcome.AddEndEvent();
    }
}
