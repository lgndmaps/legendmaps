import StoryEvent from "../storyEvent";
import Game from "../../game";
import SkillBonus from "./conditions/SkillBonus";

export default abstract class StoryEventCondition {
    skillBonuses: SkillBonus[] = [];

    //Gets a description of the condition (chance of success, etc).
    GetDescription(game: Game, storyEvent: StoryEvent): string {
        return "";
    }

    /**
     * Checks if a Condition is true given current option
     */
    Check(game: Game): boolean {
        return false; //abstract class, every inheritor must implement this
    }
}
