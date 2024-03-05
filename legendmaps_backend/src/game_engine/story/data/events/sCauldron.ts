import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGiveGold from "../effects/seGiveGold";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectHeal from "../effects/seHeal";
import StoryEffectAddEffect from "../effects/seAddEffect";
import StoryEffectDamage from "../effects/seDamage";
import StoryEffectGenerateBadPotion from "../effects/seGenerateBadPotion";

export default class StoryEventCauldron extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.CAULDRON, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 0;

        this.titleCopy = "Cauldron";
        this.bodyCopy =
            "A stout iron cauldron sits simmering at the center of the room, hazy emerald vapors rising from its surface. You see no sign of anyone nearby to claim this cauldron as their own, but someone started the fire beneath and tended to it. Obviously the safest thing to do is to walk away, however; a magical brew could aid you in your travels... or cover you in boils. Decisions, decisions.";
        this.mapGraphic = "cookpot";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Sample some of the cauldron's contents. Try a small taste.";
        opt1.outcomeHint = "";

        let sr = new SuccessRoll(50);
        opt1.AddSuccessCondition(sr);

        opt1.outcomeSuccess = new StoryEventOutcome(
            ") Drinking strange decoctions from unattended cauldrons sounds like a bad idea, but in this instance, it's proved the wiser course. Despite its overwhelmingly minty flavor, the contents of the cauldron leave you feeling lighter and more refreshed than you ever expected. You decide to set a new policy: you will drink anything you see, no matter how risky. It's bound to work out!",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectHeal(25));
        opt1.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Refreshing Brew", GlobalConst.EFFECT_TYPES.AGILITY, 2),
        );
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "In the history of the poor decisions you've made in your life, this is one you'll look back on most often and think, \"Why did I think this was going to be a good decision?\" One sip from the ladle inside the cauldron sets your tongue ablaze, and the effect once inside your stomach isn't much better. Let it be known: drinking from odd vessels will only end in sorrow! ",
        );
        opt1.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(10, true, GlobalConst.DAMAGE_TYPES.NECROTIC, "Foul brew"),
        );
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Knock over the cauldron. This stinks of witchcraft and must be put to an end.";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(35, GlobalConst.ATTRIBUTES.BRAWN));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "You're smart enough to use the bottom of your boots to kick over the boiling hot cauldron, and after a moment's push, you topple it over, spilling its noxious cargo all over the ground. A frenzied ditch witch returns, furious you've ruined a week's work, but is pleasantly surprised when the spilled potion causes a massive mushroom bloom in a matter of seconds! She seems so happy that she makes sure you take some snacks with you \"for the road.\"",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.FOOD]));
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.FOOD]));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "Two things working against your plan: most cauldrons are heavy, and this cauldron is HOT. You press your bare shoulder against the cauldron to force it to tip, and immediately scald the bulk of your right arm. You quickly set about applying a soothing salve to the burn, but you are interrupted by the return of the cauldron's owner. Your explanation that you were doing exercises against the cauldron strains believability",
        );
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.DITCH_WITCH));
        opt2.outcomeFail.AddEndEvent();

        let opt3: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt3);
        opt3.optionText = "Improve the recipe. Just a few additions could render a potent result.";
        opt3.outcomeHint = "";
        let sr3 = new SuccessRoll(25, GlobalConst.ATTRIBUTES.GUILE);
        sr3.AddTraitBonus(82, 50);
        opt3.AddSuccessCondition(sr3);
        opt3.outcomeSuccess = new StoryEventOutcome(
            "Talmonium, willow root, and some stalks of limegrass would perfect this, you reckon. Luckily you still carry your miniature pharmakon with you, and you stir the new ingredients in as the mixture turns an inviting mauve. You take a sip and smile in the knowledge that you've still got it. You bottle up some for later and congratulate yourself on your reading on alchemy. ",
        );
        opt3.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.POTION]));
        opt3.outcomeSuccess.AddEndEvent();
        opt3.outcomeFail = new StoryEventOutcome(
            "t's been a while since you tried to finish someone's formula for them, but you're fairly certain the greenish gas being released is from powdered moldavite. You make a few leaps of intuition from your alchemical training, and add an infusion of shark's tooth and bezerine to create an effervescent potion to boost your dexterity. You drink a cupful and realize you have been out of school a long time. ",
        );
        opt3.outcomeFail.AddStoryEffect(new StoryEffectAddEffect("Fouled Brew", GlobalConst.EFFECT_TYPES.AGILITY, -2));
        opt3.outcomeFail.AddEndEvent();

        this.addLeaveOption("Leave. There is little to be gained from meddling in the affairs of witches.");
    }
}
