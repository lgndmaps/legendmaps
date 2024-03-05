import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";
import StoryEffectGiveCondition from "../effects/seGiveCondition";
import StoryEffectLuck from "../effects/seLuck";
import StoryEffectLoseGold from "../effects/seLoseGold";
import StoryEffectGenerateBadPotion from "../effects/seGenerateBadPotion";
import StoryEffectDamage from "../effects/seDamage";

export default class StoryEventAltar extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.ALTAR, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 10;

        this.titleCopy = "Altar of Voach";
        this.bodyCopy =
            "The warm glow of stout candles surround a broad altar to Voach, the god of battle. You see faded red banners bearing Voach's sigil hanging on the walls behind, possibly for hundreds of years. The altar itself is made of simple stone, but it has been dyed a sickening red for all the blood that has been collected as tribute over the centuries. ";
        this.mapGraphic = "altar";

        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Pledge yourself to Voach. The god of war will grant you strength.";
        opt2.outcomeHint = "Strength is not without cost.";
        opt2.outcomeSuccess = new StoryEventOutcome(
            "You steel yourself momentarily and draw a dagger across your hand. You smear the warm blood across the altar into the angular shape of Voach's sigil. The candle flames grow taller as you hear the faint sound of far-off screams in your ears. Voach is pleased with your offering, and spurs you on to fight for their honor. ",
        );

        opt2.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Voach's Strength", GlobalConst.EFFECT_TYPES.BRAWN, 3, 5, 100),
        );
        opt2.outcomeSuccess.AddStoryEffect(
            new StoryEffectDamage(8, false, GlobalConst.DAMAGE_TYPES.BLADE, "blood sacrifice"),
        );
        opt2.outcomeSuccess.AddEndEvent();

        let opt3: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt3);
        opt3.optionText = "Pray. Voach is said to grant weapons to devoted followers.";
        opt3.outcomeHint = "";
        let sr3 = new SuccessRoll(30, GlobalConst.ATTRIBUTES.SPIRIT);
        opt3.AddSuccessCondition(sr3);
        opt3.outcomeSuccess = new StoryEventOutcome(
            "You remember enough of invocation to Voach to not muck it up too badly, you feel Voach is well please. With a flash brilliant light a weapon appears on the altar. A voice booms from the heavens 'let us see you wield it, mortal.' A red mist fills the air before you, and something emerges from within.",
        );
        opt3.outcomeSuccess.AddStoryEffect(
            new StoryEffectGenerateLoot(1, [
                GlobalConst.ITEM_BASE_TYPE.HAMMER,
                GlobalConst.ITEM_BASE_TYPE.STAFF,
                GlobalConst.ITEM_BASE_TYPE.DAGGER,
            ]),
        );
        opt3.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.TROLL));
        opt3.outcomeSuccess.AddEndEvent();
        opt3.outcomeFail = new StoryEventOutcome(
            "Your request, delivered meekly and without conviction, has not only been declined, but judged an insult. Candles begin to sputter. With a flash sickly light a pathetic weapon appears on the altar. A voice booms from the heavens with a chuckle 'let us see you use this, mortal, it is more than you deserve.' A red mist fills the air before you, and something emerges from within.",
        );
        opt3.outcomeFail.AddStoryEffect(
            new StoryEffectGenerateLoot(
                1,
                [
                    GlobalConst.ITEM_BASE_TYPE.HAMMER,
                    GlobalConst.ITEM_BASE_TYPE.STAFF,
                    GlobalConst.ITEM_BASE_TYPE.DAGGER,
                ],
                [GlobalConst.RARITY.COMMON],
                1,
            ),
        );
        opt3.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.TROLL));

        opt3.outcomeFail.AddEndEvent();

        this.addLeaveOption("You do not tarry with gods, and for good reason. ");
    }
}
