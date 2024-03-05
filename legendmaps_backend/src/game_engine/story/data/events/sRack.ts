import StoryEventData from "../storyEventData";
import GlobalConst from "../../../types/globalConst";
import StoryEventOption from "../storyEventOption";
import StoryEventOutcome from "../storyEventOutcome";
import SuccessRoll from "../conditions/ecSuccessRoll";
import StoryEffectGenerateLoot from "../effects/seGenerateLoot";
import StoryEffectAddEffect from "../effects/seAddEffect";
import SpendKeys from "../conditions/ecSpendKeys";
import StoryEffectGenerateDwellers from "../effects/seGenerateDwellers";

export default class StoryEventRack extends StoryEventData {
    constructor() {
        super(GlobalConst.STORY_EVENT_KEYS.TORTURE, GlobalConst.STORY_EVENT_CATEGORY.INTERACTIVE_ITEM);

        this.allowRandomSpawns = true;
        this.randomSpawnWeight = 10;

        this.titleCopy = "The Rack & Caged Kobold";
        this.bodyCopy =
            'You hear the fearful grunting of a kobold well before you see him, and when you do, the reason for his disquiet is clear. A giant torture rack sits beside him; its cruel mechanisms lie in wait for their next victim. And if the cage is any indication, the poor trapped kobold is first in line. He fidgets pointedly with his claw inside the lock. "Please!" the kobold barks. "I don\'t know when they\'ll come back, but when they do, my life is over! Free me before they return! Hurry!" You hear noises in the distance, but you cannot be certain if they are what the kobold fears.';
        this.mapGraphic = "torture";

        //UNLOCK OPTION
        let unlock: StoryEventOption = new StoryEventOption(this);
        this.addOption(unlock);
        unlock.optionText = "Key. Use a key to unlock the cage.";
        unlock.outcomeHint = "Success: 100%. A key never fails. ";
        unlock.AddSuccessCondition(new SpendKeys(1));
        unlock.outcomeSuccess = new StoryEventOutcome(
            '. He barely has time to register what\'s happened before you open the cage to set him free. He kneels before you for a moment, panting, "Thank you! Thank you!" before taking off into the dungeon. You figure any kind of reward is likely gone with him, but you realize saving a life is its own reward, and it strengthens your resolve.',
        );
        unlock.outcomeSuccess.AddStoryEffect(
            new StoryEffectAddEffect("Freedom's Blessing", GlobalConst.EFFECT_TYPES.SPIRIT, 3),
        );

        unlock.outcomeSuccess.AddEndEvent();

        unlock.outcomeFail = new StoryEventOutcome(
            "Alas, you have no keys. Perhaps you might find some in the dungeon and return?",
        );
        unlock.outcomeFail.AddEndEvent(false);

        //OPTION 1
        let opt1: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt1);
        opt1.optionText = "Pick Lock. Unlock the cage and free him.";
        opt1.outcomeHint = "";

        opt1.AddSuccessCondition(new SuccessRoll(40, GlobalConst.ATTRIBUTES.GUILE));

        opt1.outcomeSuccess = new StoryEventOutcome(
            'Such an old lock is simple enough to open, and after a few moments prodding, the lock pops open and the kobold is free. He embraces you briefly, and when he pulls back, he says, "I\'ve left a trinket behind the cage in the corner - it is yours! Thank you stranger!" The kobold skitters off into the darkness, but you check behind the cage, and what do you know? Something glimmers there.',
        );
        opt1.outcomeSuccess.AddStoryEffect(
            new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.WRIST, GlobalConst.ITEM_BASE_TYPE.RING]),
        );
        opt1.outcomeSuccess.AddEndEvent();

        opt1.outcomeFail = new StoryEventOutcome(
            "You are certain you can manage this, despite the kobold's protests you are way off the mark. He begins trying to squeeze through a small gap in the bars of his cage, and is long gone by the time you actually do manage to pick the lock. Unfortunately the only people to show your accomplishment to are the pair of hob gobs who were expecting to find a caged kobold.",
        );
        opt1.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.HOBGOB, null, 2));
        opt1.outcomeFail.AddEndEvent();

        //OPTION 2
        let opt2: StoryEventOption = new StoryEventOption(this);
        this.addOption(opt2);
        opt2.optionText = "Destroy the rack. No kobold or any other creature will suffer such a fate. ";
        opt2.outcomeHint = "";
        opt2.AddSuccessCondition(new SuccessRoll(40, GlobalConst.ATTRIBUTES.BRAWN));
        opt2.outcomeSuccess = new StoryEventOutcome(
            'After a few choice blows to the gears below, the rack comes apart as easily as a pasture fence. You use the largest timbers to smash the rest of it, rendering the whole device a crumpled, useless mess. Meanwhile, the kobold has managed to free himself, and he shouts to you as he makes his escape: "The kobolds will not forget you! You have saved many with your strength!" You were hoping for gold, but you\'ll take a nice compliment. Resigned to no reward, you notice something glimmering in the back of the cage.',
        );
        opt2.outcomeSuccess.AddStoryEffect(new StoryEffectGenerateLoot(1, [GlobalConst.ITEM_BASE_TYPE.GEM]));
        opt2.outcomeSuccess.AddEndEvent();

        opt2.outcomeFail = new StoryEventOutcome(
            "You're strong, but this is a feat of tormented engineering. You expected to disassemble this without the proper tools? The kobold realizes you are mad quickly, and picks the lock without your help as you tug in vain at the rack's straps. You've barely managed to put a dent in the device when its owner returns, and they are not wild about your little project.",
        );
        opt2.outcomeFail.AddStoryEffect(new StoryEffectGenerateDwellers(GlobalConst.DWELLER_KIND.HOBGOB, null, 1));
        opt2.outcomeFail.AddEndEvent();

        this.addLeaveOption("You will do nothing for this kobold, you cannot risk the wrath of his captors.");
    }
}
