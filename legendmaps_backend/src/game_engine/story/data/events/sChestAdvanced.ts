import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SpendKeys from "../conditions/ecSpendKeys";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectLoseGold from "../effects/seLoseGold";
import StoryEffectDamage from "../effects/seDamage";
import StoryEffectAllAttributes from "../effects/seEffectAllAttributes";
import StoryEffectAddEffect from "../effects/seAddEffect";

export default class StoryEventChestAdvanced extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.ADV_CHEST, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = false; //FALSE because chest spawns are handled on their own.
        this.randomSpawnWeight = 10;

        this.titleCopy = "Rare Chest";
        this.bodyCopy =
            "A chest of uncommon quality sits on a dais at the rear of the chamber, giving you pause. You're an adventurer; you've seen your fair share of chests. And you also know it's not every day that one encounters a chest with a lock fortified by arcane sigils. The contents within could be equally impressive, should you manage to bypass the ward.";
        this.mapGraphic = "chest";

        //UNLOCK OPTION
        let unlock: StoryEventOption = new StoryEventOption(this);
        this.addOption(unlock);
        unlock.optionText = "Use a key to open the chest.";
        unlock.outcomeHint = "Success: 100%. A key never fails. ";
        unlock.AddSuccessCondition(new SpendKeys(1));
        unlock.outcomeSuccess = new StoryEventOutcome(
            "The arcane markings fade and the chest unlocks, its contents now yours.",
        );
        this.AddChestLoot(unlock.outcomeSuccess);
        unlock.outcomeFail = new StoryEventOutcome(
            "Alas, you have no keys. Perhaps you might find some in the dungeon and return?",
        );
        unlock.outcomeFail.AddEndEvent(false);

        //BREAK IT OPTION
        let smash: StoryEventOption = new StoryEventOption(this);
        this.addOption(smash);
        smash.optionText = "Attempt to breach it conventionally. Might makes right... right?";
        smash.outcomeHint = "";
        smash.AddSuccessCondition(new SuccessRoll(20, GlobalConst.ATTRIBUTES.BRAWN));
        smash.outcomeSuccess = new StoryEventOutcome(
            "Success. Against all odds, your sheer power is no match for thousands of years of spellcraft, as it seems they could not anticipate that someone would be willing to hit a box that hard. The prize of awaits you within.",
        );
        this.AddChestLoot(smash.outcomeSuccess);
        smash.outcomeFail = new StoryEventOutcome(
            "Fail. You tire yourself quickly pummeling the chest, which could seemingly withstand days of punishment. You give it one last kick out of frustration and stub your toe on the edge. A foolish move, but let's be honest: it's no more foolish than trying to open a magical chest with your hands. ",
        );
        smash.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(5, true, GlobalConst.DAMAGE_TYPES.BLUDGEON, "stubbed toe"),
        );
        smash.outcomeFail.AddEndEvent();

        //PICK IT OPTION
        let pickit: StoryEventOption = new StoryEventOption(this);
        this.addOption(pickit);
        pickit.optionText = "Cast a counterspell. Surely the chest's owner would not seal the chest permanently.";
        pickit.outcomeHint = "";
        let successRoll = new SuccessRoll(20, GlobalConst.ATTRIBUTES.SPIRIT);
        successRoll.AddTraitBonus(77, 25); //apprentice and initiate
        successRoll.AddTraitBonus(78, 25);
        pickit.AddSuccessCondition(successRoll);
        pickit.outcomeSuccess = new StoryEventOutcome(
            "Success. A wizened old man at the Smiling Basilisk tried to teach you how to break a locking spell once, but he was in his cups, as were you. With the genuine article in front of you, however, you start to recall his teachings. The old man may have been drunk, but the fundamentals he taught were sound, and you've got the loot to prove it.",
        );
        this.AddChestLoot(pickit.outcomeSuccess);

        pickit.outcomeFail = new StoryEventOutcome(
            "Fail. You're not exactly sure how this works, but your optimism has led you to give it a try! It's important to remember that optimism can be dangerous though, as your ineffectual mutterings and nonsense hand gestures only result in triggering the ward, which blasts you back onto the floor. You rub your head from the impact and decide it's best to move on.",
        );
        pickit.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Spirit Curse", GlobalConst.EFFECT_TYPES.SPIRIT, -2, -1, 50),
        );
        pickit.outcomeFail.AddEndEvent();

        //LEAVE OPTIONS
        this.addLeaveOption("Best not to risk it.");
    }

    AddChestLoot(successOutcome: StoryEventOutcome) {
        successOutcome.outcomeText += "\nYou find: ";
        successOutcome.AddStoryEffect(
            new StoryEffectGenerateLoot(1, "any", [
                GlobalConst.RARITY.RARE,
                GlobalConst.RARITY.RARE,
                GlobalConst.RARITY.EPIC,
                GlobalConst.RARITY.LEGENDARY,
            ]),
        );
        //Note: redundant types in list below are a lazy/easy way to do probability weighting.
        successOutcome.AddStoryEffect(
            new StoryEffectGenerateLoot(0.7, [
                GlobalConst.ITEM_BASE_TYPE.COINBAG,
                GlobalConst.ITEM_BASE_TYPE.COINBAG,
                GlobalConst.ITEM_BASE_TYPE.GEM,
            ]),
        );
        successOutcome.AddStoryEffect(
            new StoryEffectGenerateLoot(
                1,
                [GlobalConst.ITEM_BASE_TYPE.FOOD, GlobalConst.ITEM_BASE_TYPE.POTION, GlobalConst.ITEM_BASE_TYPE.SCROLL],
                [GlobalConst.RARITY.RARE, GlobalConst.RARITY.EPIC, GlobalConst.RARITY.LEGENDARY],
            ),
        );
        successOutcome.AddEndEvent();
    }
}
