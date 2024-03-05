import type Game from "../game";

/**
 * Any player client_comm is converted to a Command which is processed by Game,
 * it will be validated, then accepted or rejected
 */
export default abstract class Command {
    game: Game;
    duration: number = 1; //most commands take 1 turn
    resetVisibility: boolean = false; //determines if visibility should be toggled for all tiles before running.

    constructor(game: Game) {
        this.game = game;
    }

    Validate(): boolean {
        return false;
    }

    Execute() {}
}
