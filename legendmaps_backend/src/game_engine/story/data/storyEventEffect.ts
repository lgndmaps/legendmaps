import Game from "../../game";
import StoryEvent from "../storyEvent";

export default abstract class StoryEventEffect {
    Apply(game: Game, storyEvent: StoryEvent) {
        return;
    }
}
