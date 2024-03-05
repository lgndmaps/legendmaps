import {Geom} from "phaser";
import GlobalConst from "../types/globalConst";

export type GameFlowScreens =
    | "splash"
    | "landing"
    | "adventurer select"
    | "apply powerup"
    | "map select"
    | "gameplay"
    | "death"
    | "level up"
    | "run complete"
    | "campaign complete"
    | "alpha thank you"


/*
Implemented by any object which the
InputManager will consider the current
authority on what to do with input.
*/
export type InputController = {
    blockInput: boolean;


    keyPressed(keyCode: number): void;
    moveKeyPressed(dir: GlobalConst.MOVE_DIR);
    touch(point: Geom.Point);
    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Geom.Point, swipeEnd: Geom.Point): void;
    pointerMove(x: number, y: number);
    escapePressed(): void;
    optionPressed(opt: number): void;
    confirmPressed(): void;
};
