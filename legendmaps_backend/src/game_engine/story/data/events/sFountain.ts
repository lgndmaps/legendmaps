import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectHeal from "../effects/seHeal";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectHunger from "../effects/seHunger";
import StoryEffectLuck from "../effects/seLuck";
import StoryEffectLoseGold from "../effects/seLoseGold";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGenerateBadPotion from "../effects/seGenerateBadPotion";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";

export default class StoryEventFountain extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.MAGIC_FOUNTAIN, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 14;

        this.titleCopy = "A Curious Fountain";
        this.bodyCopy =
            "A pale blue glow emanates from the waters of an ornate fountain. Its intricate features slow the passing current to a leisurely pace, and the gentle burbling as it spills into the large main basin lends a calming note to the ancient room.";
        this.mapGraphic = "fountain";

        let sip: StoryEventOption = new StoryEventOption(this);
        this.addOption(sip);
        sip.optionText = "Drink from the fountain. Cup your hands and drink deep. The waters look revitalizing.";
        sip.outcomeHint = "";
        let sr = new SuccessRoll(60);
        sip.AddSuccessCondition(sr);

        sip.outcomeSuccess = new StoryEventOutcome(
            "Water, as cool and refreshing as any you have ever tasted, spills down the sides of your lips as you drink. Its healing magic washes over you in a wave, until your body feels as though it has just risen from a slumber of ideal length. Healed & hunger sated.\n\nThe fountain dries up.",
        );
        sip.outcomeSuccess.AddStoryEffect(new StoryEffectHeal(50));
        sip.outcomeSuccess.AddStoryEffect(new StoryEffectHunger(100));
        sip.outcomeSuccess.AddEndEvent();

        sip.outcomeFail = new StoryEventOutcome(
            "Water, as foul and acidic as any you have ever tasted, chokes your lungs as you sputter, hoping to cough it out. It occurs to you that a pale blue glow may not be a sign of clean water, but of some sort of arcane contaminant. You feel drained and hungry.\n\nThe fountain dries up.",
        );

        sip.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Cursed waters. ", GlobalConst.EFFECT_TYPES.SPIRIT, -4, -2, 50),
        );
        sip.outcomeFail.AddStoryEffect(new StoryEffectHunger(-20));
        sip.outcomeFail.AddEndEvent();

        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Toss a coin into the fountain and say a prayer to Kleuf, the goddess of luck.";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(40));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "Kleuf smiles upon you as the pool glows an even more vivid blue for just a moment, a sign she has accepted your tribute. Her boons can be unpredictable, but still: every little bit helps. Permanent Luck Bonus.\n\nThe fountain dries up.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectLuck(1));
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectLoseGold(1, 1));
        opt2.outcomeSuccess.AddEndEvent();
        opt2.outcomeFail = new StoryEventOutcome(
            "The water splashes as the coin hit the surface, but nothing else happens. A moment later you hear footsteps and a raspy voice whispering, 'What's that, the sound of coins?'",
        );
        opt2.outcomeFail.AddStoryEffect(new StoryEffectLoseGold(1, 1));
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.GAINS_GOBLIN));
        opt2.outcomeFail.AddEndEvent();

        let opt3: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt3);
        opt3.optionText = "Attempt to craft a potion from the glowing waters.";
        opt3.outcomeHint = "";
        let sr3 = new SuccessRoll(20, GlobalConst.ATTRIBUTES.GUILE);
        sr3.AddTraitBonus(82, 50);
        opt3.AddSuccessCondition(sr3);
        opt3.outcomeSuccess = new StoryEventOutcome(
            "As you learned from reading the Alchemical Codex of Warrack Cove, the potential benefit of these waters are greatly enhanced through a simple treatment of saltpeter and bismuth. Happily, you carry both, along with a spare flask - and Father said alchemy wasn't a real discipline. Fool! The resulting potion glows with beneficial magics.",
        );
        opt3.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.POTION]));
        opt3.outcomeSuccess.AddEndEvent();
        opt3.outcomeFail = new StoryEventOutcome(
            "You are not, as it turns out, much of an alchemist. The waters turn a sickly green as you gather them into a flask. You are not sure what you have created, but it does not look promising.",
        );
        opt3.outcomeFail.AddStoryEffect(new StoryEffectGenerateBadPotion(1));
        opt3.outcomeFail.AddEndEvent();

        this.addLeaveOption(
            "Water? You have that at home! You will not be swayed by this, the most common of liquids.",
        );
    }
}
