import StoryEvent from "../../storyEvent";
import Game from "../../../game";
import StoryEventCondition from "../storyEventCondition";

export default class SpendKeys extends StoryEventCondition {
    cost: number;

    constructor(cost: number) {
        super();
        this.cost = cost;
    }

    override GetDescription(game: Game, storyEvent: StoryEvent): string {
        return "-" + this.cost + (this.cost > 1 ? " keys" : " key");
    }

    override Check(game: Game): boolean {
        if (game.dungeon.character.keys >= this.cost) {
            game.dungeon.character.keys -= this.cost;
            return true;
        } else {
            return false;
        }
    }
}
