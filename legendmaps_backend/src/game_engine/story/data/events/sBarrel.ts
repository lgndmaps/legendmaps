import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGiveCondition from "../effects/seGiveCondition";
import StoryEffectGiveGold from "../effects/seGiveGold";
import StoryEffectDamage from "../effects/seDamage";
import StoryEffectGenerateBadPotion from "../effects/seGenerateBadPotion";

export default class StoryEventBarrel extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.BARREL, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 15;

        this.titleCopy = "Wooden Barrel";
        this.bodyCopy =
            "As you approach the barrel, you can see that it is made of sturdy oak and bound with iron hoops. It looks like it has seen a lot of use, and the wood is scarred and stained. You can hear the sound of liquid sloshing around inside. It's unclear what the barrel might contain, but it could be anything from ale to oil to pickled vegetables. You will have to investigate further to find out.";
        this.mapGraphic = "barrel";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Gather some of the contents.";
        opt1.outcomeHint = "";

        let sr3 = new SuccessRoll(25, GlobalConst.ATTRIBUTES.GUILE);
        sr3.AddTraitBonus(82, 30);
        opt1.AddSuccessCondition(sr3);

        opt1.outcomeSuccess = new StoryEventOutcome(
            "You can see that it has a small tap near the bottom. You carefully turn the tap to release a small stream of liquid into your cup. The liquid is a shimmering blue color, and it gives off a sweet, fruity aroma. You carefully sip the liquid, and you can feel its magical properties coursing through your veins. You have just collected a potion!",
        );
        opt1.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.POTION]));
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "You can see that it has a small tap near the bottom. You carefully turn the tap to release a small stream of liquid into your cup. The liquid is a shimmering green color, and it gives off a pungent, acrid smell. You cautiously sip the liquid, and you can feel a burning sensation in your mouth and throat. You quickly realize that the potion is toxic and spit it out. You will have to be more careful in the future ",
        );
        opt1.outcomeFail.AddStoryEffect(new StoryEffectGenerateBadPotion(1));
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Smash. You have an urge to break something. ";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(40, GlobalConst.ATTRIBUTES.BRAWN));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "Seeing the opportunity to search for treasure, you step forward and give the barrel a good whack. The barrel cracks open, sending a spray of oily liquid everywhere. You see a glint of metal in the debris, and upon closer inspection, you find a small, ornately decorated dagger. The weapon looks to be in good condition, despite the debris it's covered in. You quickly claim it as your own and wipe it clean. The oil has a strong, unpleasant odor, and you decide not to investigate further.",
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.DAGGER]));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "You step forward and give the barrel a good whack. The barrel cracks open, and suddenly, there's a loud boom as the barrel explodes, sending shards of wood and a spray of oily liquid everywhere. You're thrown backwards, and you feel a sharp pain as a piece of wood hits you in the arm. When the dust settles, you see that the explosion has caused chaos and destruction in the area. You're shaken by the sudden explosion, but you're determined to carry on, despite any other aggressive barrels that may be lurking.",
        );
        opt2.outcomeFail.AddStoryEffect(
            new StoryEffectDamage(10, true, GlobalConst.DAMAGE_TYPES.PIERCE, "barrel shard"),
        );
        opt2.outcomeFail.AddEndEvent();

        this.addLeaveOption("Nothing good would be stored in such a place.");
    }
}
