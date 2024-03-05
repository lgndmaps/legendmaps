import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectAddEffect from "../effects/seAddEffect";

export default class StoryEventPyramid extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.PYRAMID, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 8;

        this.titleCopy = "Altar of the Gawds";
        this.bodyCopy =
            "You come across a strange, pyramid-shaped altar. It's made of a smooth, jet-black stone, and it's covered in intricate carvings and symbols. The altar is tall and imposing, and it exudes a mysterious, otherworldly energy. You can feel the power emanating from the altar, and you know that it's not a place to be taken lightly. You cautiously approach the altar, and you can't shake the feeling that you're being watched. You know that whatever ancient power resides within this altar, it's not to be trifled with.";
        this.mapGraphic = "pyramid";

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Worship. A test of strength.";
        opt1.outcomeHint = "";

        opt1.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.BRAWN));

        opt1.outcomeSuccess = new StoryEventOutcome(
            "A heavy weight falls upon your shoulders, pushing you to the ground. Straining, you manage to resist and remain standing. You feel a surge of power, and you know that you have pleased the ancient power within the altar. You feel new strength, and you know that you have earned the favor of the Gawds.",
        );
        opt1.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Brawn", GlobalConst.EFFECT_TYPES.BRAWN, 3, -1, 250),
        );
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "A heavy weight falls upon your shoulders, pushing you to the ground. Straining, you feel your knees buckle and you fall to the ground. The air goes cold and you know you have displeased the Gawds. ",
        );
        opt1.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Frailty", GlobalConst.EFFECT_TYPES.BRAWN, -1, -1, 250),
        );
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Marvel. A challenge of dexterity.";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.AGILITY));
        opt2.outcomeSuccess = new StoryEventOutcome(
            "With a shudder, black beams emanate from the crown of the pyramid. You nimbly lead aside as each one strikes the ground.  You feel a surge of power, and you know that you have pleased the ancient power within the altar. You feel agile & you know that you have earned the favor of the Gawds.",
        );
        opt2.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Agility", GlobalConst.EFFECT_TYPES.AGILITY, 3, -1, 250),
        );
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "With a shudder, black beams emanate from the crown of the pyramid. You try to dodge, but they are too fast, one of them strikes you right through your knee. It does not hurt, but the the air goes cold and you know you have displeased the Gawds. ",
        );
        opt2.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Clumsiness", GlobalConst.EFFECT_TYPES.AGILITY, -1, -1, 250),
        );
        opt2.outcomeFail.AddEndEvent();

        //OPTION 3
        let opt4: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt4);
        opt4.optionText = "Cower. Keep your wits.";
        opt4.outcomeHint = "";
        opt4.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.GUILE));
        opt4.outcomeSuccess = new StoryEventOutcome(
            "You vision fills with dozens of fast moving Wisps in different colors. You study the patterns, noting many are simple illusions and one is more solid that the others. You strike out quickly, grabbing it from the air. You feel a surge of power, and you know that you have pleased the ancient power within the altar. You feel more clever & you know that you have earned the favor of the Gawds. ",
        );
        opt4.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Wits", GlobalConst.EFFECT_TYPES.GUILE, 3, -1, 250),
        );
        opt4.outcomeSuccess.AddEndEvent();

        opt4.outcomeFail = new StoryEventOutcome(
            "You vision fills with dozens of fast moving Wisps in different colors. You study the patterns, but can find no rhyme or reason to their movements. You last out randomly and they all disappear in a puff. The air goes cold and you know you have displeased the Gawds. ",
        );
        opt4.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Foolishness", GlobalConst.EFFECT_TYPES.GUILE, -1, -1, 250),
        );
        opt4.outcomeFail.AddEndEvent();

        //OPTION 3
        let opt3: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt3);
        opt3.optionText = "Sacrifice. Temper your will.";
        opt3.outcomeHint = "";
        opt3.AddSuccessCondition(new SuccessRoll(25, GlobalConst.ATTRIBUTES.SPIRIT));
        opt3.outcomeSuccess = new StoryEventOutcome(
            "Without hesitation you hold up your most treasured weapon before the pyramid, willing to let it go, but aware that it will remain true. You feel a surge of power, and you know that you have pleased the ancient power within the altar. You know that you have earned the favor of the Gawds.",
        );
        opt3.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Spirit", GlobalConst.EFFECT_TYPES.SPIRIT, 3, -1, 250),
        );
        opt3.outcomeSuccess.AddEndEvent();

        opt3.outcomeFail = new StoryEventOutcome(
            "You do not know what the Gawds want, pondering what things you might be willing to part with in exchange for some favor. Your indecision leads nowhere. The air goes cold and you know you have displeased the Gawds.",
        );
        opt3.outcomeFail.AddStoryEffect(
            new StoryEffectAddEffect("Gawd's Dread", GlobalConst.EFFECT_TYPES.SPIRIT, -1, -1, 250),
        );
        opt3.outcomeFail.AddEndEvent();

        this.addLeaveOption("You fear the dangers of this place. ");
    }
}
